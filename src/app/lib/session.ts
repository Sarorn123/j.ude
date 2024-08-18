import { cache } from "react";
import { lucia, validateRequest } from "./auth";
import { cookies } from "next/headers";

export const getCurrentUser = cache(async () => {
    const session = await validateRequest();
    if (!session.user) {
        return undefined;
    }
    return session.user;
});

export const assertAuthenticated = async () => {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
};


export async function setSession(userId: string) {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
    );
}