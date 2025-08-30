import { NextResponse } from "next/server"

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

// Simple in-memory cache
let trendingCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 300000 // 5 minutes cache

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 15000 // 15 seconds between requests

export async function GET() {
  try {
    const now = Date.now()

    // Check cache first
    if (trendingCache && now - trendingCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: trendingCache.data,
        timestamp: new Date(trendingCache.timestamp).toISOString(),
        cached: true,
      })
    }

    // Rate limiting check
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      if (trendingCache) {
        return NextResponse.json({
          success: true,
          data: trendingCache.data,
          timestamp: new Date(trendingCache.timestamp).toISOString(),
          cached: true,
          note: "Rate limited, returning cached data",
        })
      }

      return NextResponse.json(
        {
          success: false,
          error: "Rate limited, please try again later",
        },
        { status: 429 },
      )
    }

    lastRequestTime = now

    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "gud-tech-app/1.0",
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited, return cached data if available
        if (trendingCache) {
          return NextResponse.json({
            success: true,
            data: trendingCache.data,
            timestamp: new Date(trendingCache.timestamp).toISOString(),
            cached: true,
            note: "API rate limited, returning cached data",
          })
        }

        // No cached data, return mock data
        const mockData = {
          coins: [
            { item: { id: "bitcoin", name: "Bitcoin", symbol: "BTC", market_cap_rank: 1, thumb: "" } },
            { item: { id: "ethereum", name: "Ethereum", symbol: "ETH", market_cap_rank: 2, thumb: "" } },
            { item: { id: "solana", name: "Solana", symbol: "SOL", market_cap_rank: 5, thumb: "" } },
            { item: { id: "cardano", name: "Cardano", symbol: "ADA", market_cap_rank: 8, thumb: "" } },
            { item: { id: "polkadot", name: "Polkadot", symbol: "DOT", market_cap_rank: 12, thumb: "" } },
          ],
        }

        return NextResponse.json({
          success: true,
          data: mockData,
          timestamp: new Date().toISOString(),
          mock: true,
          note: "API rate limited, returning mock data",
        })
      }
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    const data = await response.json()

    // Update cache
    trendingCache = {
      data: data,
      timestamp: now,
    }

    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Trending crypto API error:", error)

    // Return cached data if available
    if (trendingCache) {
      return NextResponse.json({
        success: true,
        data: trendingCache.data,
        timestamp: new Date(trendingCache.timestamp).toISOString(),
        cached: true,
        note: "API error, returning cached data",
      })
    }

    // Return mock data as fallback
    const mockData = {
      coins: [
        { item: { id: "bitcoin", name: "Bitcoin", symbol: "BTC", market_cap_rank: 1, thumb: "" } },
        { item: { id: "ethereum", name: "Ethereum", symbol: "ETH", market_cap_rank: 2, thumb: "" } },
        { item: { id: "solana", name: "Solana", symbol: "SOL", market_cap_rank: 5, thumb: "" } },
        { item: { id: "cardano", name: "Cardano", symbol: "ADA", market_cap_rank: 8, thumb: "" } },
        { item: { id: "polkadot", name: "Polkadot", symbol: "DOT", market_cap_rank: 12, thumb: "" } },
      ],
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      timestamp: new Date().toISOString(),
      mock: true,
      note: "API unavailable, returning mock data",
    })
  }
}
