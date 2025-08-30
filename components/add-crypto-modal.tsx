"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import type { PortfolioItem } from "@/app/portfolio/page"

interface AddCryptoModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (item: Omit<PortfolioItem, "id" | "dateAdded">) => void
}

const popularCryptos = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "BNB", symbol: "BNB" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK" },
  { id: "polygon", name: "Polygon", symbol: "MATIC" },
]

export function AddCryptoModal({ isOpen, onClose, onAdd }: AddCryptoModalProps) {
  const [selectedCrypto, setSelectedCrypto] = useState<{
    id: string
    name: string
    symbol: string
  } | null>(null)
  const [quantity, setQuantity] = useState("")
  const [averagePrice, setAveragePrice] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCryptos = popularCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCrypto || !quantity || !averagePrice) return

    onAdd({
      coinId: selectedCrypto.id,
      symbol: selectedCrypto.symbol,
      name: selectedCrypto.name,
      quantity: Number.parseFloat(quantity),
      averagePrice: Number.parseFloat(averagePrice),
    })

    // Reset form
    setSelectedCrypto(null)
    setQuantity("")
    setAveragePrice("")
    setSearchTerm("")
    onClose()
  }

  const handleClose = () => {
    setSelectedCrypto(null)
    setQuantity("")
    setAveragePrice("")
    setSearchTerm("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Add Cryptocurrency</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Crypto */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Cryptocurrency</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                type="text"
                placeholder="Search crypto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {/* Crypto Selection */}
          <div className="space-y-2">
            <Label>Select Cryptocurrency</Label>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {filteredCryptos.map((crypto) => (
                <button
                  key={crypto.id}
                  type="button"
                  onClick={() => setSelectedCrypto(crypto)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedCrypto?.id === crypto.id
                      ? "bg-green-600 border-green-500"
                      : "bg-gray-700 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{crypto.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{crypto.symbol}</p>
                      <p className="text-sm text-gray-400">{crypto.name}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          {/* Average Price */}
          <div className="space-y-2">
            <Label htmlFor="averagePrice">Average Purchase Price (USD)</Label>
            <Input
              id="averagePrice"
              type="number"
              step="any"
              placeholder="0.00"
              value={averagePrice}
              onChange={(e) => setAveragePrice(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedCrypto || !quantity || !averagePrice}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Add to Portfolio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
