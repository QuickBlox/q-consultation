import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Static, Type } from '@sinclair/typebox'
import QB, { QBAppointment, QBSession } from 'quickblox'
import without from 'lodash/without'
import union from 'lodash/union'

import { QBCustomObjectId, QCAppointment } from '@/models'
import {
  qbUpdateCustomObject,
  findUserById,
  qbChatConnect,
  qbChatSendSystemMessage,
  qbUpdateDialog,
  qbUpdateCustomObjectByCriteria,
} from '@/services/quickblox'
import { userHasTag } from '@/utils/user'
import { APPOINTMENT_NOTIFICATION } from '@/constants/notificationTypes'

const updateAppointmentSchema = {
  tags: ['Appointments'],
  summary: 'Update appointment by id',
  params: Type.Object({
    id: QBCustomObjectId,
  }),
  body: Type.Partial(
    Type.Omit(QCAppointment, [
      '_id',
      'user_id',
      '_parent_id',
      'created_at',
      'updated_at',
      'client_id',
      'dialog_id',
    ]),
  ),
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

    if (provider_id) {
      const provider = await findUserById(provider_id)

      if (!provider || !userHasTag(provider, 'provider')) {
        return fastify.httpErrors.badRequest(
          'body/provider_id Invalid property',
        )
      }
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

  fastify.patch(
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
      const { provider_id } = request.body

      if (provider_id) {
        const { permissions: currentPermissions, dialog_id } =
          // TODO: Workaround. Replace with getting a custom object with permissions
          await qbUpdateCustomObject<QBAppointment>(id, 'Appointment', {})

        const { users_ids } = currentPermissions.update
        const accessData = {
          access: 'open_for_users_ids',
          ids: union(users_ids, [provider_id.toString()]),
        }
        const permissions = {
          read: accessData,
          update: accessData,
          delete: accessData,
        }

        const [appointmentResult] = await Promise.allSettled([
          qbUpdateCustomObject<QBAppointment>(id, 'Appointment', {
            ...request.body,
            permissions,
          }),
          qbUpdateCustomObjectByCriteria(
            'Record',
            { appointment_id: id },
            {
              permissions: {
                read: permissions.read,
              },
            },
          ),
          qbUpdateDialog(dialog_id, {
            push_all: { occupants_ids: [provider_id] },
          }),
        ])

        if (appointmentResult.status === 'rejected') {
          throw appointmentResult.reason
        }

        return appointmentResult.value
      }

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
