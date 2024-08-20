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
        },
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
            containers: {
                orderBy: {
                    index: "asc",
                },
            }
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

    const newAllContainers = containers.map((container) => {
        return {
            title: container.title,
            items: container.items.map((item) => item.image),
            id: container.id.replaceAll("container-", "")
        }
    })
    const dbContainers = project.containers

    // remove image from old miss container
    const allNewContanerIds = containers.map((container) => container.id.replaceAll("container-", ""))
    const idsForDelete: string[] = []
    dbContainers.forEach(async (dbContainer) => {
        // if existed in db not have in new containers. coZ new containers can have in db also create new
        if (!allNewContanerIds.includes(dbContainer.id)) {
            idsForDelete.push(dbContainer.id)
            await deleteImage(dbContainer.items)
        }
    })
    if (idsForDelete.length) {
        await prisma.judgeContainer.deleteMany({
            where: {
                id: {
                    in: idsForDelete
                }
            }
        })
    }

    newAllContainers.forEach(async (container, index) => {
        await prisma.judgeContainer.upsert({
            where: {
                id: container.id
            },
            create: {
                title: container.title,
                items: container.items,
                projectId: id,
                index
            },
            update: {
                title: container.title,
                items: container.items,
                index
            }
        })
    })

    return "Success"

}

export async function deleteImage(urls: string | string[]) {
    if (!urls) return
    const url = env.HOST_NAME + "/api/upload";
    const body = Array.isArray(urls) ? urls : [urls]
    return await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
        cache: 'no-store'
    }).then((res) => "OK")
        .catch((e) => console.error("=>", e))
}