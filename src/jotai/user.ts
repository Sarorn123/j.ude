import { User } from "@prisma/client";
import { atom, useAtomValue } from "jotai";

export const userAtom = atom<User>();
export function useUser() {
    return useAtomValue(userAtom)
}