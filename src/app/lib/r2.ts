import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from "@/app/lib/env";

const Bucket = env.R2_BUCKET
export const client = new S3Client({
    region: "auto",
    endpoint: env.R2_ENDPOINT,
    credentials: {
        accessKeyId: env.R2_ACCESS_KEY,
        secretAccessKey: env.R2_SECRET_KEY,
    },
});

export async function uploadFile(files: File | File[]) {
    if (Array.isArray(files)) {
        return await Promise.all(files.map((f) => uploadProcess(f)))
    }
}

async function uploadProcess(file: File) {
    const [orgName, extention] = file.name.split(".")
    const Key = `${orgName.toLowerCase().replaceAll(" ", "-") + "-" + Date.now().toString()}.${extention}`
    const params = { Bucket, Key, Body: file };
    const running = new Upload({ client, params });
    await running.done();
    return await getSignedUrl(client, new GetObjectCommand({ Bucket, Key }));
}

export async function deleteFile(url: string) {
    try {
        // Extract the Key from the URL
        const Key = url.split("?")[0].split("com/")[1];
        console.log({ DELETE_KEY: Key });
        // Ensure Bucket and Key are available
        if (!Bucket || !Key) {
            throw new Error("Bucket or Key is undefined.");
        }
        // Create and send the delete command
        const command = new DeleteObjectCommand({ Bucket, Key });
        return await client.send(command);
    } catch (error) {
        console.error("Error deleting file:", error);
        throw error;  // Optionally rethrow the error to be handled upstream
    }
}