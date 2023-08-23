import fp from 'fastify-plugin'
import swagger, { SwaggerOptions } from '@fastify/swagger'
import swaggerUI, { FastifySwaggerUiOptions } from '@fastify/swagger-ui'
import { Type } from '@sinclair/typebox'

import * as models from '@/models'
import description from './description'

const swaggerOptions: SwaggerOptions = {
  openapi: {
    info: {
      version: process.env.npm_package_version || '',
      title: process.env.npm_package_name || '',
      description,
      license: {
        name: 'MIT',
        url: 'https://github.com/QuickBlox/q-consultation/blob/master/LICENSE',
      },
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'http',
          scheme: 'bearer',
          description:
            'API Token. `BEARER_TOKEN` set in app config. Used for API integration.',
        },
        providerSession: {
          type: 'http',
          scheme: 'bearer',
          description: 'Provider session token.',
        },
        clientSession: {
          type: 'http',
          scheme: 'bearer',
          description: 'Client session token.',
        },
      },
    },
    tags: [],
  },
  refResolver: {
    buildLocalReference: (json, baseUri, fragment, i) => {
      return typeof json.$id === 'string' ? json.$id : `def-${i}`
    },
  },
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  transform: ({ url, schema }) => {
    return {
      url,
      schema: {
        ...schema,
        response: {
          '4xx': Type.Ref(models.Error, {
            description: 'Client error responses',
          }),
          '5xx': Type.Ref(models.Error, {
            description: 'Server error responses',
          }),
          ...(schema?.response || {}),
        },
      },
    }
  },
}

const swaggerUIOptions: FastifySwaggerUiOptions = {
  routePrefix: '/swagger',
}

export default fp(
  async (fastify) => {
    Object.values(models).forEach((schema) => {
      if (schema.$id) {
        fastify.addSchema(schema)
      }
    })

    await fastify.register(swagger, swaggerOptions)
    await fastify.register(swaggerUI, swaggerUIOptions)
  },
  { name: 'swagger' },
)
