import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'
import merge from 'lodash/merge'
import QB, {
  promisifyCall,
  stringifyUserCustomData,
  parseUserCustomData,
} from '@qc/quickblox'

import { QBUser, QCProvider } from '@/models'
import { createProviderKeywords } from '@/services/openai'

const updateMySchema = {
  tags: ['Users'],
  summary: 'Update provider profile',
  description:
    'Update a provider profile. A user can be updated only by themselves or an account owner',
  body: Type.Partial(
    Type.Union(
      [
        Type.Omit(
          QCProvider,
          ['id', 'created_at', 'updated_at', 'last_request_at'],
          { title: 'Without password' },
        ),
        Type.Intersect(
          [
            Type.Omit(QCProvider, [
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
  ),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ providerSession: [] }] as Security,
}

const updateProvider: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.patch(
    '',
    {
      schema: updateMySchema,
      onRequest: fastify.verify(fastify.ProviderSessionToken),
    },
    async (request) => {
      const { user_id } = request.session!
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
      const currentUserData = await promisifyCall(QB.users.getById, user_id)
      const currentCustomData = parseUserCustomData(currentUserData.custom_data)
      const customData = merge(currentCustomData, newCustomData)

      if (fastify.config.AI_SUGGEST_PROVIDER && description && profession) {
        customData.keywords = await createProviderKeywords(
          profession,
          description,
        )
      }

      const updatedUser = await promisifyCall(QB.users.update, user_id, {
        ...newUserData,
        custom_data: stringifyUserCustomData(customData),
      })

      return updatedUser
    },
  )
}

export default updateProvider
