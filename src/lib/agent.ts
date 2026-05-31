import Anthropic from '@anthropic-ai/sdk'
import type { Message, MessageParam } from '@anthropic-ai/sdk/resources/messages'
import type { Brief } from './types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Head of Macro Research at a private investment office. Your job is to read the world every morning and produce an intelligence brief that tells your principals exactly what they need to know — and what most people are missing.

Your universe is not just financial markets. It is the full macro environment: monetary policy, geopolitics, supply chains, energy systems, currency dynamics, sovereign debt, structural economic shifts, and any developing situation that could materially affect the global operating environment for capital.

You think in mechanisms, not headlines. You do not report that something happened. You explain why it happened, what it means, and what it signals about what comes next.

Rules:
- Never report without explaining the mechanism
- Always address dollar dynamics
- Always address the yield curve
- Distinguish between cyclical and structural forces
- Flag early signals before they are consensus
- Write like a senior analyst, not a news aggregator
- If something is uncertain, say what would resolve the uncertainty
- The under_the_surface section is the most important — this is where the edge is`

const BRIEF_SCHEMA = `{
  "headline": "A single sentence — the single most important thing happening in the macro environment right now. Not a summary. A thesis.",
  "macro_environment": {
    "summary": "2-3 paragraphs. Where are we in the cycle — credit cycle, liquidity cycle, business cycle? What is the dominant macro force operating right now? What is the overall operating environment for capital? Write like a senior analyst, not a news wire.",
    "cycle_position": "One sentence locating current conditions on the relevant cycle.",
    "dominant_force": "The single most important macro force active right now.",
    "dollar_dynamics": "What is the dollar doing and what does it mean? Always address this."
  },
  "what_happened": [
    {
      "title": "Short title",
      "category": "one of: RATES | FX | GEOPOLITICS | SUPPLY_CHAIN | ENERGY | CENTRAL_BANKS | SOVEREIGN_DEBT | STRUCTURAL",
      "summary": "What happened. 2-3 sentences.",
      "mechanism": "Why it matters. Explain the transmission mechanism — how does this connect to the broader macro environment? What does it affect downstream?",
      "signal_or_noise": "SIGNAL or NOISE",
      "signal_reason": "Why is this a signal or noise? Be specific."
    }
  ],
  "under_the_surface": {
    "summary": "The thing most people are not talking about yet. The early signal. The developing situation that is not a story yet but will be. This is the highest value section of the brief. It could be a shipping disruption, a bank stress indicator, a political development, a commodity move — anything that is forming beneath the consensus narrative.",
    "what_to_watch": "Specifically what data, event, or development would confirm this is becoming a real story.",
    "time_horizon": "How long until this surfaces if it develops — days, weeks, months?"
  },
  "watch_list": [
    {
      "item": "What to watch",
      "why": "Why it matters right now",
      "trigger": "What specific development would make this actionable"
    }
  ],
  "yield_curve": {
    "current_shape": "Normal | Flat | Inverted | Steepening | Flattening",
    "commentary": "Current yield curve dynamics and what they signal. Always include 2s10s spread direction and what it means in the current context."
  },
  "one_line_summary": "If you had 10 seconds with your principal, what would you say? One sentence."
}`

export async function runDailyAgent(date: string): Promise<Brief> {
  const userMessage = `Today's date is ${date}. Use web search to read current news, central bank communications, market developments, and geopolitical situations from the last 24-48 hours.

Produce your brief in the following JSON structure. Respond with ONLY valid JSON — no preamble, no markdown code fences, no explanation before or after:

${BRIEF_SCHEMA}

Requirements:
- what_happened: 4-6 items minimum, covering different categories
- watch_list: 3-5 items
- signal_or_noise must be exactly "SIGNAL" or "NOISE"
- All fields required. No nulls.`

  const messages: MessageParam[] = [{ role: 'user', content: userMessage }]

  let response: Message

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = (await (client.messages as any).create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      tool_choice: { type: 'auto' },
      messages,
    })) as Message

    if (response.stop_reason === 'end_turn') break

    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = []

      for (const block of response.content) {
        if (block.type === 'tool_use') {
          toolResults.push({
            type: 'tool_result',
            tool_use_id: block.id,
            content: 'Search completed.',
          })
        }
      }

      messages.push({ role: 'assistant', content: response.content })
      messages.push({ role: 'user', content: toolResults })
    }
  }

  const textBlock = response!.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Agent returned no text content')
  }

  let jsonText = textBlock.text.trim()
  // Strip markdown fences
  if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
  }
  // If model added preamble text, find the first { and slice from there
  const firstBrace = jsonText.indexOf('{')
  if (firstBrace > 0) jsonText = jsonText.slice(firstBrace)
  // Trim any trailing text after the final }
  const lastBrace = jsonText.lastIndexOf('}')
  if (lastBrace !== -1 && lastBrace < jsonText.length - 1) jsonText = jsonText.slice(0, lastBrace + 1)

  const brief = JSON.parse(jsonText) as Brief
  return brief
}
