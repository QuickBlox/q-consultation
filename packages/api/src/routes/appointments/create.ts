import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QCAppointment, QBUser } from '@/models'
import { qbChatCreate } from '@/services/chat'
import { qbCreateCustomObject } from '@/services/customObject'

export const createAppointmentSchema = {
  tags: ['appointments'],
  description: '[BearerToken][SessionToken]',
  body: Type.Object({
    provider_id: QBUser.properties.id,
    client_id: QBUser.properties.id,
    description: Type.String(),
  }),
  response: {
    200: Type.Ref(QCAppointment),
  },
  security: [
    {
      apiKey: [],
    },
  ],
}

const createAppointment: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post(
    '',
    {
      schema: createAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request) => {
      const { provider_id, client_id, description } = request.body

      const dialog = await qbChatCreate([provider_id, client_id])
      const appointment = await qbCreateCustomObject<QBAppointment>(
        'Appointment',
        {
          priority: 0,
          dialog_id: dialog._id,
          provider_id,
          client_id,
          description,
        },
      )

      return appointment
    },
  )
}

export default createAppointment
