import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import { pick } from 'lodash'
import { QBCreateUserWithEmail } from 'quickblox'

import { MultipartFile, QBSession, QBUser, QCClient } from '@/models'
import { qbCreateSession } from '@/services/auth'
import { qbCreateUser, qbUpdateUser } from '@/services/users'
import { qbUploadFile } from '@/services/content'
import { stringifyUserCustomData } from '@/utils/user'

export const signUpSchema = {
  tags: ['users'],
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
  fastify.post('', { schema: signUpSchema }, async (request) => {
    const { avatar } = request.body
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
    let user = await qbCreateUser<QBCreateUserWithEmail>({
      ...userData,
      custom_data: stringifyUserCustomData(customData),
    })

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
          avatar: { id: file.id, uid: file.uid },
        }),
      })
    }

    return { session, user }
  })
}

export default signup
