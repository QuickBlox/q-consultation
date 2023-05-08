import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QCAppointment } from '@/models'
import { qbGetCustomObject } from '@/services/customObject'

const getAppointmentSchema = {
  tags: ['appointments'],
  params: Type.Object({
    id: Type.String({ pattern: '^[a-z0-9]+$' }),
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

const getAppointmentById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: getAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
    },
    async (request, reply) => {
      const { id } = request.params

      const {
        items: [appointment],
      } = await qbGetCustomObject<QBAppointment>('Appointment', {
        _id: {
          in: [id],
        },
        limit: 1,
      })

      if (!appointment) {
        return reply.notFound()
      }

      return appointment
    },
  )
}

export default getAppointmentById
