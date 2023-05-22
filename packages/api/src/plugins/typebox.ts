import fp from 'fastify-plugin'
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import { TypeSystem } from '@sinclair/typebox/system'
import { validateEmail } from '@/utils/validate'

TypeSystem.Format('email', validateEmail)

export default fp(
  async (fastify) => {
    fastify.setValidatorCompiler(TypeBoxValidatorCompiler)
  },
  { dependencies: ['swagger'] },
)
