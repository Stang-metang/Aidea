export type geminiChatHistory = {
    role: "user" | "model",
    parts: {
        text: string
    }[]
}[]

export const createGeminiHistoryElement = (role: "user" | "model", message: string) => {
    return { role: role, parts: [{ text: message }] }
}

export type chatGPTChatHistory = {
    role: "user" | "assistant",
    content: string
}[]

export const createChatGPTChatHistoryElement = (role: "user" | "assistant", content: string) => {
    return { role: role, content: content }
}