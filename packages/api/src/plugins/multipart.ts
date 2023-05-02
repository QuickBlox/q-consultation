/* eslint-disable no-param-reassign */
import fp from 'fastify-plugin'
import multipart, { FastifyMultipartOptions } from '@fastify/multipart'

export default fp<FastifyMultipartOptions>(async (fastify) => {
  fastify.register(multipart, {
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
