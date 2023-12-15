import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'
import QB, {
  promisifyCall,
  parseUserCustomData,
  stringifyUserCustomData,
} from '@qc/quickblox'

import { QBUser, QBUserId, QCClient } from '@/models'

const updateByIdSchema = {
  tags: ['Users'],
  summary: 'Update client by id',
  description: 'Update a specific client profile by ID using an apiKey',
  params: Type.Object({
    id: QBUserId,
  }),
  body: Type.Intersect([
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
    Type.Partial(
      Type.Object({
        password: Type.String({ description: "User's password" }),
      }),
    ),
  ]),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ apiKey: [] }] as Security,
}

const updateProvider: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.patch(
    '/:id',
    {
      schema: updateByIdSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request) => {
      const { id } = request.params

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
      const currentUserData = await promisifyCall(QB.users.getById, id)
      const currentUserCustomData = parseUserCustomData(
        currentUserData.custom_data,
      )

      const updatedUser = await promisifyCall(QB.users.update, id, {
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
