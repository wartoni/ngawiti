"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPrice {
  id: string
  name: string
  symbol: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

const cryptoNames: { [key: string]: { name: string; symbol: string } } = {
  bitcoin: { name: "Bitcoin", symbol: "BTC" },
  ethereum: { name: "Ethereum", symbol: "ETH" },
  binancecoin: { name: "BNB", symbol: "BNB" },
  cardano: { name: "Cardano", symbol: "ADA" },
  solana: { name: "Solana", symbol: "SOL" },
  polkadot: { name: "Polkadot", symbol: "DOT" },
  dogecoin: { name: "Dogecoin", symbol: "DOGE" },
  "avalanche-2": { name: "Avalanche", symbol: "AVAX" },
  chainlink: { name: "Chainlink", symbol: "LINK" },
  polygon: { name: "Polygon", symbol: "MATIC" },
}

export function CryptoPriceTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/crypto/prices")
        const result = await response.json()

        if (result.success) {
          const priceArray: CryptoPrice[] = Object.entries(result.data).map(([id, data]: [string, any]) => ({
            id,
            name: cryptoNames[id]?.name || id,
            symbol: cryptoNames[id]?.symbol || id.toUpperCase(),
            current_price: data.usd || 0,
            price_change_percentage_24h: data.usd_24h_change || 0,
            market_cap: data.usd_market_cap || 0,
            total_volume: data.usd_24h_vol || 0,
          }))
          setPrices(priceArray)
        }
      } catch (error) {
        console.error("Failed to fetch prices:", error)
        // Keep existing prices if fetch fails
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 90000) // Update every 90 seconds instead of 30

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    } else {
      return `$${price.toFixed(6)}`
    }
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    }
    return `$${marketCap.toLocaleString()}`
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="bg-card border-border animate-pulse">
            <CardContent className="p-3 lg:p-4">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-6 bg-muted rounded mb-1"></div>
              <div className="h-4 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {prices.map((crypto) => (
        <Card key={crypto.id} className="bg-card border-border hover:bg-accent transition-colors">
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-sm">{crypto.symbol}</h3>
                <p className="text-xs text-muted-foreground">{crypto.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground text-xs lg:text-sm">{formatPrice(crypto.current_price)}</p>
                <div className="flex items-center justify-end text-xs text-foreground">
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>MCap: {formatMarketCap(crypto.market_cap)}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
