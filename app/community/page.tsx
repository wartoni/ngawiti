"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-light text-foreground mb-4">Join the Mao.Ai Community</h1>
          <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto">
            Connect with fellow crypto enthusiasts, get the latest updates, and be part of the Mao.Ai revolution
          </p>
        </div>

        {/* Social Media Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Telegram Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                Telegram Community
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Join our most active community for real-time discussions, market updates, and direct access to the
                Mao.Ai team.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-muted text-foreground">
                  Real-time Updates
                </Badge>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  Community Support
                </Badge>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  Alpha Calls
                </Badge>
              </div>
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => window.open("https://t.me/maoai", "_blank")}
              >
                Join Telegram
              </Button>
            </CardContent>
          </Card>

          {/* Twitter Card */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-3">
                <svg className="w-8 h-8 text-gray-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter / X
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Follow us for the latest announcements, market insights, and Mao.Ai ecosystem updates.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-muted text-foreground">
                  News & Updates
                </Badge>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  Market Analysis
                </Badge>
                <Badge variant="secondary" className="bg-muted text-foreground">
                  Announcements
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full bg-black hover:bg-gray-900 text-white border-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                onClick={() => window.open("https://twitter.com/maoai", "_blank")}
              >
                Follow on X
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-light text-foreground mb-4">Ready to Join the Revolution?</h2>
          <p className="text-muted-foreground mb-6">Be part of the future of AI-powered crypto trading with Mao.Ai</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3"
              onClick={() => window.open("https://t.me/maoai", "_blank")}
            >
              Join Telegram Now
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-border text-foreground hover:bg-accent px-8 py-3"
              onClick={() => window.open("https://twitter.com/maoai", "_blank")}
            >
              Follow on X
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
