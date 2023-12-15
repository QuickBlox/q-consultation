import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'

import { QBSession as QBSessionModel, QBUser, QCProvider } from '@/models'
import { createProviderKeywords } from '@/services/openai'
import QB, {
  promisifyCall,
  QBSession,
  stringifyUserCustomData,
} from '@qc/quickblox'

export const signUpSchema = {
  tags: ['Users'],
  summary: 'Create provider',
  body: Type.Intersect([
    Type.Omit(QCProvider, [
      'id',
      'created_at',
      'updated_at',
      'last_request_at',
    ]),
    Type.Object({
      password: Type.String({
        description: "User's password",
      }),
    }),
  ]),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSessionModel),
      user: Type.Ref(QBUser),
    }),
  },
}

const signup: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('', { schema: signUpSchema }, async (request) => {
    const { profession, description, email, password } = request.body

    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'profession',
      'description',
      'language',
    )
    const session = await promisifyCall<QBSession>(QB.createSession)
    let keywords = ''

    if (fastify.config.AI_SUGGEST_PROVIDER && description) {
      keywords += await createProviderKeywords(profession, description)
    }

    await promisifyCall(QB.users.create, {
      ...userData,
      custom_data: stringifyUserCustomData({
        ...customData,
        keywords,
      }),
      tag_list: ['provider'],
    })
    const user = await promisifyCall(QB.login, { email, password })

    return { session, user }
  })
}

export default signup
