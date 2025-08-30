"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, PieChart } from "lucide-react"
import type { PortfolioData } from "@/app/portfolio/page"

interface PortfolioStatsProps {
  data: PortfolioData
}

export function PortfolioStats({ data }: PortfolioStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {/* Total Value */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(data.totalValue)}</div>
        </CardContent>
      </Card>

      {/* Total Cost */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Cost</CardTitle>
          <PieChart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(data.totalCost)}</div>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total P&L</CardTitle>
          {data.totalPnL >= 0 ? (
            <TrendingUp className="h-4 w-4 text-white" />
          ) : (
            <TrendingDown className="h-4 w-4 text-white" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{formatCurrency(data.totalPnL)}</div>
          <p className="text-xs text-white">
            {data.totalPnLPercentage >= 0 ? "+" : ""}
            {data.totalPnLPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      {/* Holdings Count */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Holdings</CardTitle>
          <PieChart className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-xl lg:text-2xl font-bold text-white">{data.items.length}</div>
          <p className="text-xs text-gray-400">Different assets</p>
        </CardContent>
      </Card>
    </div>
  )
}
