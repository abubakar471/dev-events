import mongoose, { Mongoose } from "mongoose";

/**
 * Cached database connection across hot reloads in development.
 * This avoids creating multiple connections to the database.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Augment the global object type so we can attach our cache to it.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Use a single global cache in Node.js to survive module reloads in Next.js dev.
const globalCache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = globalCache;
}

// Read the MongoDB connection string from environment variables.
// This should be set in your Next.js env config (e.g. .env.local).
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable in your environment configuration."
  );
}

/**
 * Establishes (or reuses) a single Mongoose connection.
 *
 * - In production, this creates a single connection for the server runtime.
 * - In development, the connection is cached on the global object to
 *   prevent creating multiple connections during hot reloads.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  // If a connection already exists, reuse it.
  if (globalCache.conn) {
    return globalCache.conn;
  }

  // If a connection is already being established, reuse the in-flight promise.
  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      // Add any Mongoose connection options you need here.
      // keepAlive helps keep connections open in serverless environments.
      serverSelectionTimeoutMS: 30_000,
    }) as Promise<Mongoose>;
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (error) {
    // If connection fails, reset the promise so future calls can retry.
    globalCache.promise = null;
    throw error;
  }

  return globalCache.conn;
}
