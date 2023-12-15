import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'
import merge from 'lodash/merge'
import QB, {
  promisifyCall,
  stringifyUserCustomData,
  parseUserCustomData,
} from '@qc/quickblox'

import { QBUser, QBUserId, QCProvider } from '@/models'
import { createProviderKeywords } from '@/services/openai'

const updateByIdSchema = {
  tags: ['Users'],
  summary: 'Update provider by id',
  description: 'Update a specific provider profile by ID using an apiKey',
  params: Type.Object({
    id: QBUserId,
  }),
  body: Type.Intersect([
    Type.Omit(QCProvider, [
      'id',
      'created_at',
      'updated_at',
      'last_request_at',
    ]),
    Type.Partial(
      Type.Object({
        password: Type.String({
          description: "User's password",
        }),
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
      const { profession, description } = request.body

      const newUserData = pick(
        request.body,
        'full_name',
        'email',
        'password',
        'old_password',
      )
      const newCustomData = pick(
        request.body,
        'profession',
        'description',
        'language',
      )
      const currentUserData = await promisifyCall(QB.users.getById, id)
      const currentCustomData = parseUserCustomData(currentUserData.custom_data)
      const customData = merge(currentCustomData, newCustomData)

      if (fastify.config.AI_SUGGEST_PROVIDER && description && profession) {
        customData.keywords = await createProviderKeywords(
          profession,
          description,
        )
      }

      const updatedUser = await promisifyCall(QB.users.update, id, {
        ...newUserData,
        custom_data: stringifyUserCustomData(customData),
      })

      return updatedUser
    },
  )
}

export default updateProvider
