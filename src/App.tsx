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

    setGeminiChatHistory(geminiChatHistory => [...geminiChatHistory,createGeminiHistoryElement("model","Just a sec...")])
    setPending(true)
    const geminiResponse = await geminiGenerateContent({
      message: userInput,
      history: geminiChatHistory
    })
    setGeminiChatHistory(geminiChatHistory => {
      const chat:geminiChatHistory = []
      geminiChatHistory.map(geminiHistoryElement => {
        if(geminiHistoryElement.parts[0].text == "Just a sec...") {
          chat.push(createGeminiHistoryElement("model",geminiResponse))
          return
        }

        chat.push(geminiHistoryElement)
      })
      return chat
    })
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

    setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory,createChatGPTChatHistoryElement("assistant","Just a sec...")])
    setPending(true)
    const chatGPTResponse = await getChatGPTresponse({
      message: userInput,
      history: chatGPTChatHistory
    })
    setChatGPTChatHistory(chatGPTChatHistory => {
      const chat:chatGPTChatHistory = []
      chatGPTChatHistory.map(chatGPTChatHistoryElement => {
        if(chatGPTChatHistoryElement.content == "Just a sec...") {
          chat.push(createChatGPTChatHistoryElement("assistant",chatGPTResponse))
          return
        }

        chat.push(chatGPTChatHistoryElement)
      })
      return chat
    })
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