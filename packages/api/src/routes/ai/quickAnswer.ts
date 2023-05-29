import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { getChatCompletion } from '@/services/openai'

export const quickAnswerSchema = {
  tags: ['ai'],
  description: 'Get Quick answer',
  body: Type.Object({
    question: Type.String(),
  }),
  response: {
    200: Type.Object({
      answer: Type.String(),
    }),
  },
  security: [{ apiKey: [] }, { providerSession: [] }] as Security,
}

const quickAnswer: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/quick-answer',
    {
      schema: quickAnswerSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request) => {
      const { question } = request.body

      const answer = await getChatCompletion(
        [
          { role: 'system', content: 'You are consulting the user.' },
          { role: 'user', content: question },
        ],
        {
          max_tokens: 512,
          temperature: 0.5,
        },
        true,
      )

      return { answer }
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_QUICK_ANSWER!)

export default quickAnswer
