import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile } from '@/models'
import { getAudioInfo } from '@/services/openai'

export const audioInfoSchema = {
  tags: ['AI'],
  summary: 'Get audio info',
  description: 'Get transcription, summary and actions for the audio',
  consumes: ['multipart/form-data'],
  body: Type.Object({
    voice: MultipartFile,
  }),
  response: {
    200: Type.Partial(
      Type.Object({
        transcription: Type.Array(
          Type.Object({
            start: Type.String(),
            end: Type.String(),
            text: Type.String(),
          }),
        ),
        summary: Type.String(),
        actions: Type.String(),
      }),
    ),
  },
  security: [{ apiKey: [] }, { providerSession: [] }] as Security,
}

const audioInfo: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '/audio-info',
    {
      schema: audioInfoSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request, reply) => {
      const { voice } = request.body

      if (!/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/.test(voice.filename)) {
        return reply.badRequest(
          `body/voice Unsupported file format. The following file types are supported: mp3, mp4, mpeg, mpga, m4a, wav and webm.`,
        )
      }

      const data = await getAudioInfo(voice.filename, voice.buffer)

      return data
    },
  )
}

export const autoload = JSON.parse<boolean>(process.env.AI_RECORD_ANALYTICS!)

export default audioInfo
