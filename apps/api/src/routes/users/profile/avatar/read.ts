import https from 'node:https'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import QB, { parseUserCustomData, promisifyCall } from '@qc/quickblox'

import { IncomingMessage } from 'node:http'

export const readUserAvatarSchema = {
  tags: ['Users'],
  summary: 'Get user avatar',
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const readUserAvatar: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.get(
    '',
    {
      schema: readUserAvatarSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const { user_id } = request.session!

      const user = await promisifyCall(QB.users.getById, user_id)

      // @ts-ignore
      if (user.blob_id) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const avatarInfo = await promisifyCall(QB.content.getInfo, user.blob_id)
        const avatarUrl = QB.content.privateUrl(avatarInfo.blob.uid)
        const avatarRes = await new Promise<IncomingMessage>((resolve) => {
          https.get(avatarUrl, resolve)
        })

        if (avatarRes.statusCode !== 200) {
          return fastify.httpErrors.createError(avatarRes.statusCode || 400)
        }

        return reply
          .header('content-type', avatarRes.headers['content-type'])
          .send(avatarRes)
      }

      const userCustomData = parseUserCustomData(user.custom_data)

      if (userCustomData.avatar?.id && userCustomData.avatar.uid) {
        const avatarUrl = QB.content.privateUrl(userCustomData.avatar.uid)
        const avatarRes = await new Promise<IncomingMessage>((resolve) => {
          https.get(avatarUrl, resolve)
        })

        if (avatarRes.statusCode !== 200) {
          return fastify.httpErrors.createError(avatarRes.statusCode || 400)
        }

        return reply
          .header('content-type', avatarRes.headers['content-type'])
          .send(avatarRes)
      }

      return reply.notFound()
    },
  )
}

export default readUserAvatar
