"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Lock, User, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const trendingTopics = [
  "bitcoin price",
  "ethereum analysis",
  "trending coins",
  "market cap",
  "defi trends",
  "altcoin season",
  "btc dominance",
  "market sentiment",
  "price prediction",
  "trading signals",
  "portfolio analysis",
  "investment advice",
]

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface QuickStats {
  btc_price: number
  eth_price: number
  market_cap_change: number
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [quickStats, setQuickStats] = useState<QuickStats | null>(null)
  const [portfolio, setPortfolio] = useState<any[]>([])

  useEffect(() => {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem("mao-ai-portfolio")
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }
  }, [])

  useEffect(() => {
    // Fetch quick stats for the header - reduced frequency
    const fetchQuickStats = async () => {
      try {
        const response = await fetch("/api/crypto/prices?ids=bitcoin,ethereum")
        const result = await response.json()
        if (result.success) {
          setQuickStats({
            btc_price: result.data.bitcoin?.usd || 43000,
            eth_price: result.data.ethereum?.usd || 2600,
            market_cap_change: result.data.bitcoin?.usd_24h_change || 2.5,
          })
        }
      } catch (error) {
        console.error("Failed to fetch quick stats:", error)
        // Set fallback data
        setQuickStats({
          btc_price: 43000,
          eth_price: 2600,
          market_cap_change: 2.5,
        })
      }
    }

    fetchQuickStats()
    const interval = setInterval(fetchQuickStats, 120000) // Update every 2 minutes instead of 1
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          history: messages,
          portfolio: portfolio, // Send portfolio data to AI
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleTopicClick = (topic: string) => {
    setMessage(`Tell me about ${topic}`)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header - Hidden on mobile (handled by MobileHeader) */}
      <div className="hidden lg:flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">default</span>
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {quickStats && (
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="bg-card border-border text-foreground">
                BTC: ${quickStats.btc_price.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="bg-card border-border text-foreground">
                ETH: ${quickStats.eth_price.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="bg-card border-border text-foreground">
                <TrendingUp className="w-3 h-3 mr-1" />
                {quickStats.market_cap_change.toFixed(2)}%
              </Badge>
              {portfolio.length > 0 && (
                <Badge variant="outline" className="bg-card border-border text-blue-500">
                  Portfolio: {portfolio.length} assets
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Stats Bar */}
      <div className="lg:hidden p-3 border-b border-border bg-card">
        {quickStats && (
          <div className="flex items-center gap-2 text-xs overflow-x-auto">
            <Badge variant="outline" className="bg-muted border-border text-foreground whitespace-nowrap">
              BTC: ${quickStats.btc_price.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="bg-muted border-border text-foreground whitespace-nowrap">
              ETH: ${quickStats.eth_price.toLocaleString()}
            </Badge>
            <Badge variant="outline" className="bg-muted border-border text-foreground whitespace-nowrap">
              <TrendingUp className="w-3 h-3 mr-1" />
              {quickStats.market_cap_change.toFixed(2)}%
            </Badge>
            {portfolio.length > 0 && (
              <Badge variant="outline" className="bg-muted border-border text-blue-500 whitespace-nowrap">
                Portfolio: {portfolio.length}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages or Welcome Screen */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center justify-center h-full p-4 lg:p-8">
            {/* Main Question */}
            <h1 className="text-xl lg:text-3xl font-light text-center mb-3 lg:mb-4 max-w-2xl px-4 text-foreground">
              {"What's happening in the crypto market today?"}
            </h1>
            <p className="text-muted-foreground text-center mb-6 lg:mb-8 max-w-xl text-sm lg:text-base px-4">
              Get real-time crypto insights and portfolio analysis powered by Mao.Ai
            </p>

            {/* Trending Topics */}
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mb-6 lg:mb-8 px-4">
              {trendingTopics.map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  className="bg-card border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-full text-xs lg:text-sm"
                  onClick={() => handleTopicClick(topic)}
                >
                  {topic}
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                  </svg>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="p-3 lg:p-4 space-y-3 lg:space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 lg:gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 lg:gap-3 max-w-[85%] lg:max-w-3xl ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {msg.role === "user" ? (
                      <User className="w-4 h-4 lg:w-6 lg:h-6 text-muted-foreground" />
                    ) : (
                      <img
                        src="/images/web3mao-mascot.png"
                        alt="Mao.Ai"
                        className="w-6 h-6 lg:w-8 lg:h-8 rounded-full"
                      />
                    )}
                  </div>
                  <Card className={`${msg.role === "user" ? "bg-blue-600" : "bg-card"} border-none`}>
                    <CardContent className="p-2 lg:p-3">
                      <p
                        className={`text-xs lg:text-sm whitespace-pre-wrap ${msg.role === "user" ? "text-white" : "text-foreground"}`}
                      >
                        {msg.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 lg:gap-3 justify-start">
                <img src="/images/web3mao-mascot.png" alt="Mao.Ai" className="w-6 h-6 lg:w-8 lg:h-8 rounded-full" />
                <Card className="bg-card border-none">
                  <CardContent className="p-2 lg:p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 lg:p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isLoading
                  ? "Mao.Ai is analyzing market data..."
                  : portfolio.length > 0
                    ? "Ask Mao.Ai about crypto trends, prices, or your portfolio..."
                    : "Ask Mao.Ai about crypto trends, prices, or market analysis..."
              }
              className="w-full bg-card border-border text-foreground placeholder-muted-foreground pr-12 py-4 lg:py-6 text-sm lg:text-lg rounded-2xl"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black rounded-xl"
              disabled={isLoading || !message.trim()}
            >
              <Send className="w-3 h-3 lg:w-4 lg:h-4" />
            </Button>
            <Lock className="absolute right-12 lg:right-16 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
          </div>
        </form>
      </div>
    </div>
  )
}
