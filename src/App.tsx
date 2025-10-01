import geminiGenerateContent from "./config/gemini"
import getChatGPTresponse from "./config/chatGPT"
import { useState } from "react"
import SideBar from "./components/SideBar"
import SingleChat from "./components/SingleChat"
import SplitChat from "./components/SplitChat"
import PromptContainer from "./components/PromptContainer"
import { createGeminiHistoryElement, type geminiChatHistory, createChatGPTChatHistoryElement, type chatGPTChatHistory } from "./types/AideaTypes"

const App = () => {
  const [userInput, setUserInput] = useState("")

  const [isSplit, setIsSplit] = useState(false)

  const [ pending, setPending ] = useState(false);
  const [ geminiChatHistory, setGeminiChatHistory ] = useState<geminiChatHistory>([])
  const [ chatGPTChatHistory, setChatGPTChatHistory ] = useState<chatGPTChatHistory>([])
  const [ chatGPTUsageCounter, setChatGPTUsageCounter ] = useState(0)

  const sendMessageToGemini = async () => {
    setGeminiChatHistory(geminiChatHistory => [...geminiChatHistory,createGeminiHistoryElement("user",userInput)])
    setUserInput("")

    setPending(true)
    const geminiResponse = await geminiGenerateContent({
      message: userInput,
      history: geminiChatHistory
    })
    setGeminiChatHistory(geminiChatHistory => [...geminiChatHistory,createGeminiHistoryElement("model",geminiResponse)])
    setPending(false)
  }

  const sendMessageToChatGPT = async () => {
    if(chatGPTUsageCounter > 10) {
      return
    }

    setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory, createChatGPTChatHistoryElement("user",userInput)])
    setUserInput("")

    if(chatGPTUsageCounter == 10) {
      setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory,createChatGPTChatHistoryElement("assistant","You have reached the limit.")])
      setChatGPTUsageCounter(chatGPTUsageCounter => chatGPTUsageCounter + 1)
      setPending(false)
      return
    }

    setPending(true)
    const chatGPTResponse = await getChatGPTresponse({
      model: "gpt-5-mini",
      message: userInput,
      history: chatGPTChatHistory
    })
    setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory,createChatGPTChatHistoryElement("assistant",chatGPTResponse)])
    setChatGPTUsageCounter(chatGPTUsageCounter => chatGPTUsageCounter + 1)
    setPending(false)
  }

  const sendMessage = () => {
    if(userInput == "") return
    if(pending == true) return

    if(isSplit==false) {
      sendMessageToGemini()
    }
    else if(isSplit==true){
      sendMessageToGemini()
      sendMessageToChatGPT()
    }
  }

  return(
    <>
      <SideBar/>

      <div className="main-content-wrapper">
        {!isSplit
        ? <SingleChat geminiChatHistory={geminiChatHistory}/>
        : <SplitChat geminiChatHistory={geminiChatHistory} chatGPTChatHistory={chatGPTChatHistory}/>
        }
        <PromptContainer value={userInput} onInputChange={setUserInput} onSubmit={sendMessage} split={isSplit} toggleSplit={setIsSplit} pending={pending}/>
      </div>
    </>
  )
}

export default App