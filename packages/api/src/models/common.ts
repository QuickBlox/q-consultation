import { Type } from '@sinclair/typebox'

export const DateISO = Type.String({
  format: 'date-time',
  description:
    'Date in the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format according to universal time. Format: `YYYY-MM-DDTHH:mm:ss.sssZ`.',
})

export const Error = Type.Object(
  {
    statusCode: Type.Integer({ title: 'HTTP response status code' }),
    error: Type.String({ title: 'HTTP response error' }),
    message: Type.String({ title: 'Error message' }),
  },
  { $id: 'Error', title: 'Error response' },
)

export const MultipartFile = Type.Object(
  {
    buffer: Type.Any(),
    filename: Type.String(),
    encoding: Type.String(),
    mimetype: Type.String(),
  },
  {
    title: 'File',
    description:
      'This value represents a file submitted using a form with encoding set to `multipart/form-data`.',
  },
)
