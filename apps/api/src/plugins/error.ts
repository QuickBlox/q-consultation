import fp from 'fastify-plugin'
import { QBError } from '@qc/quickblox'
import axios, { AxiosError } from 'axios'
import { APIError as OpenAIError } from 'openai/error'
import { AIException } from 'qb-ai-core'

interface DefaultHttpError extends Error {
  status: number
  statusCode: number
  expose: boolean
}

interface QBServerError extends QBError {
  code?: number
  errors?: string[] | Dictionary<string | string[]>
}

function isError(
  error: unknown,
): error is Error | DefaultHttpError | QBServerError | AxiosError {
  return typeof error === 'object' && error !== null && 'message' in error
}

const parseErrorObject = (data: Dictionary<string | string[]>) =>
  Object.keys(data)
    .map((key) => {
      const field = data[key]

      return Array.isArray(field)
        ? `${key} ${field.join('')}`
        : `${key} ${field}`
    })
    .join(' ')
    .replace(/errors\s?/, '')

const parseErrorData = (
  data: string | string[] | Dictionary<string | string[]>,
) => {
  if (typeof data === 'string') {
    return data
  }

  if (Array.isArray(data)) {
    return data.join('')
  }

  if (typeof data === 'object') {
    return parseErrorObject(data)
  }

  return 'Unexpected error'
}

function stringifyError(error: unknown) {
  if (typeof error === 'string') return error

  if (error instanceof OpenAIError) {
    return `[OpenAI] ${error.message}`
  }

  if (error instanceof AIException) {
    return `[QuickBlox][AI] ${error.message}`
  }

  if (axios.isAxiosError(error)) {
    const errorData: QBServerError | string = error.response?.data

    if (
      typeof errorData === 'object' &&
      'errors' in errorData &&
      errorData.errors
    ) {
      return `[QuickBlox] ${parseErrorData(errorData.errors)}`
    }

    if (
      typeof errorData === 'object' &&
      'message' in errorData &&
      errorData.message
    ) {
      return `[QuickBlox] ${parseErrorData(errorData.message)}`
    }

    return error.response?.statusText
  }

  if (isError(error)) {
    if ('detail' in error && error.detail) {
      return `[QuickBlox] ${parseErrorData(error.detail)}`
    }

    if (typeof error.message !== 'string') {
      return `[QuickBlox] ${parseErrorData(error.message)}`
    }

    return error.message
  }

  return JSON.stringify(error)
}

function statusError(error: unknown): number {
  if (isError(error)) {
    if (error instanceof OpenAIError && error.status) {
      return error.status
    }

    if (error instanceof AIException) {
      return 400
    }

    if (
      axios.isAxiosError(error) &&
      error.response &&
      'status' in error.response &&
      error.response.status
    ) {
      return error.response.status
    }

    if ('statusCode' in error && !Number.isNaN(error.statusCode)) {
      return Number(error.statusCode)
    }

    if ('code' in error && !Number.isNaN(error.code)) {
      return Number(error.code)
    }
  }

  return 500
}

function parseError(error: unknown): [status: number, message?: string] {
  const status = statusError(error)
  const message = stringifyError(error)

  return [status, message]
}

export default fp(async (fastify) => {
  fastify.setErrorHandler((error) => {
    try {
      const [code, message] = parseError(error)

      return message
        ? fastify.httpErrors.createError(code, message)
        : fastify.httpErrors.createError(code)
    } catch (e) {
      return fastify.httpErrors.internalServerError()
    }
  })
})
