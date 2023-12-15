import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import without from 'lodash/without'
import QB, {
  promisifyCall,
  QBSession,
  QBAppointment,
  userHasTag,
} from '@qc/quickblox'

import { QCAppointment, QBUserId } from '@/models'
import { QBAdmin, createInitConfig } from '@/services/quickblox'
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
      promisifyCall(QB.users.getById, client_id),
      promisifyCall(QB.users.getById, provider_id),
    ])
    const { items: appointments } = await promisifyCall(
      QB.data.list<QBAppointment>,
      'Appointment',
      {
        provider_id: body.provider_id,
        client_id: body.client_id,
        date_end: null,
      },
    )

    if (appointments.length) {
      return fastify.httpErrors.conflict(
        'There is still active appointment between users',
      )
    }

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
      await promisifyCall(QB.chat.connect, {
        userId: session.user_id,
        password: session.token,
      })

      const recipients = without(
        [payload.provider_id, payload.client_id],
        session.user_id,
      )

      recipients.forEach((userId) => {
        const dialogId = QB.chat.helpers.getUserJid(userId)
        const systemMessages = <const>[
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
          QB.chat.sendSystemMessage(to, message)
          // qbChatSendSystemMessage(QBUserApi, to, message)
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

      QBAdmin.init(
        fastify.config.QB_SDK_CONFIG_APP_ID,
        fastify.config.QB_SDK_CONFIG_AUTH_KEY,
        fastify.config.QB_SDK_CONFIG_AUTH_SECRET,
        fastify.config.QB_SDK_CONFIG_ACCOUNT_KEY,
        createInitConfig(fastify.config),
      )

      const [dialog] = await Promise.all([
        promisifyCall(QB.chat.dialog.create, {
          name: '-',
          occupants_ids: [provider_id, client_id],
          type: 2,
        }),
        promisifyCall(QBAdmin.createSession, {
          email: fastify.config.QB_ADMIN_EMAIL,
          password: fastify.config.QB_ADMIN_PASSWORD,
        }),
      ])

      const appointment = await promisifyCall(
        QBAdmin.data.create<QBAppointment>,
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
