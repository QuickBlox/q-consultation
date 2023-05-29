import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QCAppointment } from '@/models'
import { qbUpdateCustomObject } from '@/services/customObject'

const updateAppointmentSchema = {
  tags: ['appointments'],
  description: 'Update appointment by id',
  params: Type.Object({
    id: Type.String({ pattern: '^[a-z0-9]{24}$' }),
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
  ] as Array<{
    [securityLabel: string]: string[]
  }>,
}

const updateAppointmentById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    '',
    {
      schema: updateAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
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
