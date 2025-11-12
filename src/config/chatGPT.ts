import OpenAI from "openai";
import { createChatGPTChatHistoryElement, type chatGPTChatHistory } from "../types/AideaTypes";

const openaiAi = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

interface typeGetChatGPTresponse {
    message: string,
    model?: string,
    history: chatGPTChatHistory
}

const getChatGPTresponse = async ({ message, model = "gpt-5-mini", history }: typeGetChatGPTresponse) => {
    return String((await openaiAi.chat.completions.create({
        model: model,
        messages: [...history, createChatGPTChatHistoryElement("user", message)]
    })).choices[0].message.content)
}

export default getChatGPTresponse