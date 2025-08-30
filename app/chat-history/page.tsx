"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Clock } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  timestamp: Date
  messageCount: number
  lastMessage: string
}

export default function ChatHistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  useEffect(() => {
    // In a real app, this would fetch from a database
    const mockSessions: ChatSession[] = [
      {
        id: "1",
        title: "Bitcoin Price Analysis with Mao.Ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        messageCount: 8,
        lastMessage:
          "Based on current market trends, Bitcoin is showing bullish signals according to Mao.Ai analysis...",
      },
      {
        id: "2",
        title: "DeFi Yield Farming Strategies",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        messageCount: 12,
        lastMessage: "Mao.Ai recommends these yield farming opportunities right now...",
      },
      {
        id: "3",
        title: "Altcoin Market Overview",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        messageCount: 6,
        lastMessage: "Several altcoins are showing strong momentum according to Mao.Ai's analysis...",
      },
    ]
    setSessions(mockSessions)
  }, [])

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-foreground mb-2">Chat History</h1>
            <p className="text-muted-foreground">Your previous conversations with Mao.Ai</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {sessions.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl text-foreground mb-2">No chat history yet</h3>
              <p className="text-muted-foreground mb-6">
                Start a conversation with Mao.Ai to see your chat history here
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">Start Chatting with Mao.Ai</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="bg-card border-border hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{session.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatTimeAgo(session.timestamp)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{session.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {session.messageCount} messages
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-muted border-border text-foreground hover:bg-accent"
                    >
                      Continue Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
