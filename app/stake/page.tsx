"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins } from "lucide-react"

export default function StakePage() {
  const [stakeAmount, setStakeAmount] = useState(0)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Staking Card */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center gap-3">
                  <Coins className="w-8 h-8 text-blue-500" />
                  Stake $MAO, Earn Rewards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Coming Soon Banner */}
                <div className="text-center py-12 bg-muted rounded-lg border-2 border-dashed border-border">
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Mao.Ai staking rewards are currently in development. Stay tuned for the launch of our revolutionary
                    staking platform!
                  </p>
                  <Badge variant="secondary" className="bg-muted text-foreground px-4 py-2">
                    Launch Coming Q1 2025
                  </Badge>
                </div>

                {/* Feature Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-border">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-foreground font-medium mb-1">Streak Rewards</h4>
                    <p className="text-sm text-muted-foreground">Earn multipliers for consistent staking</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-foreground font-medium mb-1">Premium Features</h4>
                    <p className="text-sm text-muted-foreground">Access advanced AI capabilities</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-foreground font-medium mb-1">Governance Rights</h4>
                    <p className="text-sm text-muted-foreground">Vote on Mao.Ai ecosystem decisions</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <h4 className="text-foreground font-medium mb-1">Exclusive Access</h4>
                    <p className="text-sm text-muted-foreground">Early access to new features</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <div className="text-foreground font-medium">$MAO Token</div>
                    <div className="text-muted-foreground text-sm">Coming Soon</div>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Get ready for the future of crypto staking!</div>
                  <div className="text-sm text-foreground">
                    Join our community to be the first to know when $MAO staking goes live.
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled>
                  Notify Me When Live
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
