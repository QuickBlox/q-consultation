import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile, QCRecord } from '@/models'
import { getAudioInfo } from '@/services/openai'
import { qbCreateChildCustomObject } from '@/services/customObject'
import { qbUploadFile } from '@/services/content'
import { QBRecord } from 'quickblox'

const createRecord: FastifyPluginAsyncTypebox = async (fastify) => {
  const createRecordSchema = {
    tags: ['appointments'],
    description: 'Create a record for the appointment',
    consumes: ['multipart/form-data'],
    params: Type.Object({
      id: Type.String({ pattern: '^[a-z0-9]{24}$' }),
    }),
    body: fastify.config.AI_RECORD_ANALYTICS
      ? Type.Object({
          audio: MultipartFile,
          video: Type.Optional(MultipartFile),
        })
      : Type.Object({
          video: MultipartFile,
        }),
    response: {
      200: Type.Ref(QCRecord),
    },
    security: [{ apiKey: [] }, { providerSession: [] }] as Security,
  }

  fastify.post(
    '',
    {
      schema: createRecordSchema,
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request) => {
      const { id } = request.params
      const audio =
        fastify.config.AI_RECORD_ANALYTICS && 'audio' in request.body
          ? request.body.audio
          : null
      const video = 'video' in request.body ? request.body.video : null

      const videoData =
        video &&
        (await qbUploadFile(
          video.filename,
          video.buffer,
          video.mimetype,
          Buffer.byteLength(video.buffer),
        ))

      const audioInfo =
        audio && (await getAudioInfo(audio.filename, audio.buffer))
      const transcription =
        audioInfo?.transcription?.map(
          ({ start, text }) => `${start}|${text}`,
        ) || []

      const record = await qbCreateChildCustomObject<QBRecord>(
        'Appointment',
        id,
        'Record',
        {
          appointment_id: id,
          name: video?.filename || audio?.filename,
          uid: videoData?.uid,
          transcription,
          summary: audioInfo?.summary,
          actions: audioInfo?.actions,
        },
      )

      return record
    },
  )
}

export default createRecord
