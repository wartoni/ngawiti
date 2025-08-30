"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TrendingCoin {
  id: string
  name: string
  symbol: string
  market_cap_rank: number
  thumb: string
  price_btc: number
}

export function TrendingCrypto() {
  const [trending, setTrending] = useState<TrendingCoin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/crypto/trending")
        const result = await response.json()

        if (result.success && result.data.coins) {
          setTrending(result.data.coins.map((coin: any) => coin.item))
        }
      } catch (error) {
        console.error("Failed to fetch trending:", error)
        // Keep existing trending data if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
    const interval = setInterval(fetchTrending, 600000) // Update every 10 minutes instead of 5

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Trending Crypto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded mb-1"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="h-5 bg-gray-700 rounded w-8"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Trending Crypto</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trending.slice(0, 7).map((coin, index) => (
            <div key={coin.id} className="flex items-center gap-3">
              <Badge
                variant="secondary"
                className="bg-gray-700 text-gray-300 w-8 h-8 rounded-full p-0 flex items-center justify-center"
              >
                {index + 1}
              </Badge>
              <img src={coin.thumb || "/placeholder.svg"} alt={coin.name} className="w-8 h-8 rounded-full" />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{coin.name}</p>
                <p className="text-gray-400 text-xs">{coin.symbol}</p>
              </div>
              <Badge variant="outline" className="bg-gray-700 border-gray-600 text-gray-300 text-xs">
                #{coin.market_cap_rank}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
