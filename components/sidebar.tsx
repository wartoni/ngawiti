"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageCircle, BarChart3, Coins, Map, HelpCircle, PieChart, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Chat History", href: "/chat-history", icon: MessageCircle },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "$MAO", href: "/stake", icon: Coins },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Community", href: "/community", icon: Users },
  { name: "FAQ", href: "/faq", icon: HelpCircle },
]

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="h-full w-64 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <img src="/images/web3mao-mascot.png" alt="Mao.Ai" className="w-8 h-8 rounded-full" />
          <span className="font-semibold text-lg text-foreground">Mao.Ai</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-foreground">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Buy $MAO Button */}
      <div className="p-4">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Buy $MAO</Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle for Mobile */}
      <div className="lg:hidden p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
