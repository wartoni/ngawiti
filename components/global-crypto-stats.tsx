"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface GlobalData {
  total_market_cap: { usd: number }
  total_volume: { usd: number }
  market_cap_percentage: { btc: number; eth: number }
  market_cap_change_percentage_24h_usd: number
  active_cryptocurrencies: number
  markets: number
}

export function GlobalCryptoStats() {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const response = await fetch("/api/crypto/global")
        const result = await response.json()

        if (result.success) {
          setGlobalData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch global data:", error)
        // Keep existing global data if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchGlobalData()
    const interval = setInterval(fetchGlobalData, 180000) // Update every 3 minutes instead of 1

    return () => clearInterval(interval)
  }, [])

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`
    }
    return `$${num.toLocaleString()}`
  }

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Global Market Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-6 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!globalData) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">Failed to load global market data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Global Market Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm">Total Market Cap</p>
            <p className="text-white font-semibold text-lg">{formatLargeNumber(globalData.total_market_cap.usd)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">24h Volume</p>
            <p className="text-white font-semibold text-lg">{formatLargeNumber(globalData.total_volume.usd)}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">BTC Dominance</p>
            <p className="text-white font-semibold text-lg">{globalData.market_cap_percentage.btc.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">ETH Dominance</p>
            <p className="text-white font-semibold text-lg">{globalData.market_cap_percentage.eth.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Active Cryptos</p>
            <p className="text-white font-semibold text-lg">{globalData.active_cryptocurrencies.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">24h Change</p>
            <div className="flex items-center font-semibold text-lg text-white">
              {globalData.market_cap_change_percentage_24h_usd >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(globalData.market_cap_change_percentage_24h_usd).toFixed(2)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
