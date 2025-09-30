import { type geminiChatHistory } from "../types/AideaTypes";
import type { ReactNode } from "react";
import { UserMessage, GeminiMessage } from "./Messages";

interface typeGeminiChatHistory {
    geminiChatHistory: geminiChatHistory
}

const SingleChat = ({geminiChatHistory}: typeGeminiChatHistory) => {

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

     const chats = (mapGeminiChatHistory()).map(chat => chat,)

    return(
        <>
            <div className="container" id="single-chat">
                <div className="chat-container">
                    {chats}
                </div>
            </div>
        </>
    )
}

export default SingleChat