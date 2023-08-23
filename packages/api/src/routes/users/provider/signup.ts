import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'
import { QBCreateUserWithEmail } from 'quickblox'

import { MultipartFile, QBSession, QBUser, QCProvider } from '@/models'
import {
  qbLogin,
  qbCreateSession,
  qbCreateUser,
  qbUpdateUser,
  qbUploadFile,
  QBUserApi,
} from '@/services/quickblox'
import { createProviderKeywords } from '@/services/openai'
import { stringifyUserCustomData } from '@/services/quickblox/utils'

export const signUpSchema = {
  tags: ['Users'],
  summary: 'Create provider',
  consumes: ['multipart/form-data'],
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
      avatar: Type.Optional(MultipartFile),
    }),
  ]),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      user: Type.Ref(QBUser),
    }),
  },
}

const signup: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.post('', { schema: signUpSchema }, async (request, reply) => {
    const { profession, description, avatar, email, password } = request.body

    if (avatar && !/\.(jpe?g|a?png|gif|webp)$/i.test(avatar.filename)) {
      return reply.badRequest(
        `body/avatar Unsupported file format. The following file types are supported: jpg, jpeg, png, apng and webp.`,
      )
    }

    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'profession',
      'description',
      'language',
    )
    const session = await qbCreateSession(QBUserApi)
    let keywords = ''

    if (fastify.config.AI_SUGGEST_PROVIDER && description) {
      keywords += await createProviderKeywords(profession, description)
    }

    await qbCreateUser<QBCreateUserWithEmail>(QBUserApi, {
      ...userData,
      custom_data: stringifyUserCustomData({
        ...customData,
        keywords,
      }),
      tag_list: ['provider'],
    })
    let user = await qbLogin(QBUserApi, { email, password })

    if (avatar) {
      const file = await qbUploadFile(QBUserApi, avatar)

      user = await qbUpdateUser(QBUserApi, user.id, {
        custom_data: stringifyUserCustomData({
          ...customData,
          keywords,
          avatar: { id: file.id, uid: file.uid },
        }),
      })
    }

    return { session, user }
  })
}

export default signup
