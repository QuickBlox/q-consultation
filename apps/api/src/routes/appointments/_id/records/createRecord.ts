import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, { promisifyCall, QBAppointment, QBRecord } from '@qc/quickblox'

import { QBAdmin, createInitConfig } from '@/services/quickblox'
import { MultipartFile, QBCustomObjectId, QCRecord } from '@/models'
import { createAudioDialogAnalytics } from '@/services/openai'

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

      QBAdmin.init(
        fastify.config.QB_SDK_CONFIG_APP_ID,
        fastify.config.QB_SDK_CONFIG_AUTH_KEY,
        fastify.config.QB_SDK_CONFIG_AUTH_SECRET,
        fastify.config.QB_SDK_CONFIG_ACCOUNT_KEY,
        createInitConfig(fastify.config),
      )

      const [{ provider_id }] = await Promise.all([
        // TODO: Workaround. Replace with getting a custom object by id
        promisifyCall(QB.data.update<QBAppointment>, 'Appointment', {
          _id: id,
        }),
        promisifyCall(QBAdmin.createSession, {
          email: fastify.config.QB_ADMIN_EMAIL,
          password: fastify.config.QB_ADMIN_PASSWORD,
        }),
      ])

      const [videoData, audioInfo] = await Promise.all([
        video &&
          (await promisifyCall(QB.content.createAndUpload, {
            name: video.filename,
            type: video.mimetype,
            file: video.buffer,
            size: Buffer.byteLength(video.buffer as Buffer),
          })),
        audio &&
          (await createAudioDialogAnalytics(audio).catch((error) => {
            if (error.status === 413) {
              return null
            }

            // eslint-disable-next-line promise/no-return-wrap
            return Promise.reject(error)
          })),
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

      const record = await promisifyCall(
        QBAdmin.data.createChild<QBRecord>,
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
