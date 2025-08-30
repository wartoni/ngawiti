"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PortfolioItem } from "@/app/portfolio/page"

interface PortfolioChartProps {
  portfolio: PortfolioItem[]
  prices: { [key: string]: any }
}

export function PortfolioChart({ portfolio, prices }: PortfolioChartProps) {
  // Calculate portfolio allocation
  const portfolioAllocation = portfolio.map((item) => {
    const currentPrice = prices[item.coinId]?.usd || 0
    const value = item.quantity * currentPrice
    return {
      ...item,
      value,
      percentage: 0, // Will be calculated after total
    }
  })

  const totalValue = portfolioAllocation.reduce((sum, item) => sum + item.value, 0)

  // Calculate percentages
  portfolioAllocation.forEach((item) => {
    item.percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0
  })

  // Sort by value descending
  portfolioAllocation.sort((a, b) => b.value - a.value)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
  ]

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visual Chart (Simple Bar Chart) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Asset Distribution</h3>
            {portfolioAllocation.slice(0, 10).map((item, index) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                    <span className="text-white font-medium">{item.symbol.toUpperCase()}</span>
                  </div>
                  <span className="text-gray-400">{item.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors[index % colors.length]}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Allocation Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Holdings Breakdown</h3>
            <div className="space-y-3">
              {portfolioAllocation.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                    <div>
                      <p className="text-white font-medium">{item.symbol.toUpperCase()}</p>
                      <p className="text-gray-400 text-sm">{item.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{formatCurrency(item.value)}</p>
                    <p className="text-gray-400 text-sm">{item.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
