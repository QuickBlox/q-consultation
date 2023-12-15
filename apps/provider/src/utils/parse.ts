import { QBError } from '@qc/quickblox'

export const jsonParse = <P>(text: string): P | string => {
  try {
    return JSON.parse<P>(text)
  } catch (error) {
    return text
  }
}

export function isQBError(error: unknown): error is QBError {
  return typeof error === 'object' && error !== null && 'message' in error
}

export const filterHasIdList = (
  filter: unknown,
): filter is { _id: { in: Array<string> } } => {
  return (filter as { _id: { in: Array<string> } })?._id?.in !== undefined
}

export const parseErrorObject = (data: Dictionary<string | string[]>) =>
  Object.keys(data)
    .map((key) => {
      const field = data[key]

      return Array.isArray(field)
        ? `${key} ${field.join('')}`
        : `${key} ${field}`
    })
    .join(' ')
    .replace(/errors\s?/, '')

export const parseErrorData = (
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

export function stringifyError(error: unknown) {
  if (typeof error === 'string') return error

  if (isQBError(error)) {
    if (error.detail) {
      return parseErrorData(error.detail)
    }

    if (error.message) {
      return parseErrorData(error.message)
    }
  }

  return JSON.stringify(error)
}
