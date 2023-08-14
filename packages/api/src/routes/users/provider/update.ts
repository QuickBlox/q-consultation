import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import pick from 'lodash/pick'

import { MultipartFile, QBUser, QBUserId, QCProvider } from '@/models'
import {
  stringifyUserCustomData,
  parseUserCustomData,
} from '@/services/quickblox/utils'
import {
  qbUpdateUser,
  qbDeleteFile,
  qbUploadFile,
  getUserById,
  QBUserApi,
} from '@/services/quickblox'
import { createProviderKeywords } from '@/services/openai'

const updateByIdSchema = {
  tags: ['Users', 'Provider'],
  summary: 'Update provider by id',
  consumes: ['multipart/form-data'],
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
  tags: ['Users', 'Provider'],
  summary: 'Update provider profile',
  consumes: ['multipart/form-data'],
  body: Type.Union(
    [
      Type.Intersect(
        [
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
        ],
        { title: 'Without password' },
      ),
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
    ],
    { title: 'With password' },
  ),
  response: {
    200: Type.Ref(QBUser),
  },
  security: [{ providerSession: [] }] as Security,
}

const updateProvider: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    '',
    {
      schema: updateMySchema,
      onRequest: fastify.verify(fastify.ProviderSessionToken),
    },
    async (request, reply) => {
      const { profession, description, avatar } = request.body

      if (
        avatar &&
        avatar !== 'none' &&
        !/\.(jpe?g|a?png|gif|webp)$/.test(avatar.filename)
      ) {
        return reply.badRequest(
          `body/avatar Unsupported file format. The following file types are supported: jpg, jpeg, png, apng and webp.`,
        )
      }

      const userData = pick(
        request.body,
        'full_name',
        'email',
        'password',
        'old_password',
      )
      const customData = pick(
        request.body,
        'profession',
        'description',
        'language',
      )
      const prevUserData = await getUserById(
        QBUserApi,
        request.session!.user_id,
      )
      const prevUserCustomData = parseUserCustomData(prevUserData!.custom_data)
      let avatarData = prevUserCustomData.avatar

      if (avatar && avatarData?.id) {
        qbDeleteFile(QBUserApi, avatarData.id)
      }

      if (avatar && avatar !== 'none') {
        const file = await qbUploadFile(QBUserApi, avatar)

        avatarData = { id: file.id, uid: file.uid }
      } else if (avatar === 'none') {
        avatarData = undefined
      }

      let keywords = ''

      if (fastify.config.AI_SUGGEST_PROVIDER && description) {
        keywords += await createProviderKeywords(profession, description)
      }

      const updatedUser = await qbUpdateUser(
        QBUserApi,
        request.session!.user_id,
        {
          ...userData,
          custom_data: stringifyUserCustomData(
            avatarData
              ? { ...customData, keywords, avatar: avatarData }
              : { ...customData, keywords },
          ),
        },
      )

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
      const { id } = request.params
      const { profession, description, avatar } = request.body

      if (
        avatar &&
        avatar !== 'none' &&
        !/\.(jpe?g|a?png|gif|webp)$/.test(avatar.filename)
      ) {
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
      const prevUserData = await getUserById(QBUserApi, id)

      if (!prevUserData) {
        return reply.notFound()
      }

      const prevUserCustomData = parseUserCustomData(prevUserData.custom_data)
      let avatarData = prevUserCustomData.avatar

      if (avatar && avatarData?.id) {
        qbDeleteFile(QBUserApi, avatarData.id)
      }

      if (avatar && avatar !== 'none') {
        const file = await qbUploadFile(QBUserApi, avatar)

        avatarData = { id: file.id, uid: file.uid }
      } else if (avatar === 'none') {
        avatarData = undefined
      }

      let keywords = ''

      if (fastify.config.AI_SUGGEST_PROVIDER && description) {
        keywords += await createProviderKeywords(profession, description)
      }

      const updatedUser = await qbUpdateUser(QBUserApi, request.params.id, {
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

export default updateProvider
