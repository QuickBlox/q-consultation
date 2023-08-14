import { BlobObject, QBContentObject } from 'quickblox'
import FormData from 'form-data'
import omit from 'lodash/omit'
import { QBApi } from './api'

const qbCreateFile = (
  QB: QBApi,
  name: string,
  content_type: string,
  isPublic?: boolean,
) =>
  new Promise<BlobObject>((resolve, reject) => {
    QB.content.create(
      { name, content_type, public: isPublic || false },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      },
    )
  })

const qbMarkUploaded = (QB: QBApi, id: number, size: number) =>
  new Promise((resolve, reject) => {
    QB.content.markUploaded({ id, size }, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbUploadFile = async (
  QB: QBApi,
  file: File,
  isPublic?: boolean,
): Promise<QBContentObject> => {
  const blob = await qbCreateFile(QB, file.filename, file.mimetype, isPublic)
  const fileSize = Buffer.byteLength(file.buffer)
  const url = new URL(blob.blob_object_access.params)
  const form = new FormData()

  url.searchParams.forEach((value, key) => {
    form.append(key, value)
  })
  form.append('file', file.buffer, file.filename)

  await QB.axios.post(`${url.origin}${url.pathname}`, form)
  await qbMarkUploaded(QB, blob.id, fileSize)

  const fileData = omit(blob, [
    'blob_object_access',
    'blob_status',
    'set_completed_at',
  ])

  return fileData
}

export function qbDeleteFile(QB: QBApi, contentId: QBContentObject['id']) {
  return new Promise((resolve, reject) => {
    QB.content.delete(contentId, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  })
}
