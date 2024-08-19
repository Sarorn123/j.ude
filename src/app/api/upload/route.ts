import { deleteFile, uploadFile } from "@/app/lib/r2";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const urls = await uploadFile(files);
        return NextResponse.json(urls)
    } catch (error) {
        return new Response(error as any, { status: 500 });
    }
}

export const DELETE = async (request: Request) => {
    try {
        const body = await request.json()
        const urls = body as string[]
        if (!urls) return NextResponse.json({ message: "url required" });
        await Promise.all(urls.map((url) => deleteFile(url))).catch((e) => console.error("=>", e))
        return NextResponse.json({ message: "ok" });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}