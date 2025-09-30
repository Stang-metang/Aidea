import type { geminiChatHistory, chatGPTChatHistory } from "../types/AideaTypes";
import type { ReactNode } from "react";
import { UserMessage, GeminiMessage, ChatGPTMessage } from "./Messages";

interface typeGeminiChatHistory {
    geminiChatHistory: geminiChatHistory
    chatGPTChatHistory: chatGPTChatHistory
}

const SplitChat = ({geminiChatHistory,chatGPTChatHistory}: typeGeminiChatHistory) => {

    const mapGeminiChatHistory = () => {
        const chats:ReactNode[] = []
        for(const geminiChatHistoryElement of geminiChatHistory) {
            if(geminiChatHistoryElement.role == "user") {
                chats.push(<UserMessage message={geminiChatHistoryElement.parts[0].text}/>)
            }
            else if(geminiChatHistoryElement.role == "model") {
                chats.push(<GeminiMessage message={geminiChatHistoryElement.parts[0].text}/>)
            }
        }
        return chats
    }

    const mapChatGPTChatHistory = () => {
        const chats:ReactNode[] = []
        for(const chatGPTChatHistoryElement of chatGPTChatHistory) {
            if(chatGPTChatHistoryElement.role == "user") {
                chats.push(<UserMessage message={chatGPTChatHistoryElement.content}/>)
            }
            else if(chatGPTChatHistoryElement.role == "assistant") {
                chats.push(<ChatGPTMessage message={chatGPTChatHistoryElement.content}/>)
            }
        }
        return chats
    }
    
    const geminiChats = (mapGeminiChatHistory()).map(chat => chat)
    const chatGPTChats = (mapChatGPTChatHistory()).map(chat => chat)

    return(
        <>
            <div className="split-container active" id="split-chat">
                <div className="chat-wrapper left-chat">
                    <header className="chat-header">Gemini</header>
                    <div className="chat-container">
                        {geminiChats}
                    </div>
                </div>
                <div className="chat-wrapper right-chat">
                    <header className="chat-header">Right AI</header>
                    <div className="chat-container">
                        {chatGPTChats}
                    </div>
                </div>
            </div>
        </>
    )
}

export default SplitChat