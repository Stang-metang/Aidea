import { GoogleGenAI } from "@google/genai";
import { type geminiChatHistory, createGeminiHistoryElement } from "../types/AideaTypes";

const googleAi = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

interface typeGeminiGenerateContent {
    message: string,
    model?: "gemini-2.5-flash-lite" | "gemini-2.5-flash" | "gemini-2.5-pro",
    history: geminiChatHistory
}

const geminiGenerateContent = async ({ message, model = "gemini-2.5-flash", history }: typeGeminiGenerateContent) => {
    return String((await googleAi.models.generateContent({
        model: model,
        contents: [...history, createGeminiHistoryElement("user", message)]
    }
    )).text)
}

export default geminiGenerateContent