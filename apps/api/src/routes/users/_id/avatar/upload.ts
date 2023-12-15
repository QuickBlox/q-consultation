import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@sinclair/typebox'
import QB, {
  parseUserCustomData,
  promisifyCall,
  stringifyUserCustomData,
} from '@qc/quickblox'
import omit from 'lodash/omit'

import { MultipartFile, QBUserId } from '@/models'

export const uploadUserAvatarSchema = {
  tags: ['Users'],
  summary: 'Upload user avatar',
  description:
    'Delete a user by ID. The user can only be deleted using the apiKey',
  consumes: ['multipart/form-data'],
  params: Type.Object({
    id: QBUserId,
  }),
  body: Type.Object({
    file: MultipartFile,
  }),
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ apiKey: [] }] as Security,
}

const uploadUserAvatar: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.put(
    '',
    {
      schema: uploadUserAvatarSchema,
      onRequest: fastify.verify(fastify.BearerToken),
    },
    async (request, reply) => {
      const { id } = request.params
      const { file } = request.body

      if (!/\.(jpe?g|a?png|gif|webp)$/i.test(file.filename)) {
        return reply.badRequest(
          `body/avatar Unsupported file format. The following file types are supported: jpg, jpeg, png, apng and webp.`,
        )
      }

      const user = await promisifyCall(QB.users.getById, id)

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

      const avatar = await promisifyCall(QB.content.createAndUpload, {
        name: file.filename,
        type: file.mimetype,
        file: file.buffer,
        size: Buffer.byteLength(file.buffer as Buffer),
        public: false,
      })

      await promisifyCall(QB.users.update, id, {
        // @ts-ignore
        blob_id: avatar.id,
        custom_data: stringifyUserCustomData(omit(userCustomData, 'avatar')),
      })

      reply.code(204)

      return null
    },
  )
}

export default uploadUserAvatar
