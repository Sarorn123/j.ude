"use server"

import { env } from "@/app/lib/env/server";
import prisma from "@/app/lib/prisma";
import { assertAuthenticated } from "@/app/lib/session";
import { AskBody } from "@/app/types/pdf-chat";
import { ChatPdf } from "@prisma/client";
import axios from "axios"

const client = axios.create({
    baseURL: env.HOST_NAME,
})

const chatPdfClient = axios.create({
    baseURL: env.PDF_URL,
    headers: {
        "x-api-key": env.PDF_API_KEY
    }
})

export async function uploadPDF(url: string, { arg: form }: { arg: FormData }): Promise<string> {
    const user = await assertAuthenticated()
    if (!user) throw new Error("User not found")
    const file = form.get("files") as File
    if (!file) throw new Error("File not found")
    const pdfResponse = await client.post(url, form)
    const pdfUrl = pdfResponse.data[0] as string
    const response = await chatPdfClient.post("/sources/add-url", { url: pdfUrl }).catch((error) => {
        console.log("Error:", error.message);
        console.log("Response:", error.response.data);
        throw new Error(error);
    });
    const sourceId = response.data.sourceId
    await prisma.chatPdf.create({
        data: {
            sourceId,
            userId: user.id,
            pdfs: pdfUrl,
            name: file.name
        }
    })
    return sourceId
}

export async function getPdfProject() {
    const user = await assertAuthenticated()
    return await prisma.chatPdf.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function deletePDF(url: string, { arg: sourceId }: { arg: string }) {
    const user = await assertAuthenticated()
    if (!user) throw new Error("User not found")
    const chatPdf = await prisma.chatPdf.findFirst({
        where: {
            sourceId
        },
    })
    if (!chatPdf) throw new Error("PDF not found")
    await Promise.all([
        client.delete(url, { data: [chatPdf.pdfs] }),
        chatPdfClient.post(`/sources/delete`, { sources: [sourceId] }),
        prisma.chatPdf.delete({ where: { sourceId } }),
        prisma.fileStorage.delete({ where: { url: chatPdf.pdfs } }),
    ]).catch((error) => {
        throw new Error(error);
    })
    return "success"

}


export async function updateHistory(data: AskBody): Promise<ChatPdf> {
    const user = await assertAuthenticated()
    if (!user) throw new Error("User not found")
    const { sourceId, messages: conversation } = data
    const updated = await prisma.chatPdf.update({
        where: { sourceId },
        data: { conversation }
    })
    return updated
}

export async function updateSummary(sourceId: string, summary: string): Promise<ChatPdf> {
    const user = await assertAuthenticated()
    if (!user) throw new Error("User not found")
    const update = await prisma.chatPdf.update({
        where: { sourceId },
        data: { summary }
    })
    return update
}