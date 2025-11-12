import geminiGenerateContent from "./config/gemini"
import getChatGPTresponse from "./config/chatGPT"
import { useState, useRef } from "react"
import SideBar from "./components/SideBar"
import SingleChat from "./components/SingleChat"
import SplitChat from "./components/SplitChat"
import PromptContainer from "./components/PromptContainer"
import { createGeminiHistoryElement, type geminiChatHistory, createChatGPTChatHistoryElement, type chatGPTChatHistory } from "./types/AideaTypes"

const App = () => {
  const chatPendingText = "Just a sec..."

  const pushGeminiChats = (role: "user" | "model", text: string) => {
    setGeminiChatHistory(geminiChatHistory => [...geminiChatHistory,createGeminiHistoryElement(role,text)])
  }

  const replaceGeminiJustASecMessage = (geminiChatHistory: geminiChatHistory, geminiResponse: string) => {
      const chat:geminiChatHistory = []
      geminiChatHistory.map(geminiHistoryElement => {
        if(geminiHistoryElement.parts[0].text == "Just a sec...") {
          chat.push(createGeminiHistoryElement("model",geminiResponse))
          return
        }

        chat.push(geminiHistoryElement)
      })
      return chat
  }

  const pushChatGPTChats = (role: "user" | "assistant", content: string) => {
    setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory,createChatGPTChatHistoryElement(role,content)])
  }

  const replaceChatGPTJustASecMessage = (chatGPTChatHistory: chatGPTChatHistory, chatGPTResponse: string) => {
    const chat:chatGPTChatHistory = []
      chatGPTChatHistory.map(chatGPTChatHistoryElement => {
        if(chatGPTChatHistoryElement.content == "Just a sec...") {
          chat.push(createChatGPTChatHistoryElement("assistant",chatGPTResponse))
          return
        }

        chat.push(chatGPTChatHistoryElement)
      })
      return chat
  }

  //main
  const [userInput, setUserInput] = useState("")

  const [isSplit, setIsSplit] = useState(false)

  const sendMessageExecuteCount = useRef(0)
  const sendMessageToGeminiCount = useRef(0)
  const sendMessageToChatGPTCount = useRef(0)
  const [ pending, setPending ] = useState(false)
  const [ geminiChatHistory, setGeminiChatHistory ] = useState<geminiChatHistory>([])
  const [ chatGPTChatHistory, setChatGPTChatHistory ] = useState<chatGPTChatHistory>([])
  const chatGPTUsageCounter = useRef(0)

  const sendMessageToGemini = async () => {
    setGeminiChatHistory(geminiChatHistory => [...geminiChatHistory,createGeminiHistoryElement("user",userInput)])
    setUserInput("")

    setGeminiChatHistory(geminiChatHistory => [...geminiChatHistory,createGeminiHistoryElement("model",chatPendingText)])
    setPending(true)
    const geminiResponse = await geminiGenerateContent({
      message: userInput,
      history: geminiChatHistory
    })
    setGeminiChatHistory(geminiChatHistory => {
      const chat:geminiChatHistory = []
      geminiChatHistory.map(geminiHistoryElement => {
        if(geminiHistoryElement.parts[0].text == chatPendingText) {
          chat.push(createGeminiHistoryElement("model",geminiResponse))
          return
        }

        chat.push(geminiHistoryElement)
      })
      return chat
    })
    setPending(false)

    sendMessageToGeminiCount.current += 1
  }

  const sendMessageToChatGPT = async () => {
    if(chatGPTUsageCounter.current > 10) {
      return
    }

    setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory, createChatGPTChatHistoryElement("user",userInput)])
    setUserInput("")

    if(chatGPTUsageCounter.current == 10) {
      setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory,createChatGPTChatHistoryElement("assistant","You have reached the limit.")])
      chatGPTUsageCounter.current += 1
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
    chatGPTUsageCounter.current += 1
    setPending(false)
    sendMessageToChatGPTCount.current += 1
  }

  const sendMessage = async () => {
    if(userInput == "") return
    if(pending == true) return

    if(isSplit==false) {
      pushGeminiChats("user",userInput)
      setUserInput("")

      pushGeminiChats("model", chatPendingText)
      setPending(true)
      const geminiResponse = await geminiGenerateContent({
        message: userInput,
        history: geminiChatHistory,
      })
      setGeminiChatHistory(geminiChatHistory => replaceGeminiJustASecMessage(geminiChatHistory,geminiResponse))
      setPending(false)

    }
    else if(isSplit==true){
      pushGeminiChats("user", userInput)
      pushChatGPTChats("user", userInput)
      setUserInput("")

      pushGeminiChats("user", chatPendingText)
      pushChatGPTChats('user', chatPendingText)
      setPending(true)
      const [ geminiResponse, chatGPTResponse ] = await Promise.all([

        geminiGenerateContent({
          message: userInput,
          history: geminiChatHistory
        }),

        getChatGPTresponse({
          message: userInput,
          history: chatGPTChatHistory
        })

      ])
      replaceGeminiJustASecMessage(geminiChatHistory, geminiResponse)
      replaceChatGPTJustASecMessage(chatGPTChatHistory, chatGPTResponse)
      setPending(false)
    }

    sendMessageExecuteCount.current += 1
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