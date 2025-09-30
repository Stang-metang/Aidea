import { type ChangeEvent } from "react"

interface typeUserPrompt {
    onSubmit: Function,
    value: string,
    onInputChange: React.Dispatch<React.SetStateAction<string>>,
    split: boolean,
    toggleSplit: React.Dispatch<React.SetStateAction<boolean>>,
    pending: boolean
}

const PromptContainer = ({onSubmit, value, onInputChange, split, toggleSplit, pending}:typeUserPrompt) => {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit()
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onInputChange(event.target.value)
    }

    const changeTheme = () => {
        document.body.classList.toggle("light-theme")
    }

    const changeSplit = () => {
        toggleSplit(!split)
    }

    return(
        <>
            <div className="prompt-container main-prompt">
                <div className="prompt-wrapper">
                <form onSubmit={handleSubmit} className="prompt-form">
                    <input type="text" placeholder="Ask our AI anything!" className="prompt-input" value={value} onChange={handleChange} required/>
                    <div className="prompt-actions">
                        <button id="send-prompt-btn" type="submit" className="material-symbols-rounded" style={pending ? {display:"none"} : undefined}>arrow_upward</button>
                    </div>
                </form>
                <button id="theme-toggle-btn" type="button" className="material-symbols-rounded" onClick={changeTheme}>light_mode</button>
                <button id="chat-create-btn" type="button" className="material-symbols-rounded" onClick={changeSplit}>add</button>
                </div>
                <p className="disclaimer-text">Our AI can make mistakes, so double check it.</p>
            </div>
        </>
    )
}

export default PromptContainer