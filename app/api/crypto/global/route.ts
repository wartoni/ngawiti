import { NextResponse } from "next/server"

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

// Simple in-memory cache
let globalCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 120000 // 2 minutes cache

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 20000 // 20 seconds between requests

export async function GET() {
  try {
    const now = Date.now()

    // Check cache first
    if (globalCache && now - globalCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: globalCache.data,
        timestamp: new Date(globalCache.timestamp).toISOString(),
        cached: true,
      })
    }

    // Rate limiting check
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      if (globalCache) {
        return NextResponse.json({
          success: true,
          data: globalCache.data,
          timestamp: new Date(globalCache.timestamp).toISOString(),
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

    const response = await fetch(`${COINGECKO_BASE_URL}/global`, {
      headers: {
        Accept: "application/json",
        "User-Agent": "gud-tech-app/1.0",
      },
    })

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited, return cached data if available
        if (globalCache) {
          return NextResponse.json({
            success: true,
            data: globalCache.data,
            timestamp: new Date(globalCache.timestamp).toISOString(),
            cached: true,
            note: "API rate limited, returning cached data",
          })
        }

        // No cached data, return mock data
        const mockData = {
          total_market_cap: { usd: 1700000000000 },
          total_volume: { usd: 45000000000 },
          market_cap_percentage: { btc: 50.2, eth: 18.5 },
          market_cap_change_percentage_24h_usd: 2.1,
          active_cryptocurrencies: 10500,
          markets: 850,
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
    globalCache = {
      data: data.data,
      timestamp: now,
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Global crypto API error:", error)

    // Return cached data if available
    if (globalCache) {
      return NextResponse.json({
        success: true,
        data: globalCache.data,
        timestamp: new Date(globalCache.timestamp).toISOString(),
        cached: true,
        note: "API error, returning cached data",
      })
    }

    // Return mock data as fallback
    const mockData = {
      total_market_cap: { usd: 1700000000000 },
      total_volume: { usd: 45000000000 },
      market_cap_percentage: { btc: 50.2, eth: 18.5 },
      market_cap_change_percentage_24h_usd: 2.1,
      active_cryptocurrencies: 10500,
      markets: 850,
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
