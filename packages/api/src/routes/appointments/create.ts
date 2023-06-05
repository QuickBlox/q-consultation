import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type, Static } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QCAppointment, QBUserId } from '@/models'
import { qbChatCreate } from '@/services/chat'
import { qbCreateCustomObject } from '@/services/customObject'
import { findUserById } from '@/services/users'
import { userHasTag } from '@/utils/user'

export const createAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Create new appointment',
  body: Type.Object({
    provider_id: QBUserId,
    client_id: QBUserId,
    description: Type.String(),
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

const createAppointment: FastifyPluginAsyncTypebox = async (fastify) => {
  const handleValidate = async (
    body: Static<typeof createAppointmentSchema.body>,
  ) => {
    const { client_id, provider_id } = body
    const [client, provider] = await Promise.all([
      findUserById(client_id),
      findUserById(provider_id),
    ])
    const errors = []

    if (!provider || !userHasTag(provider, 'provider')) {
      errors.push('body/provider_id Invalid property')
    }

    if (!client || userHasTag(client, 'provider')) {
      errors.push('body/client_id Invalid property')
    }

    return errors.length ? new Error(errors.join(';')) : undefined
  }

  fastify.post(
    '',
    {
      schema: createAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
      preValidation: (request, reply, done) => {
        handleValidate(request.body).then(done).catch(done)
      },
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
