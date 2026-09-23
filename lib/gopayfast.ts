// Client for gopayfast.com (PayFast Pakistan), a direct server-to-server payment API
// (not a hosted redirect like the South-Africa PayFast). The flow is:
//   1. getAccessToken()   -> exchange merchant credentials for a short-lived token
//   2. postTransaction()  -> submit the order + instrument details, gateway sends an OTP
//   3. validateOtp()      -> submit the OTP the customer received to complete the payment
//
// IMPORTANT: gopayfast.com's public docs page did not expose field-level schema details
// at the time this was written. The endpoint paths and field names below follow the
// documented pattern for PayFast Pakistan's Ecommerce API (GetAccessToken / PostTransaction),
// but MUST be verified against the real sandbox Postman collection once real
// GOPAYFAST_MERCHANT_ID / GOPAYFAST_SECURED_KEY credentials are available. Treat this as a
// best-effort scaffold, not a verified integration.

const DEFAULT_BASE_URL = 'https://ipguat.apps.net.pk' // gopayfast/PayFast PK sandbox host

function getConfig() {
  const merchantId = process.env.GOPAYFAST_MERCHANT_ID
  const securedKey = process.env.GOPAYFAST_SECURED_KEY
  const baseUrl = process.env.GOPAYFAST_BASE_URL || DEFAULT_BASE_URL

  if (!merchantId || !securedKey) {
    throw new Error('GOPAYFAST_MERCHANT_ID and GOPAYFAST_SECURED_KEY must be set to use gopayfast.com payments')
  }

  return { merchantId, securedKey, baseUrl }
}

export function isGopayfastConfigured(): boolean {
  return Boolean(process.env.GOPAYFAST_MERCHANT_ID && process.env.GOPAYFAST_SECURED_KEY)
}

interface AccessTokenResponse {
  ACCESS_TOKEN?: string
  access_token?: string
  [key: string]: unknown
}

export async function getAccessToken(basketId: string, amount: number): Promise<string> {
  const { merchantId, securedKey, baseUrl } = getConfig()

  const res = await fetch(`${baseUrl}/Ecommerce/api/Transaction/GetAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      MERCHANT_ID: merchantId,
      SECURED_KEY: securedKey,
      BASKET_ID: basketId,
      TXNAMT: amount.toFixed(2),
      CURRENCY_CODE: 'PKR',
    }),
  })

  if (!res.ok) {
    throw new Error(`gopayfast GetAccessToken failed with status ${res.status}`)
  }

  const data: AccessTokenResponse = await res.json()
  const token = data.ACCESS_TOKEN || data.access_token
  if (!token) {
    throw new Error('gopayfast did not return an access token')
  }
  return token
}

export type GopayfastInstrument = 'card' | 'easypaisa' | 'jazzcash'

export interface PostTransactionParams {
  accessToken: string
  basketId: string
  amount: number
  orderId: string
  customerName: string
  customerEmail: string
  customerMobile: string
  instrument: GopayfastInstrument
  successUrl: string
  failUrl: string
  // Card-only fields.
  cardNumber?: string
  cardExpiryMonth?: string
  cardExpiryYear?: string
  cardCvv?: string
}

export interface PostTransactionResult {
  requiresOtp: boolean
  transactionId?: string
  status?: string
  message?: string
  raw: Record<string, unknown>
}

export async function postTransaction(params: PostTransactionParams): Promise<PostTransactionResult> {
  const { merchantId, baseUrl } = getConfig()

  const isWallet = params.instrument === 'easypaisa' || params.instrument === 'jazzcash'

  const payload: Record<string, unknown> = {
    MERCHANT_ID: merchantId,
    ACCESS_TOKEN: params.accessToken,
    BASKET_ID: params.basketId,
    TXNAMT: params.amount.toFixed(2),
    ORDER_DATE: new Date().toISOString(),
    CUSTOMER_NAME: params.customerName,
    CUSTOMER_EMAIL_ADDRESS: params.customerEmail,
    CUSTOMER_MOBILE_NO: params.customerMobile,
    SUCCESS_URL: params.successUrl,
    FAIL_URL: params.failUrl,
    PROCCODE: '00',
    TRAN_TYPE: isWallet ? 'ECOMM_WALLET' : 'ECOMM_PURCHASE',
    ACCOUNT_TYPE: isWallet ? params.instrument.toUpperCase() : 'CARD',
    ORDER_ID: params.orderId,
    ...(params.instrument === 'card'
      ? {
          CARD_NUMBER: params.cardNumber,
          EXPIRY_MONTH: params.cardExpiryMonth,
          EXPIRY_YEAR: params.cardExpiryYear,
          CVV: params.cardCvv,
        }
      : {}),
  }

  const res = await fetch(`${baseUrl}/Ecommerce/api/Transaction/PostTransaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`gopayfast PostTransaction failed with status ${res.status}`)
  }

  const raw = await res.json()
  const status = String(raw.RESPONSE_CODE ?? raw.status ?? '').toUpperCase()

  return {
    requiresOtp: status === 'OTP_REQUIRED' || status === 'PENDING',
    transactionId: raw.TRAN_ID || raw.transaction_id,
    status,
    message: raw.RESPONSE_MESSAGE || raw.message,
    raw,
  }
}

export interface ValidateOtpParams {
  accessToken: string
  basketId: string
  transactionId?: string
  otp: string
}

export interface ValidateOtpResult {
  success: boolean
  message?: string
  raw: Record<string, unknown>
}

export async function validateOtp(params: ValidateOtpParams): Promise<ValidateOtpResult> {
  const { merchantId, baseUrl } = getConfig()

  const res = await fetch(`${baseUrl}/Ecommerce/api/Transaction/PostTransaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      MERCHANT_ID: merchantId,
      ACCESS_TOKEN: params.accessToken,
      BASKET_ID: params.basketId,
      TRAN_ID: params.transactionId,
      OTP: params.otp,
      TRAN_TYPE: 'OTP_VALIDATE',
    }),
  })

  if (!res.ok) {
    throw new Error(`gopayfast OTP validation failed with status ${res.status}`)
  }

  const raw = await res.json()
  const status = String(raw.RESPONSE_CODE ?? raw.status ?? '').toUpperCase()

  return {
    success: status === 'SUCCESS' || status === '00' || status === 'APPROVED',
    message: raw.RESPONSE_MESSAGE || raw.message,
    raw,
  }
}
