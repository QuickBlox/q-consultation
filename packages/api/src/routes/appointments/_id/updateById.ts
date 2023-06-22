import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import { QBAppointment } from 'quickblox'

import { QBCustomObjectId, QCAppointment } from '@/models'
import { qbUpdateCustomObject, findUserById } from '@/services/quickblox'
import { userHasTag } from '@/utils/user'

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

  fastify.put(
    '',
    {
      schema: updateAppointmentSchema,
      onRequest: fastify.verify(fastify.BearerToken, fastify.SessionToken),
      preValidation: (request, reply, done) => {
        handleValidate(request.body).then(done).catch(done)
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
