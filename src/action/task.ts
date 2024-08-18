"use server"

import prisma from "@/app/lib/prisma";
import { assertAuthenticated } from "@/app/lib/session";
import { TaskType } from "@/jotai/task";
import { Prisma } from "@prisma/client";

export async function getProjects() {
    const user = await assertAuthenticated()
    return await prisma.taskProject.findMany({
        where: {
            userId: user.id
        },
    })
}

export async function editProject(id: string, containers: TaskType[]) {
    const user = await assertAuthenticated()

    const project = await prisma.taskProject.findFirst({
        where: {
            id,
            userId: user.id
        }
    })

    if (!project) throw new Error("Project not found")
    await prisma.task.deleteMany({
        where: {
            container: {
                projectId: id
            }
        }
    })

    await prisma.taskContainer.deleteMany({
        where: {
            projectId: id
        }
    })

    return await Promise.all(containers.map(async (container, index) => {
        await prisma.taskContainer.create({
            data: {
                index,
                title: container.title,
                projectId: id,
                tasks: {
                    create: container.items.map((item) => ({ ...item, id: undefined }))
                }
            },
        })
    }))

}

export async function addProject(data: {
    name: string,
    description: string,
}) {
    const user = await assertAuthenticated()
    return await prisma.taskProject.create({ data: { ...data, userId: user.id } })
}

export async function deleteProject(id: string) {
    const user = await assertAuthenticated()
    return await prisma.taskProject.deleteMany({ where: { id, userId: user.id } })
}

export async function getProject(id: string) {
    const user = await assertAuthenticated()
    return await prisma.taskProject.findFirst({
        where: {
            id,
            userId: user.id
        },
        include: {
            containers: {
                orderBy: {
                    index: "asc",
                },
                include: {
                    tasks: true,
                }
            }
        }
    })
}

export async function onEditContainer(id: string, title: string) {
    return await prisma.taskContainer.update({
        where: {
            id
        },
        data: {
            title
        }
    }).catch((e) => console.error(e))
}

export async function getTask(id: string) {

    return await prisma.task.findUnique({
        where: {
            id
        }
    })
}

export async function editTask(id: string, data: Prisma.TaskUpdateInput) {


    const task = await prisma.task.findUnique({
        where: {
            id
        }
    })

    if (task) {
        return await prisma.task.update({
            where: {
                id
            },
            data
        })
    }


}

export async function deleteTask(id: string) {

    return await prisma.task.delete({
        where: {
            id
        }
    })
}