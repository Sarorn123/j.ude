import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        GOOGLE_CLIENT_SECRET: z.string(),
        GOOGLE_CLIENT_ID: z.string(),
        HOST_NAME: z.string().url(),
    },
    experimental__runtimeEnv: process.env
});