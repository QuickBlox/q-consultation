import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import { QBAppointment, QBSession } from 'quickblox'
import without from 'lodash/without'

import { QCAppointment, QBUserId } from '@/models'
import {
  qbChatConnect,
  qbChatSendSystemMessage,
  qbChatCreate,
  qbCreateCustomObject,
  getUserById,
  QBAdminApi,
  QBUserApi,
  qbCreateSession,
} from '@/services/quickblox'
import { userHasTag } from '@/services/quickblox/utils'
import {
  APPOINTMENT_NOTIFICATION,
  DIALOG_NOTIFICATION,
} from '@/constants/notificationTypes'

export const createAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Create new appointment',
  body: Type.Object({
    provider_id: QBUserId,
    client_id: QBUserId,
    description: Type.String({
      description: 'Description of the appointment',
    }),
  }),
  response: {
    200: Type.Ref(QCAppointment),
  },
  security: [
    { apiKey: [] },
    { providerSession: [] },
    { clientSession: [] },
  ] as Security,
}

type SuccessResponse = Static<(typeof createAppointmentSchema.response)['200']>

const createAppointment: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleValidate = async (
    body: Static<typeof createAppointmentSchema.body>,
  ) => {
    const { client_id, provider_id } = body
    const [client, provider] = await Promise.all([
      getUserById(QBUserApi, client_id),
      getUserById(QBUserApi, provider_id),
    ])
    const errors = []

    if (!provider || !userHasTag(provider, 'provider')) {
      errors.push('body/provider_id Invalid property')
    }

    if (!client || userHasTag(client, 'provider')) {
      errors.push('body/client_id Invalid property')
    }

    return errors.length
      ? fastify.httpErrors.badRequest(errors.join(';'))
      : undefined
  }

  const handleResponse = async (
    session: QBSession,
    payload: SuccessResponse | null,
  ) => {
    if (payload) {
      await qbChatConnect(QBUserApi, session.user_id, session.token)

      const recipients = without(
        [payload.provider_id, payload.client_id],
        session.user_id,
      )

      recipients.forEach((userId) => {
        const dialogId = QBUserApi.chat.helpers.getUserJid(userId)
        const systemMessages = [
          {
            dialogId,
            message: {
              extension: {
                notification_type: DIALOG_NOTIFICATION,
                dialog_id: payload.dialog_id,
              },
            },
          },
          {
            dialogId,
            message: {
              extension: {
                notification_type: APPOINTMENT_NOTIFICATION,
                appointment_id: payload._id,
              },
            },
          },
        ]

        systemMessages.forEach(({ dialogId: to, message }) => {
          qbChatSendSystemMessage(QBUserApi, to, message)
        })
      })
    }
  }

  fastify.post(
    '',
    {
      schema: createAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
      preHandler: (request, reply, done) => {
        handleValidate(request.body).then(done).catch(done)
      },
      onResponse: (request, reply, done) => {
        const data: SuccessResponse | null = reply.payload

        handleResponse(request.session!, data)
        done()
      },
    },
    async (request) => {
      const { provider_id, client_id, description } = request.body

      const accessData = {
        access: 'open_for_users_ids',
        ids: [fastify.qbAdminId, provider_id, client_id].reduce<string[]>(
          (res, id) => (id ? [...res, id.toString()] : res),
          [],
        ),
      }
      const permissions = {
        read: accessData,
        update: accessData,
        delete: accessData,
      }

      QBAdminApi.init()
      const [dialog] = await Promise.all([
        qbChatCreate(QBUserApi, [provider_id, client_id]),
        qbCreateSession(QBAdminApi, {
          email: fastify.config.QB_ADMIN_EMAIL,
          password: fastify.config.QB_ADMIN_PASSWORD,
        }),
      ])
      const appointment = await qbCreateCustomObject<QBAppointment>(
        QBAdminApi,
        'Appointment',
        {
          priority: 0,
          dialog_id: dialog._id,
          provider_id,
          client_id,
          description,
          permissions,
        },
      )

      return appointment
    },
  )
}

export default createAppointment
