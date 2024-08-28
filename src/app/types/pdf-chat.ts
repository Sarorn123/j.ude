type AskBody = {
    sourceId: string
    messages: {
        role: string
        content: string
    }[]

    stream?: boolean
}

type AskResponse = {
    content: string
}

export type {
    AskBody,
    AskResponse
}