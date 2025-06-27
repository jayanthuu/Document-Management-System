"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Languages,
} from "lucide-react"
import { ChatbotEngine, type ChatbotResponse } from "@/lib/chatbot-knowledge"
import { voiceAssistant } from "@/lib/voice-assistant"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  response?: ChatbotResponse
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [language, setLanguage] = useState<"en-IN" | "ta-IN">("en-IN")
  const [isTyping, setIsTyping] = useState(false)

  const chatbotEngine = new ChatbotEngine()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text:
          language === "ta-IN"
            ? "வணக்கம்! நான் உங்கள் AI உதவியாளர். சான்றிதழ்கள், விண்ணப்பங்கள், அல்லது எந்த அரசு சேவைகள் பற்றியும் கேட்கலாம்!"
            : "Hello! I'm your AI assistant. Ask me about certificates, applications, or any government services!",
        isBot: true,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, language])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = chatbotEngine.findBestMatch(text) || chatbotEngine.getDefaultResponse()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === "ta-IN" ? response.tamilAnswer : response.answer,
        isBot: true,
        timestamp: new Date(),
        response,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)

      // Auto-speak the response if voice is enabled
      if (isSpeaking) {
        voiceAssistant.speak(botMessage.text, language)
      }
    }, 1000)
  }

  const handleVoiceInput = () => {
    if (isListening) {
      voiceAssistant.stopListening()
      setIsListening(false)
      return
    }

    setIsListening(true)
    voiceAssistant.setLanguage(language)

    voiceAssistant.startListening(
      (transcript) => {
        setIsListening(false)
        handleSendMessage(transcript)
      },
      (error) => {
        setIsListening(false)
        toast({
          title: "Voice Error",
          description: "Could not understand your voice. Please try again.",
          variant: "destructive",
        })
      },
    )
  }

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking)
    if (isSpeaking) {
      voiceAssistant.synthesis?.cancel()
    }
  }

  const toggleLanguage = () => {
    const newLang = language === "en-IN" ? "ta-IN" : "en-IN"
    setLanguage(newLang)
    voiceAssistant.setLanguage(newLang)
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const quickQuestions =
    language === "ta-IN"
      ? [
          "சமுதாய சான்றிதழுக்கு எப்படி விண்ணப்பிப்பது?",
          "விண்ணப்ப நிலையை எப்படி சரிபார்ப்பது?",
          "என்ன ஆவணங்கள் தேவை?",
          "நான் முதல்வன் என்றால் என்ன?",
        ]
      : [
          "How to apply for community certificate?",
          "How to check application status?",
          "What documents are required?",
          "What is Naan Mudhalvan?",
        ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-96 shadow-xl transition-all duration-300 ${isMinimized ? "h-16" : "h-[600px]"}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">{language === "ta-IN" ? "AI உதவியாளர்" : "AI Assistant"}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="h-8 w-8 text-white hover:bg-blue-700"
            >
              <Languages className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSpeaking}
              className="h-8 w-8 text-white hover:bg-blue-700"
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 text-white hover:bg-blue-700"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[536px]">
            {/* Quick Questions */}
            <div className="p-4 border-b bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">
                {language === "ta-IN" ? "விரைவு கேள்விகள்:" : "Quick Questions:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-100 text-xs"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-600 text-white"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.isBot && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                        {!message.isBot && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm">{message.text}</p>

                          {/* Related Links */}
                          {message.response?.relatedLinks && (
                            <div className="mt-2 space-y-1">
                              {message.response.relatedLinks.map((link, index) => (
                                <a
                                  key={index}
                                  href={link.url}
                                  className="block text-xs text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  🔗 {link.text}
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Follow-up Questions */}
                          {message.response?.followUpQuestions && (
                            <div className="mt-2 space-y-1">
                              <p className="text-xs font-medium">Related questions:</p>
                              {message.response.followUpQuestions.map((question, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-blue-100 text-xs mr-1 mb-1"
                                  onClick={() => handleQuickQuestion(question)}
                                >
                                  {question}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={language === "ta-IN" ? "உங்கள் கேள்வியை தட்டச்சு செய்யுங்கள்..." : "Type your question..."}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputText)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleVoiceInput}
                  className={isListening ? "bg-red-100 border-red-300" : ""}
                >
                  {isListening ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={() => handleSendMessage(inputText)} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
