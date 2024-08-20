import { atom } from "jotai";

type JudgeItem = {
    id: string
    image: string
}

export type Judge = {
    id: string
    title: string
    items: JudgeItem[]
}

export const rootContainerTitle = "root";
export const judgeAtom = atom<Judge[]>([]);