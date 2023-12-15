import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'
import QB, {
  promisifyCall,
  parseUserCustomData,
  stringifyUserCustomData,
} from '@qc/quickblox'

import { QBUser, QCClient } from '@/models'

const updateMySchema = {
  tags: ['Users'],
  summary: 'Update client profile',
  description:
    'Update a client profile. A user can be updated only by themselves or an account owner',
  body: Type.Union(
    [
      Type.Omit(
        QCClient,
        ['id', 'created_at', 'updated_at', 'last_request_at'],
        { title: 'Without password' },
      ),
      Type.Intersect(
        [
          Type.Omit(QCClient, [
            'id',
            'created_at',
            'updated_at',
            'last_request_at',
          ]),
          Type.Object({
            password: Type.String({
              description:
                "User's new password. Field old_password must be set to update password",
            }),
            old_password: Type.String({
              description:
                'Old user password (required only if a new password is provided)',
            }),
          }),
        ],
        { title: 'With password' },
      ),
    ],
    { title: 'With password' },
  ),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ clientSession: [] }] as Security,
}

const updateProvider: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.patch(
    '',
    {
      schema: updateMySchema,
      onRequest: fastify.verify(fastify.ClientSessionToken),
    },
    async (request) => {
      const { user_id } = request.session!
      const newUserData = pick(
        request.body,
        'full_name',
        'email',
        'password',
        'old_password',
      )
      const newCustomData = pick(
        request.body,
        'address',
        'birthdate',
        'gender',
        'language',
      )
      const currentUserData = await promisifyCall(QB.users.getById, user_id)
      const currentUserCustomData = parseUserCustomData(
        currentUserData.custom_data,
      )

      const updatedUser = await promisifyCall(QB.users.update, user_id, {
        ...newUserData,
        custom_data: stringifyUserCustomData({
          ...currentUserCustomData,
          ...newCustomData,
        }),
      })

      return updatedUser
    },
  )
}

export default updateProvider
