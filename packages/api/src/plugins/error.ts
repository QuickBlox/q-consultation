import fp from 'fastify-plugin';
import { QBError } from 'quickblox';
import { HttpErrorCodes } from '@fastify/sensible/lib/httpError';

interface DefaultHttpError extends Error {
  status: number;
  statusCode: HttpErrorCodes;
  expose: boolean;
}

interface QBServerError extends Omit<QBError, 'code'> {
  code?: HttpErrorCodes;
}

function isError(
  error: unknown,
): error is Error | DefaultHttpError | QBServerError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

const parseErrorObject = (data: Dictionary<string | string[]>) =>
  Object.keys(data)
    .map((key) => {
      const field = data[key];

      return Array.isArray(field)
        ? `${key} ${field.join('')}`
        : `${key} ${field}`;
    })
    .join(' ')
    .replace(/errors\s?/, '');

const parseErrorData = (
  data: string | string[] | Dictionary<string | string[]>,
) => {
  if (typeof data === 'string') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.join('');
  }

  if (typeof data === 'object') {
    return parseErrorObject(data);
  }

  return 'Unexpected error';
};

function stringifyError(error: unknown) {
  if (typeof error === 'string') return error;

  if (isError(error)) {
    if ('detail' in error && error.detail) {
      return parseErrorData(error.detail);
    }

    if (error.message) {
      return parseErrorData(error.message);
    }
  }

  return JSON.stringify(error);
}

function parseError(error: unknown): [HttpErrorCodes, string] {
  let statusCode: HttpErrorCodes = 500;

  if (isError(error) && 'statusCode' in error && error.statusCode) {
    statusCode = error.statusCode;
  } else if (isError(error) && 'code' in error && error.code) {
    statusCode = error.code;
  }

  return [statusCode, stringifyError(error)];
}

export default fp(async (fastify) => {
  fastify.setErrorHandler((error, request, reply) => {
    try {
      const [code, message] = parseError(error);

      reply.getHttpError(code, message);
    } catch (e) {
      reply.internalServerError();
    }
  });
});
