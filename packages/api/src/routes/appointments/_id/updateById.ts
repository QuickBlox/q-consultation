import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import QB, { QBAppointment, QBSession } from 'quickblox'
import without from 'lodash/without'

import { QBCustomObjectId, QCAppointment } from '@/models'
import { qbUpdateCustomObject } from '@/services/customObject'
import { findUserById } from '@/services/users'
import { userHasTag } from '@/utils/user'
import { qbChatConnect, qbChatSendSystemMessage } from '@/services/chat'
import { APPOINTMENT_NOTIFICATION } from '@/constants/notificationTypes'

const updateAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Update appointment by id',
  params: Type.Object({
    id: QBCustomObjectId,
  }),
  body: Type.Omit(QCAppointment, [
    '_id',
    'user_id',
    '_parent_id',
    'created_at',
    'updated_at',
    'client_id',
    'dialog_id',
  ]),
  response: {
    200: Type.Ref(QCAppointment),
  },
  security: [
    { apiKey: [] },
    { providerSession: [] },
    { clientSession: [] },
  ] as Security,
}

type SuccessResponse = Static<(typeof updateAppointmentSchema.response)['200']>

const updateAppointmentById: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleValidate = async (
    body: Static<typeof updateAppointmentSchema.body>,
  ) => {
    const { provider_id } = body
    const provider = await findUserById(provider_id)

    if (!provider || !userHasTag(provider, 'provider')) {
      return new Error('body/provider_id Invalid property')
    }

    return undefined
  }

  const handleResponse = async (
    session: QBSession,
    payload: SuccessResponse | null,
  ) => {
    if (payload) {
      await qbChatConnect(session.user_id, session.token)

      const recipients = without(
        [payload.provider_id, payload.client_id],
        session.user_id,
      )

      recipients.forEach((userId) => {
        const dialogId = QB.chat.helpers.getUserJid(userId)
        const systemMessage = {
          extension: {
            notification_type: APPOINTMENT_NOTIFICATION,
            appointment_id: payload._id,
          },
        }

        qbChatSendSystemMessage(dialogId, systemMessage)
      })
    }
  }

  fastify.put(
    '',
    {
      schema: updateAppointmentSchema,
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
      const { id } = request.params

      const appointment = await qbUpdateCustomObject<QBAppointment>(
        id,
        'Appointment',
        request.body,
      )

      return appointment
    },
  )
}

export default updateAppointmentById
