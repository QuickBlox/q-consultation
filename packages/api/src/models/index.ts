import { Type } from '@sinclair/typebox'

export * from './common'

export const MultipartFile = Type.Object(
  {
    buffer: Type.Any(),
    filename: Type.String(),
    encoding: Type.String(),
    mimetype: Type.String(),
  },
  { description: 'File' },
)
