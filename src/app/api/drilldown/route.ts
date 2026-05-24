import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { DrillDownRequest } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Head of Macro Research at a private investment office. The user has clicked into a section of today's macro intelligence brief and wants to go deeper.

Expand on the section content — more mechanism, more historical context, more specificity about what to watch. If there is a historical parallel, name it and explain what happened then and why this situation rhymes. Keep it analytical and precise.

Do not repeat what is already in the brief — go deeper. Write like a senior analyst writing a follow-up note for a sophisticated reader who already absorbed the headline.`

export async function POST(request: NextRequest) {
  let body: DrillDownRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { sectionKey, sectionContent, briefDate } = body

  const userMessage = `Today is ${briefDate}. The user clicked into the "${sectionKey}" section of today's brief. Here is what the brief said:\n\n${JSON.stringify(sectionContent, null, 2)}\n\nGo deeper. More mechanism, historical context, and what specifically to watch.`

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userMessage }],
        })

        for await (const event of messageStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const chunk = `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            controller.enqueue(encoder.encode(chunk))
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Stream error'
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
