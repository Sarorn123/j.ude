import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        GOOGLE_CLIENT_SECRET: z.string(),
        GOOGLE_CLIENT_ID: z.string(),
        HOST_NAME: z.string().url(),
        R2_ACCESS_KEY: z.string(),
        R2_SECRET_KEY: z.string(),
        R2_BUCKET: z.string(),
        R2_ENDPOINT: z.string(),
    },
    experimental__runtimeEnv: process.env
});