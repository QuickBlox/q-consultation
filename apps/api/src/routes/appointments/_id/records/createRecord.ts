import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { MultipartFile, QBCustomObjectId, QCRecord } from '@/models'
import { createAudioDialogAnalytics } from '@/services/openai'
import {
  QBAdminApi,
  QBUserApi,
  qbCreateChildCustomObject,
  qbCreateSession,
  qbUpdateCustomObject,
  qbUploadFile,
} from '@/services/quickblox'
import { QBAppointment, QBRecord } from 'quickblox'

const createRecord: FastifyPluginAsyncTypebox = async (fastify) => {
  const createRecordSchema = {
    tags: ['Appointments'],
    summary: 'Create a record for the appointment',
    consumes: ['multipart/form-data'],
    params: Type.Object({
      id: QBCustomObjectId,
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
    async (request, reply) => {
      const { id } = request.params
      const audio =
        fastify.config.AI_RECORD_ANALYTICS && 'audio' in request.body
          ? request.body.audio
          : null
      const video = 'video' in request.body ? request.body.video : null

      if (
        audio &&
        !/\.(mp3|mp4|mpeg|mpga|m4a|wav|webm)$/i.test(audio.filename)
      ) {
        return reply.badRequest(
          `body/audio Unsupported file format. The following file types are supported: mp3, mp4, mpeg, mpga, m4a, wav and webm.`,
        )
      }

      if (video && !/\.(mp4|mov|avi|mkv|webm)$/i.test(video.filename)) {
        return reply.badRequest(
          `body/video Unsupported file format. The following file types are supported: mp4, mov, avi, mkv and webm.`,
        )
      }

      QBAdminApi.init()
      const [{ provider_id }] = await Promise.all([
        // TODO: Workaround. Replace with getting a custom object by id
        qbUpdateCustomObject<QBAppointment>(QBUserApi, id, 'Appointment', {}),
        qbCreateSession(QBAdminApi, {
          email: fastify.config.QB_ADMIN_EMAIL,
          password: fastify.config.QB_ADMIN_PASSWORD,
        }),
      ])

      const [videoData, audioInfo] = await Promise.all([
        video && (await qbUploadFile(QBUserApi, video)),
        audio && (await createAudioDialogAnalytics(audio)),
      ])

      const accessData = {
        access: 'open_for_users_ids',
        ids: [fastify.qbAdminId, provider_id].reduce<string[]>(
          (res, userId) => (userId ? [...res, userId.toString()] : res),
          [],
        ),
      }
      const permissions = {
        read: accessData,
        update: accessData,
      }
      const transcription =
        audioInfo?.transcription?.map(
          ({ start, text }) => `${start}|${text}`,
        ) || []

      const record = await qbCreateChildCustomObject<QBRecord>(
        QBAdminApi,
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
          permissions,
        },
      )

      return record
    },
  )
}

export default createRecord
