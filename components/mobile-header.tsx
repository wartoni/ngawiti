"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { SimpleThemeToggle } from "@/components/simple-theme-toggle"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onMenuClick} className="text-foreground">
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <img src="/images/web3mao-mascot.png" alt="Mao.Ai" className="w-6 h-6 rounded-full" />
          <span className="font-semibold text-foreground">Mao.Ai</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SimpleThemeToggle />
      </div>
    </div>
  )
}
