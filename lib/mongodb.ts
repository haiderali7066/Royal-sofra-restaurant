import { MongoClient, type Db } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  }

  const client = new MongoClient(uri)
  return client.connect()
}

let clientPromise: Promise<MongoClient> | undefined

function getClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = createClientPromise()
  }
  return clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db('royal_sofra')
}

export default getClientPromise
