import prisma from "./prisma";
import { GoogleUser } from "../api/login/google/callback/route";

export async function getUserByUserId(userId: string) {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                {
                    id: userId
                },
                {
                    sub: userId
                }
            ]
        }
    });

    return user;
}

export async function createGoogleUserUseCase(googleUser: GoogleUser) {
    let existingUser = await prisma.user.findFirst({
        where: {
            email: googleUser.email
        }
    })
    if (!existingUser) {
        existingUser = await prisma.user.create({
            data: {
                email: googleUser.email,
                name: googleUser.name,
                sub: googleUser.sub,
                picture: googleUser.picture
            }
        })
    }
    return existingUser.id;
}