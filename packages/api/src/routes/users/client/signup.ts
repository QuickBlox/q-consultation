import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'
import { QBCreateUserWithEmail } from 'quickblox'

import { MultipartFile, QBSession, QBUser, QCClient } from '@/models'
import {
  qbLogin,
  qbCreateSession,
  qbCreateUser,
  qbUpdateUser,
  qbUploadFile,
} from '@/services/quickblox'
import { stringifyUserCustomData } from '@/utils/user'

export const signUpSchema = {
  tags: ['Users', 'Client'],
  summary: 'Signup client',
  consumes: ['multipart/form-data'],
  body: Type.Intersect([
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
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
  fastify.post('', { schema: signUpSchema }, async (request, reply) => {
    const { avatar, email, password } = request.body

    if (avatar && !/\.(jpe?g|a?png|gif|webp)$/.test(avatar.filename)) {
      return reply.badRequest(
        `body/avatar Unsupported file format. The following file types are supported: jpg, jpeg, png, apng and webp.`,
      )
    }

    const userData = pick(request.body, 'full_name', 'email', 'password')
    const customData = pick(
      request.body,
      'full_name',
      'address',
      'birthdate',
      'gender',
      'language',
    )

    const session = await qbCreateSession()

    await qbCreateUser<QBCreateUserWithEmail>({
      ...userData,
      custom_data: stringifyUserCustomData(customData),
    })
    let user = await qbLogin(email, password)

    if (avatar) {
      const file = await qbUploadFile(avatar)

      user = await qbUpdateUser(user.id, {
        custom_data: stringifyUserCustomData({
          ...customData,
          avatar: { id: file.id, uid: file.uid },
        }),
      })
    }

    return { session, user }
  })
}

export default signup
