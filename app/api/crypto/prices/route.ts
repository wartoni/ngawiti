import { type NextRequest, NextResponse } from "next/server"

const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

// Simple in-memory cache
let priceCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 60000 // 1 minute cache

// Rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 10000 // 10 seconds between requests

export async function GET(request: NextRequest) {
  try {
    const now = Date.now()

    // Check cache first
    if (priceCache && now - priceCache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        data: priceCache.data,
        timestamp: new Date(priceCache.timestamp).toISOString(),
        cached: true,
      })
    }

    // Rate limiting check
    if (now - lastRequestTime < MIN_REQUEST_INTERVAL) {
      // Return cached data if available, even if expired
      if (priceCache) {
        return NextResponse.json({
          success: true,
          data: priceCache.data,
          timestamp: new Date(priceCache.timestamp).toISOString(),
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

    const { searchParams } = new URL(request.url)
    const ids =
      searchParams.get("ids") ||
      "bitcoin,ethereum,binancecoin,cardano,solana,polkadot,dogecoin,avalanche-2,chainlink,polygon"
    const vs_currencies = searchParams.get("vs_currencies") || "usd"

    lastRequestTime = now

    const response = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=${ids}&vs_currencies=${vs_currencies}&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "gud-tech-app/1.0",
        },
      },
    )

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited, return cached data if available
        if (priceCache) {
          return NextResponse.json({
            success: true,
            data: priceCache.data,
            timestamp: new Date(priceCache.timestamp).toISOString(),
            cached: true,
            note: "API rate limited, returning cached data",
          })
        }

        // No cached data, return mock data
        const mockData = {
          bitcoin: { usd: 43000, usd_24h_change: 2.5, usd_market_cap: 850000000000 },
          ethereum: { usd: 2600, usd_24h_change: 1.8, usd_market_cap: 310000000000 },
          binancecoin: { usd: 310, usd_24h_change: -0.5, usd_market_cap: 47000000000 },
          cardano: { usd: 0.48, usd_24h_change: 3.2, usd_market_cap: 17000000000 },
          solana: { usd: 98, usd_24h_change: 4.1, usd_market_cap: 42000000000 },
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
    priceCache = {
      data: data,
      timestamp: now,
    }

    return NextResponse.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Crypto prices API error:", error)

    // Return cached data if available
    if (priceCache) {
      return NextResponse.json({
        success: true,
        data: priceCache.data,
        timestamp: new Date(priceCache.timestamp).toISOString(),
        cached: true,
        note: "API error, returning cached data",
      })
    }

    // Return mock data as fallback
    const mockData = {
      bitcoin: { usd: 43000, usd_24h_change: 2.5, usd_market_cap: 850000000000 },
      ethereum: { usd: 2600, usd_24h_change: 1.8, usd_market_cap: 310000000000 },
      binancecoin: { usd: 310, usd_24h_change: -0.5, usd_market_cap: 47000000000 },
      cardano: { usd: 0.48, usd_24h_change: 3.2, usd_market_cap: 17000000000 },
      solana: { usd: 98, usd_24h_change: 4.1, usd_market_cap: 42000000000 },
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
