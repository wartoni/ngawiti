"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { AddCryptoModal } from "@/components/add-crypto-modal"
import { PortfolioStats } from "@/components/portfolio-stats"
import { PortfolioChart } from "@/components/portfolio-chart"

export interface PortfolioItem {
  id: string
  coinId: string
  symbol: string
  name: string
  quantity: number
  averagePrice: number
  dateAdded: string
}

export interface PortfolioData {
  items: PortfolioItem[]
  totalValue: number
  totalCost: number
  totalPnL: number
  totalPnLPercentage: number
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [prices, setPrices] = useState<{ [key: string]: any }>({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load portfolio from localStorage
  useEffect(() => {
    const savedPortfolio = localStorage.getItem("mao-ai-portfolio")
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio))
    }
    setLoading(false)
  }, [])

  // Save portfolio to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("mao-ai-portfolio", JSON.stringify(portfolio))
    }
  }, [portfolio, loading])

  // Fetch current prices for portfolio items
  useEffect(() => {
    const fetchPrices = async () => {
      if (portfolio.length === 0) return

      const coinIds = portfolio.map((item) => item.coinId).join(",")
      try {
        const response = await fetch(`/api/crypto/prices?ids=${coinIds}`)
        const result = await response.json()
        if (result.success) {
          setPrices(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch portfolio prices:", error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [portfolio])

  // Calculate portfolio data
  useEffect(() => {
    if (portfolio.length === 0) {
      setPortfolioData(null)
      return
    }

    let totalValue = 0
    let totalCost = 0

    portfolio.forEach((item) => {
      const currentPrice = prices[item.coinId]?.usd || 0
      const itemValue = item.quantity * currentPrice
      const itemCost = item.quantity * item.averagePrice

      totalValue += itemValue
      totalCost += itemCost
    })

    const totalPnL = totalValue - totalCost
    const totalPnLPercentage = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0

    setPortfolioData({
      items: portfolio,
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercentage,
    })
  }, [portfolio, prices])

  const addToPortfolio = (item: Omit<PortfolioItem, "id" | "dateAdded">) => {
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
    }
    setPortfolio((prev) => [...prev, newItem])
  }

  const removeFromPortfolio = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-card rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-light text-foreground mb-2">Portfolio Tracker</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Track your cryptocurrency investments with Mao.Ai
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Crypto
          </Button>
        </div>

        {portfolio.length === 0 ? (
          /* Empty State */
          <Card className="bg-card border-border">
            <CardContent className="p-8 lg:p-12 text-center">
              <h3 className="text-lg lg:text-xl text-foreground mb-2">Start Building Your Portfolio</h3>
              <p className="text-muted-foreground mb-6 text-sm lg:text-base">
                Add your first cryptocurrency to start tracking your investments with Mao.Ai
              </p>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 w-full lg:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Crypto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Portfolio Stats */}
            {portfolioData && <PortfolioStats data={portfolioData} />}

            {/* Portfolio Chart */}
            <div className="mb-6 lg:mb-8">
              <PortfolioChart portfolio={portfolio} prices={prices} />
            </div>

            {/* Holdings Table */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-lg lg:text-xl">Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Mobile View */}
                <div className="lg:hidden space-y-4">
                  {portfolio.map((item) => {
                    const currentPrice = prices[item.coinId]?.usd || 0
                    const currentValue = item.quantity * currentPrice
                    const totalCost = item.quantity * item.averagePrice
                    const pnl = currentValue - totalCost
                    const pnlPercentage = totalCost > 0 ? (pnl / totalCost) * 100 : 0
                    const priceChange = prices[item.coinId]?.usd_24h_change || 0

                    return (
                      <Card key={item.id} className="bg-muted border-border">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-foreground">
                                  {item.symbol.slice(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-foreground font-medium">{item.symbol.toUpperCase()}</p>
                                <p className="text-muted-foreground text-sm">{item.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-foreground font-medium">{formatCurrency(currentValue)}</p>
                              <div className="flex items-center justify-end text-xs text-foreground">
                                {pnl >= 0 ? (
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                )}
                                {pnlPercentage >= 0 ? "+" : ""}
                                {pnlPercentage.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Holdings</p>
                              <p className="text-foreground">{formatNumber(item.quantity, 6)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Avg Price</p>
                              <p className="text-foreground">{formatCurrency(item.averagePrice)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Current Price</p>
                              <p className="text-foreground">{formatCurrency(currentPrice)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">P&L</p>
                              <p className="font-medium text-foreground">{formatCurrency(pnl)}</p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromPortfolio(item.id)}
                            className="w-full mt-3 bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600/20"
                          >
                            Remove
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Desktop View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-muted-foreground font-medium py-3">Asset</th>
                        <th className="text-right text-muted-foreground font-medium py-3">Holdings</th>
                        <th className="text-right text-muted-foreground font-medium py-3">Avg Price</th>
                        <th className="text-right text-muted-foreground font-medium py-3">Current Price</th>
                        <th className="text-right text-muted-foreground font-medium py-3">Value</th>
                        <th className="text-right text-muted-foreground font-medium py-3">P&L</th>
                        <th className="text-right text-muted-foreground font-medium py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.map((item) => {
                        const currentPrice = prices[item.coinId]?.usd || 0
                        const currentValue = item.quantity * currentPrice
                        const totalCost = item.quantity * item.averagePrice
                        const pnl = currentValue - totalCost
                        const pnlPercentage = totalCost > 0 ? (pnl / totalCost) * 100 : 0
                        const priceChange = prices[item.coinId]?.usd_24h_change || 0

                        return (
                          <tr key={item.id} className="border-b border-border/50">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-foreground">
                                    {item.symbol.slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-foreground font-medium">{item.symbol.toUpperCase()}</p>
                                  <p className="text-muted-foreground text-sm">{item.name}</p>
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-4">
                              <p className="text-foreground">{formatNumber(item.quantity, 6)}</p>
                            </td>
                            <td className="text-right py-4">
                              <p className="text-foreground">{formatCurrency(item.averagePrice)}</p>
                            </td>
                            <td className="text-right py-4">
                              <div>
                                <p className="text-foreground">{formatCurrency(currentPrice)}</p>
                                <div className="flex items-center justify-end text-xs text-foreground">
                                  {priceChange >= 0 ? (
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                  )}
                                  {Math.abs(priceChange).toFixed(2)}%
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-4">
                              <p className="text-foreground font-medium">{formatCurrency(currentValue)}</p>
                            </td>
                            <td className="text-right py-4">
                              <div>
                                <p className="font-medium text-foreground">{formatCurrency(pnl)}</p>
                                <p className="text-xs text-foreground">
                                  {pnlPercentage >= 0 ? "+" : ""}
                                  {pnlPercentage.toFixed(2)}%
                                </p>
                              </div>
                            </td>
                            <td className="text-right py-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromPortfolio(item.id)}
                                className="bg-red-600/10 border-red-600/20 text-red-400 hover:bg-red-600/20"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Add Crypto Modal */}
        <AddCryptoModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addToPortfolio} />
      </div>
    </div>
  )
}
