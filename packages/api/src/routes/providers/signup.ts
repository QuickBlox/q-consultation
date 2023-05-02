import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'
import { QBCreateUserWithEmail } from 'quickblox'

import { QBSession, QBUser, QCProvider } from '@/models'
import { qbCreateSession } from '@/services/auth'
import { qbCreateUser } from '@/services/users'
import { getCompletion } from '@/services/openai'

export const signUpSchema = {
  tags: ['users', 'providers'],
  body: Type.Intersect([
    Type.Omit(QCProvider, [
      'id',
      'created_at',
      'updated_at',
      'last_request_at',
    ]),
    Type.Object({
      password: Type.String(),
    }),
  ]),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      data: Type.Ref(QBUser),
    }),
  },
}

const signup: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('/signup', { schema: signUpSchema }, async (request) => {
    const { description, full_name } = request.body
    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'full_name',
      'description',
      'language',
    )
    const session = await qbCreateSession()
    let keywords = `${full_name}, `

    if (fastify.config.AI_SUGGEST_PROVIDER && description) {
      keywords += await getCompletion(
        `Write in English keywords describing a specialist for this description separated by commas:\n${description.replaceAll(
          '\n',
          ' ',
        )}\n\n`,
      )
    }

    const user = await qbCreateUser<QBCreateUserWithEmail>({
      ...userData,
      custom_data: JSON.stringify({ ...customData, keywords }),
      tag_list: ['provider'],
    })

    return { session, data: user }
  })
}

export default signup
