import OpenAI from 'openai'
import { kv } from '@vercel/kv'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

// Cache TTL de 1 hora
const CACHE_TTL = 60 * 60

export async function POST(req: Request) {
  const { prompt } = await req.json()

  // Gera uma chave de cache baseada no prompt
  const cacheKey = `generate:${Buffer.from(prompt).toString('base64')}`
  
  // Tenta obter do cache primeiro
  const cachedResponse = await kv.get(cacheKey)
  if (cachedResponse) {
    const encoder = new TextEncoder()
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: cachedResponse })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    stream: true,
    messages: [
      {
        role: "system",
        content: `Você é um assistente especializado em educação a distância. 
        Gere conteúdo relevante e bem estruturado em português, 
        usando formatação markdown quando apropriado.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  })

  let fullResponse = ''
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || ''
        fullResponse += text
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
      }
      
      // Armazena a resposta completa no cache
      await kv.set(cacheKey, fullResponse, { ex: CACHE_TTL })
      
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 