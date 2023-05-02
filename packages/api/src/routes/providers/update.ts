import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'

import { MultipartFile, QBUser, QCProvider } from '@/models'
import { stringifyUserCustomData, parseUserCustomData } from '@/utils/user'
import { findUserById, qbUpdateUser } from '@/services/users'
import { getCompletion } from '@/services/openai'
import { qbDeleteFile, qbUploadFile } from '@/services/content'

const updateByIdSchema = {
  tags: ['users', 'providers'],
  consumes: ['multipart/form-data'],
  params: Type.Object({
    id: Type.String({ pattern: '^[0-9]+$' }),
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
        password: Type.String(),
        avatar: Type.Union([MultipartFile, Type.Literal('none')]),
      }),
    ),
  ]),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [
    {
      apiKey: [],
    },
  ],
}

const updateMySchema = {
  tags: ['users', 'providers'],
  consumes: ['multipart/form-data'],
  body: Type.Union([
    Type.Intersect([
      Type.Omit(QCProvider, [
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
    ]),
    Type.Intersect([
      Type.Omit(QCProvider, [
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
  ]),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [
    {
      apiKey: [],
    },
  ],
}

const updateById: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    '',
    {
      schema: updateMySchema,
      onRequest: fastify.verify(fastify.ProviderSessionToken),
    },
    async (request) => {
      const { description, avatar, full_name } = request.body
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
        'description',
        'language',
      )
      const prevUserData = await findUserById(request.session!.user_id)
      const prevUserCustomData = parseUserCustomData(prevUserData.custom_data)
      let avatarData = prevUserCustomData.avatar

      if (avatar && avatarData?.id) {
        qbDeleteFile(avatarData.id)
      }

      if (avatar && avatar !== 'none') {
        const file = await qbUploadFile(
          avatar.filename,
          avatar.buffer,
          avatar.mimetype,
          Buffer.byteLength(avatar.buffer),
        )

        avatarData = { id: file.id, uid: file.uid }
      } else if (avatar === 'none') {
        avatarData = undefined
      }

      let keywords = `${full_name}, `

      if (fastify.config.AI_SUGGEST_PROVIDER && description) {
        keywords += await getCompletion(
          `Write in English keywords describing a specialist for this description separated by commas:\n${description.replaceAll(
            '\n',
            ' ',
          )}\n\n`,
        )
      }

      const updatedUser = await qbUpdateUser(request.session!.user_id, {
        ...userData,
        custom_data: stringifyUserCustomData(
          avatarData
            ? { ...customData, keywords, avatar: avatarData }
            : { ...customData, keywords },
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
    async (request) => {
      const { description, avatar, full_name } = request.body
      const userData = pick(request.body, 'full_name', 'email', 'password')
      const customData = pick(
        request.body,
        'full_name',
        'description',
        'language',
      )
      const prevUserData = await findUserById(request.session!.user_id)
      const prevUserCustomData = parseUserCustomData(prevUserData.custom_data)
      let avatarData = prevUserCustomData.avatar

      if (avatar && avatarData?.id) {
        qbDeleteFile(avatarData.id)
      }

      if (avatar && avatar !== 'none') {
        const file = await qbUploadFile(
          avatar.filename,
          avatar.buffer,
          avatar.mimetype,
          Buffer.byteLength(avatar.buffer),
        )

        avatarData = { id: file.id, uid: file.uid }
      } else if (avatar === 'none') {
        avatarData = undefined
      }

      let keywords = `${full_name}, `

      if (fastify.config.AI_SUGGEST_PROVIDER && description) {
        keywords += await getCompletion(
          `Write in English keywords describing a specialist for this description separated by commas:\n${description.replaceAll(
            '\n',
            ' ',
          )}\n\n`,
        )
      }

      const updatedUser = await qbUpdateUser(parseInt(request.params.id, 10), {
        ...userData,
        custom_data: stringifyUserCustomData(
          avatarData
            ? { ...customData, keywords, avatar: avatarData }
            : { ...customData, keywords },
        ),
      })

      return updatedUser
    },
  )
}

export default updateById
