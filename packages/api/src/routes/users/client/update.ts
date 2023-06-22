import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'

import { MultipartFile, QBUser, QBUserId, QCClient } from '@/models'
import { parseUserCustomData, stringifyUserCustomData } from '@/utils/user'
import {
  findUserById,
  qbUpdateUser,
  qbDeleteFile,
  qbUploadFile,
} from '@/services/quickblox'

const updateByIdSchema = {
  tags: ['Users', 'Client'],
  summary: 'Update client by id',
  consumes: ['multipart/form-data'],
  params: Type.Object({
    id: QBUserId,
  }),
  body: Type.Intersect([
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
    Type.Partial(
      Type.Object({
        password: Type.String(),
        avatar: Type.Union([MultipartFile, Type.Literal('none')]),
      }),
    ),
  ]),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ apiKey: [] }] as Security,
}

const updateMySchema = {
  tags: ['Users', 'Client'],
  summary: 'Update client profile',
  consumes: ['multipart/form-data'],
  body: Type.Union(
    [
      Type.Intersect(
        [
          Type.Omit(QCClient, [
            'id',
            'created_at',
            'updated_at',
            'last_request_at',
          ]),
          Type.Object({
            avatar: Type.Optional(
              Type.Union([MultipartFile, Type.Literal('none')]),
            ),
          }),
        ],
        { title: 'Without password' },
      ),
      Type.Intersect([
        Type.Omit(QCClient, [
          'id',
          'created_at',
          'updated_at',
          'last_request_at',
        ]),
        Type.Object({
          avatar: Type.Optional(
            Type.Union([MultipartFile, Type.Literal('none')]),
          ),
          password: Type.String(),
          old_password: Type.String(),
        }),
      ]),
    ],
    { title: 'With password' },
  ),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ clientSession: [] }] as Security,
}

const updateProvider: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    '',
    {
      schema: updateMySchema,
      onRequest: fastify.verify(fastify.ClientSessionToken),
    },
    async (request) => {
      const { avatar } = request.body
      const userData = pick(
        request.body,
        'full_name',
        'email',
        'password',
        'old_password',
      )
      const customData = pick(
        request.body,
        'full_name',
        'address',
        'birthdate',
        'gender',
        'language',
      )
      const prevUserData = await findUserById(request.session!.user_id)
      const prevUserCustomData = parseUserCustomData(prevUserData!.custom_data)
      let avatarData = prevUserCustomData.avatar

      if (avatar && avatarData?.id) {
        qbDeleteFile(avatarData.id)
      }

      if (avatar && avatar !== 'none') {
        const file = await qbUploadFile(avatar)

        avatarData = { id: file.id, uid: file.uid }
      } else if (avatar === 'none') {
        avatarData = undefined
      }

      const updatedUser = await qbUpdateUser(request.session!.user_id, {
        ...userData,
        custom_data: stringifyUserCustomData(
          avatarData ? { ...customData, avatar: avatarData } : customData,
        ),
      })

      return updatedUser
    },
  )
  fastify.put(
    '/:id',
    {
      schema: updateByIdSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request, reply) => {
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
      const prevUserData = await findUserById(request.session!.user_id)

      if (!prevUserData) {
        return reply.notFound()
      }

      const prevUserCustomData = parseUserCustomData(prevUserData.custom_data)
      let avatarData = prevUserCustomData.avatar

      if (avatar && avatarData?.id) {
        qbDeleteFile(avatarData.id)
      }

      if (avatar && avatar !== 'none') {
        const file = await qbUploadFile(avatar)

        avatarData = { id: file.id, uid: file.uid }
      } else if (avatar === 'none') {
        avatarData = undefined
      }

      const updatedUser = await qbUpdateUser(request.params.id, {
        ...userData,
        custom_data: stringifyUserCustomData(
          avatarData ? { ...customData, avatar: avatarData } : customData,
        ),
      })

      return updatedUser
    },
  )
}

export default updateProvider
