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

  const replaceGeminiJustASecMessage = (geminiResponse: string) => {
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
  }

  const pushChatGPTChats = (role: "user" | "assistant", content: string) => {
    setChatGPTChatHistory(chatGPTChatHistory => [...chatGPTChatHistory,createChatGPTChatHistoryElement(role,content)])
  }

  const replaceChatGPTJustASecMessage = (chatGPTResponse: string) => {
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
  }

  const sendMessageToGemini = async () => {
    pushGeminiChats("user",userInput)
    setUserInput("")

    pushGeminiChats("model", chatPendingText)
    setPending(true)
    const geminiResponse = await geminiGenerateContent({
      message: userInput,
      history: geminiChatHistory,
    })
    geminiGenerateContentCount.current += 1
    replaceGeminiJustASecMessage(geminiResponse)
    setPending(false)
  }

  const sendMessageToGeminiAndChatGPT = async () => {
    pushGeminiChats("user", userInput)
    pushChatGPTChats("user", userInput)
    setUserInput("")

    pushGeminiChats("model", chatPendingText)
    pushChatGPTChats("assistant", chatPendingText)
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
      geminiGenerateContentCount.current += 1
      getChatGPTresponseCount.current += 1
      replaceGeminiJustASecMessage(geminiResponse)
      replaceChatGPTJustASecMessage(chatGPTResponse)
      setPending(false)
  }

  //main
  const [userInput, setUserInput] = useState("")

  const [isSplit, setIsSplit] = useState(false)

  const sendMessageExecuteCount = useRef(0)
  const geminiGenerateContentCount = useRef(0)
  const getChatGPTresponseCount = useRef(0)
  const [ pending, setPending ] = useState(false)
  const [ geminiChatHistory, setGeminiChatHistory ] = useState<geminiChatHistory>([])
  const [ chatGPTChatHistory, setChatGPTChatHistory ] = useState<chatGPTChatHistory>([])

  const sendMessage = async () => {
    if(userInput == "") return
    if(pending == true) return

    if(isSplit==false) {
      sendMessageToGemini()
    }
    else if(isSplit==true){
      if(getChatGPTresponseCount.current >= 5) {
        sendMessageToGemini()
      } else {
        sendMessageToGeminiAndChatGPT()
      }
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