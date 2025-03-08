import { config } from "dotenv";

// Load environment variables based on the current NODE_ENV setting.
// This allows seamless switching between development and production environments.
// If NODE_ENV is not set, it defaults to 'development'.
// Example: If NODE_ENV is 'production', it loads variables from '.env.production.local'.
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

// Extract and export specific environment variables for easy access across the application.
export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARCJET_KEY,
  ARCJET_ENV,
  SERVER_URL,
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
  EMAIL_PASSWORD
} = process.env;
