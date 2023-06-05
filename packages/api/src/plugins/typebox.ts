import fp from 'fastify-plugin'
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import { TypeSystem } from '@sinclair/typebox/system'
import { validateDateISO, validateEmail } from '@/utils/validate'

TypeSystem.Format('email', validateEmail)
TypeSystem.Format('date-time', validateDateISO)

export default fp(
  async (fastify) => {
    fastify.setValidatorCompiler(TypeBoxValidatorCompiler)
  },
  { dependencies: ['swagger'] },
)
