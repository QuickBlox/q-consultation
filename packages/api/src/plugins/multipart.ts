/* eslint-disable no-param-reassign */
import fp from 'fastify-plugin'
import multipart, { FastifyMultipartOptions } from '@fastify/multipart'

export default fp<FastifyMultipartOptions>(async (fastify) => {
  fastify.addHook('preValidation', async (request) => {
    request.body = request.body || {}
  })

  fastify.register(multipart, {
    limits: {
      fileSize: fastify.config.FILE_SIZE_LIMIT,
    },
    attachFieldsToBody: 'keyValues',
    onFile: async (file) => {
      const { filename, encoding, mimetype } = file
      const buffer = await file.toBuffer()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      file.value = {
        buffer,
        filename,
        encoding,
        mimetype,
      }
    },
  })
})
