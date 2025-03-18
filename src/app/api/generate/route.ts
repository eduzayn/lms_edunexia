import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt } = await req.json()

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

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
} 