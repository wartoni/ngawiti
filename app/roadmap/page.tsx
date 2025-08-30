"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const roadmapItems = [
  {
    id: "01",
    title: "AI-Powered Crypto Terminal",
    description:
      "Crypto moves fast, don't waste time doomscrolling for insights. Mao.Ai cuts through the noise, delivering real-time market intelligence with advanced AI capabilities.",
    status: "completed",
  },
  {
    id: "02",
    title: "Mao, But Could Be Better",
    description:
      "Additional AI capabilities and features such as smart wallets, comparison queries, advanced charts, larger and more diverse datasets for comprehensive market analysis.",
    status: "in-progress",
  },
  {
    id: "03",
    title: "Your Wish is My Command",
    description:
      "Integrating with DeFi platforms and liquidity hubs. Trade tokens and execute DeFi strategies like yield farming and staking with single command on Mao.Ai terminal.",
    status: "planned",
  },
]

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-foreground mb-4">Mao.Ai is getting better, one query at a time.</h1>
        </div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roadmapItems.map((item) => (
            <Card key={item.id} className="bg-card border-border relative">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    / {item.id}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-foreground">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
