import geminiAvatar from "../assets/gemini.svg";
import chatGPTAvatar from "../assets/chatgpt.webp";

interface typeString {
    message: string
}

export const UserMessage = ({message}:typeString) => {
    return (
        <>
            <div className="message user-message">
                <p className="split-message-text">{message}</p>
            </div>
        </>
    )
}

export const GeminiMessage = ({message}: typeString) => {
    return (
        <>
            <div className="message bot-message">
                <img src={geminiAvatar} className="avatar"/>
                <p className="split-bot-message-text">{message}</p>
            </div>
        </>
    )
}

export const ChatGPTMessage = ({message}: typeString) => {
    return (
        <>
            <div className="message bot-message">
                <img src={chatGPTAvatar} className="avatar"/>
                <p className="split-bot-message-text">{message}</p>
            </div>
        </>
    )
}