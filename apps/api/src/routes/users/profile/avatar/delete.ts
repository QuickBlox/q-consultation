import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, {
  parseUserCustomData,
  promisifyCall,
  stringifyUserCustomData,
} from '@qc/quickblox'
import omit from 'lodash/omit'

export const deleteUserAvatarSchema = {
  tags: ['Users'],
  summary: 'Delete user avatar',
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

const deleteUserAvatar: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.delete(
    '',
    {
      schema: deleteUserAvatarSchema,
      onRequest: fastify.verify(fastify.SessionToken),
    },
    async (request, reply) => {
      const { user_id } = request.session!
      const user = await promisifyCall(QB.users.getById, user_id)

      // @ts-ignore
      if (user.blob_id) {
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        promisifyCall(QB.content.delete, user.blob_id).catch(() => null)
      }

      const userCustomData = parseUserCustomData(user.custom_data)

      if (userCustomData.avatar?.id) {
        promisifyCall(QB.content.delete, userCustomData.avatar.id).catch(
          () => null,
        )
      }

      await promisifyCall(QB.users.update, user_id, {
        custom_data: stringifyUserCustomData(omit(userCustomData, 'avatar')),
      })

      reply.code(204)

      return null
    },
  )
}

export default deleteUserAvatar
