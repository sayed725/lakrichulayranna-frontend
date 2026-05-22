const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
} as const;

// Validate at import time
function getEnvVar(key: keyof typeof requiredEnvVars): string {
  const value = requiredEnvVars[key];
  if (!value) {
    // Don't throw during build time for public vars
    if (typeof window !== "undefined") {
      console.error(`❌ Missing environment variable: ${key}`);
    }
    return "";
  }
  return value;
}

export const env = {
  API_URL: getEnvVar("NEXT_PUBLIC_API_URL"),
  APP_NAME: getEnvVar("NEXT_PUBLIC_APP_NAME"),
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",
} as const;

// Server-only env vars (only accessible in server components / middleware)
export const serverEnv = {
  JWT_SECRET: process.env.JWT_SECRET || "",
} as const;
