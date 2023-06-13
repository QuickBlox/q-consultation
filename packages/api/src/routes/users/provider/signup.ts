import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'
import { QBCreateUserWithEmail } from 'quickblox'

import { MultipartFile, QBSession, QBUser, QCProvider } from '@/models'
import { qbCreateSession, qbLogin } from '@/services/auth'
import { qbCreateUser, qbUpdateUser } from '@/services/users'
import { getCompletion } from '@/services/openai'
import { qbUploadFile } from '@/services/content'
import { stringifyUserCustomData } from '@/utils/user'

export const signUpSchema = {
  tags: ['Users', 'Provider'],
  summary: 'Signup provider',
  consumes: ['multipart/form-data'],
  body: Type.Intersect([
    Type.Omit(QCProvider, [
      'id',
      'created_at',
      'updated_at',
      'last_request_at',
    ]),
    Type.Object({
      password: Type.String(),
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
  fastify.post('', { schema: signUpSchema }, async (request) => {
    const { description, avatar, email, password } = request.body
    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'full_name',
      'description',
      'language',
    )
    const session = await qbCreateSession()
    let keywords = ''

    if (fastify.config.AI_SUGGEST_PROVIDER && description) {
      keywords += await getCompletion(
        `Write in English keywords describing a specialist for this description separated by commas:\n${description.replaceAll(
          '\n',
          ' ',
        )}\n\n`,
      )
    }

    await qbCreateUser<QBCreateUserWithEmail>({
      ...userData,
      custom_data: stringifyUserCustomData({
        ...customData,
        keywords,
      }),
      tag_list: ['provider'],
    })
    let user = await qbLogin(email, password)

    if (avatar) {
      const file = await qbUploadFile(
        avatar.filename,
        avatar.buffer,
        avatar.mimetype,
        Buffer.byteLength(avatar.buffer),
      )

      user = await qbUpdateUser(user.id, {
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
