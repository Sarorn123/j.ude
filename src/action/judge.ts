"use server"

import { env } from "@/app/lib/env"
import prisma from "@/app/lib/prisma"
import { assertAuthenticated } from "@/app/lib/session"
import { Judge } from "@/jotai/judge"

export async function getProjects() {
    const user = await assertAuthenticated()
    return await prisma.judgeProject.findMany({
        where: {
            userId: user.id
        }
    })
}
export async function getProject(id: string) {
    const user = await assertAuthenticated()
    return await prisma.judgeProject.findUnique({
        where: {
            id,
            userId: user.id
        },
        include: {
            containers: true
        }
    })
}
export async function addProject(data: {
    name: string,
    description: string,
}) {
    const user = await assertAuthenticated()
    return await prisma.judgeProject.create({ data: { ...data, userId: user.id } })
}

export async function deleteProject(id: string) {

    const user = await assertAuthenticated()
    const allContainer = await prisma.judgeContainer.findMany({
        where: {
            projectId: id
        },
        select: {
            items: true,
            id: true
        }
    })

    // remove image from container
    await deleteImage(allContainer.flatMap((c) => c.items))
    await prisma.judgeContainer.deleteMany({
        where: {
            projectId: id
        }
    })
    return await prisma.judgeProject.deleteMany({ where: { id, userId: user.id } })
}

export async function editProject(id: string, containers: Judge[]) {

    const user = await assertAuthenticated()
    const project = await prisma.judgeProject.findFirst({
        where: {
            id,
            userId: user.id
        },
        include: {
            containers: true
        }
    })

    if (!project) throw new Error("Project not found")

    const data = containers.map((container) => {
        return {
            title: container.title,
            items: container.items.map((item) => item.image)
        }
    })
    const allContainer = project.containers

    // remove image from old miss container
    const allNewContanerIds = containers.map((container) => container.id.replaceAll("container-", ""))
    allContainer.forEach(async (dbContainer) => {
        // if existed in db not have in new containers. coZ new containers can have in db also create new
        if (!allNewContanerIds.includes(dbContainer.id)) {
            await deleteImage(dbContainer.items).catch((e) => console.error(e))
        }
    })
    await prisma.judgeContainer.deleteMany({
        where: {
            projectId: id
        }
    })
    return await prisma.judgeProject.update({
        where: {
            id
        },
        data: {
            containers: { create: data }
        }
    })
}

export async function deleteImage(image: string | string[]) {
    if (!image) return
    const url = env.HOST_NAME + "/api/uploadthing";
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(image)
    };
    return await fetch(url, options)
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}