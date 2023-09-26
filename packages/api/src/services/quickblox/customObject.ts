import { QBCustomObject } from 'quickblox'
import { QBApi } from './api'

export const qbCreateCustomObject = <T extends QBCustomObject>(
  QB: QBApi,
  className: string,
  data: Dictionary<unknown>,
) =>
  new Promise<T>((resolve, reject) => {
    QB.data.create<T>(className, data, (error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })

export const qbUpdateCustomObject = <T extends QBCustomObject>(
  QB: QBApi,
  _id: QBCustomObject['_id'],
  className: string,
  data: Dictionary<unknown>,
) =>
  new Promise<T>((resolve, reject) => {
    QB.data.update<{ _id: string } & Dictionary<unknown>, T>(
      className,
      { _id, ...data },
      (error, result) => {
        if (result) {
          resolve(result)
        } else {
          reject(error)
        }
      },
    )
  })

export const qbGetCustomObject = <T extends QBCustomObject>(
  QB: QBApi,
  className: string,
  filters: Dictionary<unknown>,
) =>
  new Promise<{
    class_name: string
    items: T[]
    limit: number
    skip: number
  }>((resolve, reject) => {
    QB.data.list<T>(className, filters, (error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
  })

export const qbCreateChildCustomObject = async <T extends QBCustomObject>(
  QB: QBApi,
  parentClassName: string,
  parentId: QBCustomObject['_id'],
  childClassName: string,
  data: Dictionary<unknown>,
) => {
  const resData = await QB.axios.post<T>(
    `/data/${parentClassName}/${parentId}/${childClassName}`,
    data,
  )

  return resData.data
}

export const qbUpdateCustomObjectByCriteria = async <T extends QBCustomObject>(
  QB: QBApi,
  className: string,
  filters: Dictionary<unknown>,
  data: Dictionary<unknown>,
) => {
  const resData = await QB.axios.post<T>(`/data/${className}/by_criteria`, {
    ...data,
    search_criteria: filters,
  })

  return resData.data
}

export const qbDeleteCustomObjectByCriteria = async (
  QB: QBApi,
  className: string,
  data: Dictionary<unknown>,
) => {
  const resData = await QB.axios.delete<{ total_deleted: number }>(
    `/data/${className}/by_criteria`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data,
    },
  )

  return resData.data
}
