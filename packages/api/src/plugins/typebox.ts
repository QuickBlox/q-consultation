import fp from 'fastify-plugin';
// import { TypeCompiler } from '@sinclair/typebox/compiler';
// import { TSchema } from '@sinclair/typebox';
import { TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox';
import { TypeSystem } from '@sinclair/typebox/system';
import { validateEmail } from '@/utils/validate';

TypeSystem.Format('email', validateEmail);

export default fp(
  async (fastify) => {
    fastify.setValidatorCompiler(TypeBoxValidatorCompiler);

    // fastify.setValidatorCompiler<TSchema>(({ schema }) => {
    //   const typeCheck = TypeCompiler.Compile(schema);

    //   console.log('typeCheck', typeCheck);

    //   return (value) => {
    //     if (typeCheck.Check(value)) return {};
    //     const errors = [...typeCheck.Errors(value)];

    //     console.log('errors', errors);

    //     return {
    //       error: errors.map((error) => ({
    //         message: error.message,
    //         path: error.path.slice(1).split('/'),
    //         property: error.schema,
    //       })), // as FastifySchemaValidationError[]
    //     };
    //   };
    // });
    // // @ts-ignore
    // fastify.setSchemaErrorFormatter((err, a) => ({ ...err, a } as Error))
  },
  { dependencies: ['swagger'] },
);
