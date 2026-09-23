import { NextRequest, NextResponse } from 'next/server'
import { staffCollection } from '@/lib/collections'
import { getApiAdmin } from '@/lib/session'
import type { StaffMember } from '@/lib/types'

export async function GET() {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const staff = await staffCollection()
  const results = await staff.find({}).toArray()
  return NextResponse.json({ staff: results })
}

export async function POST(request: NextRequest) {
  const admin = await getApiAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body?.name || !body?.email || !body?.role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const member: StaffMember = {
    id: `stf-${Date.now()}`,
    name: body.name,
    email: body.email,
    role: body.role,
    status: body.status || 'Active',
  }

  const staff = await staffCollection()
  await staff.insertOne(member)
  return NextResponse.json({ member }, { status: 201 })
}
