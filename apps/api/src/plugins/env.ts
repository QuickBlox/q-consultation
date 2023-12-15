import path from 'path'
import fp from 'fastify-plugin'
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env'
import { Static, Type } from '@sinclair/typebox'

const schema = Type.Object({
  QB_SDK_CONFIG_APP_ID: Type.Integer(),
  QB_SDK_CONFIG_AUTH_KEY: Type.String(),
  QB_SDK_CONFIG_AUTH_SECRET: Type.String(),
  QB_SDK_CONFIG_ACCOUNT_KEY: Type.String(),
  QB_SDK_CONFIG_DEBUG: Type.Boolean({ default: false }),
  QB_SDK_CONFIG_ENDPOINT_API: Type.Optional(Type.String()),
  QB_SDK_CONFIG_ENDPOINT_CHAT: Type.Optional(Type.String()),
  QB_SDK_CONFIG_ICE_SERVERS: Type.Optional(Type.String()),
  QB_ADMIN_EMAIL: Type.String(),
  QB_ADMIN_PASSWORD: Type.String(),
  BEARER_TOKEN: Type.String(),
  OPENAI_API_KEY: Type.String(),
  FILE_SIZE_LIMIT: Type.Integer(),
  AI_QUICK_ANSWER: Type.Boolean({ default: false }),
  AI_SUGGEST_PROVIDER: Type.Boolean({ default: false }),
  AI_RECORD_ANALYTICS: Type.Boolean({ default: false }),
  AI_REPHRASE: Type.Boolean({ default: false }),
  AI_TRANSLATE: Type.Boolean({ default: false }),
  ENABLE_GUEST_CLIENT: Type.Boolean({ default: false }),
})

const options = {
  dotenv: {
    path: path.resolve(__dirname, '../../../../.env'),
  },
  schema,
}

export default fp<FastifyEnvOptions>(
  async (fastify) => {
    fastify.register(fastifyEnv, options)
  },
  { name: 'env' },
)

declare module 'fastify' {
  interface FastifyInstance {
    config: Static<typeof schema>
  }
}
