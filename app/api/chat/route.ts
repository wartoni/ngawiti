import { type NextRequest, NextResponse } from "next/server"

const API_KEY = "sk-alSOgf1Ep6fjXxN272Ab236596F64063B6De3d95CaC637E5"
const API_BASE_URL = "https://api.laozhang.ai"
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

interface Message {
  role: "user" | "assistant"
  content: string
}

async function getCryptoData() {
  try {
    // Fetch current prices
    const pricesResponse = await fetch(
      `${COINGECKO_BASE_URL}/simple/price?ids=bitcoin,ethereum,binancecoin,cardano,solana&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
    )
    const prices = await pricesResponse.json()

    // Fetch trending coins
    const trendingResponse = await fetch(`${COINGECKO_BASE_URL}/search/trending`)
    const trending = await trendingResponse.json()

    // Fetch global data
    const globalResponse = await fetch(`${COINGECKO_BASE_URL}/global`)
    const global = await globalResponse.json()

    return {
      prices,
      trending: trending.coins?.slice(0, 5) || [],
      global: global.data || {},
    }
  } catch (error) {
    console.error("Failed to fetch crypto data:", error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, history, portfolio, wallet } = await request.json()

    // Get real-time crypto data
    const cryptoData = await getCryptoData()

    // Create context with crypto data
    let systemPrompt = `You are Mao.Ai, a helpful crypto market analyst and portfolio advisor. You provide insights about cryptocurrency trends, market analysis, trading information, and portfolio management advice. Keep responses concise and informative.`

    if (cryptoData) {
      systemPrompt += `

Current Market Data (Real-time from CoinGecko):

PRICES:
- Bitcoin (BTC): $${cryptoData.prices.bitcoin?.usd?.toLocaleString()} (${cryptoData.prices.bitcoin?.usd_24h_change?.toFixed(2)}% 24h)
- Ethereum (ETH): $${cryptoData.prices.ethereum?.usd?.toLocaleString()} (${cryptoData.prices.ethereum?.usd_24h_change?.toFixed(2)}% 24h)
- BNB: $${cryptoData.prices.binancecoin?.usd?.toLocaleString()} (${cryptoData.prices.binancecoin?.usd_24h_change?.toFixed(2)}% 24h)
- Cardano (ADA): $${cryptoData.prices.cardano?.usd?.toFixed(4)} (${cryptoData.prices.cardano?.usd_24h_change?.toFixed(2)}% 24h)
- Solana (SOL): $${cryptoData.prices.solana?.usd?.toLocaleString()} (${cryptoData.prices.solana?.usd_24h_change?.toFixed(2)}% 24h)

TRENDING COINS:
${cryptoData.trending
  .map(
    (coin: any, index: number) =>
      `${index + 1}. ${coin.item.name} (${coin.item.symbol}) - Rank #${coin.item.market_cap_rank}`,
  )
  .join("\n")}

GLOBAL MARKET:
- Total Market Cap: $${(cryptoData.global.total_market_cap?.usd / 1e12)?.toFixed(2)}T
- 24h Volume: $${(cryptoData.global.total_volume?.usd / 1e9)?.toFixed(2)}B
- BTC Dominance: ${cryptoData.global.market_cap_percentage?.btc?.toFixed(1)}%
- Market Cap Change 24h: ${cryptoData.global.market_cap_change_percentage_24h_usd?.toFixed(2)}%`
    }

    // Add wallet context if connected
    if (wallet && wallet.connected) {
      systemPrompt += `

USER'S WALLET:
- Status: Connected
- Address: ${wallet.address}
- Network: Ethereum Mainnet

The user has connected their Web3 wallet. You can provide wallet-specific advice, DeFi recommendations, and help with blockchain interactions.`
    }

    // Add portfolio context if provided
    if (portfolio && portfolio.length > 0) {
      systemPrompt += `

USER'S PORTFOLIO:
${portfolio
  .map((item: any) => {
    const currentPrice = cryptoData?.prices[item.coinId]?.usd || 0
    const currentValue = item.quantity * currentPrice
    const totalCost = item.quantity * item.averagePrice
    const pnl = currentValue - totalCost
    const pnlPercentage = totalCost > 0 ? (pnl / totalCost) * 100 : 0

    return `- ${item.name} (${item.symbol.toUpperCase()}): ${item.quantity} coins, Avg Price: $${item.averagePrice}, Current Value: $${currentValue.toFixed(2)}, P&L: ${pnl >= 0 ? "+" : ""}$${pnl.toFixed(2)} (${pnlPercentage >= 0 ? "+" : ""}${pnlPercentage.toFixed(2)}%)`
  })
  .join("\n")}

When discussing portfolio, provide specific insights about their holdings, performance, and recommendations.`
    }

    systemPrompt += `

Use this real-time data to provide accurate and current market insights. If asked about portfolio, provide specific analysis of their holdings. If the user has a connected wallet, you can suggest DeFi strategies and Web3 interactions.`

    // Prepare messages for the API
    const messages: Message[] = [
      {
        role: "user",
        content: `${systemPrompt}

User question: ${message}`,
      },
    ]

    // Add conversation history if available
    if (history && history.length > 0) {
      const recentHistory = history.slice(-6) // Keep last 6 messages for context
      recentHistory.forEach((msg: any) => {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      })
    }

    // Make request to Laozhang AI API
    const response = await fetch(`${API_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("API Error:", response.status, errorText)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid API response format")
    }

    const aiResponse = data.choices[0].message.content

    return NextResponse.json({
      response: aiResponse,
      success: true,
      cryptoData: cryptoData, // Include crypto data in response for debugging
    })
  } catch (error) {
    console.error("Chat API Error:", error)

    return NextResponse.json(
      {
        error: "Failed to get AI response",
        response: "Sorry, Mao.Ai is having trouble connecting right now. Please try again in a moment.",
        success: false,
      },
      { status: 500 },
    )
  }
}
