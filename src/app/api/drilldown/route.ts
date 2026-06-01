import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { DrillDownRequest } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are Head of Macro Research at a private investment office. The user is interrogating a section of today's macro intelligence brief.

When going deeper: expand on mechanism, historical context, and what specifically to watch. Name historical parallels and explain why this situation rhymes. Do not repeat what is already in the brief.

When answering a follow-up question: answer it directly and precisely using the section content as context. Be specific. If the question challenges the read, engage with the challenge seriously — steelman it, then explain your view.

Write like a senior analyst in dialogue with a sophisticated reader who has already absorbed the brief.`

export async function POST(request: NextRequest) {
  let body: DrillDownRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { sectionKey, sectionContent, briefDate, question } = body

  const context = `Today is ${briefDate}. Section: "${sectionKey}"\n\n${JSON.stringify(sectionContent, null, 2)}`

  const userMessage = question
    ? `${context}\n\nFollow-up question: ${question}`
    : `${context}\n\nGo deeper. More mechanism, historical context, and what specifically to watch.`

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
