import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const quertClient = postgres(process.env.DATABASE_URL!)
export const db = drizzle(quertClient)
