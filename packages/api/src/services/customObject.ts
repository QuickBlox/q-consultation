import fetch from 'node-fetch'
import QB, { QBCustomObject } from 'quickblox'

export const qbCreateCustomObject = <T extends QBCustomObject>(
  className: string,
  data: Dictionary<unknown>,
) =>
  new Promise<T>((resolve, reject) => {
    QB.data.create<T>(className, data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbUpdateCustomObject = <T extends QBCustomObject>(
  _id: QBCustomObject['_id'],
  className: string,
  data: Dictionary<unknown>,
) =>
  new Promise<T>((resolve, reject) => {
    QB.data.update<{ _id: string } & Dictionary<unknown>, T>(
      className,
      { _id, ...data },
      (error, item) => {
        if (error) {
          reject(error)
        } else {
          resolve(item)
        }
      },
    )
  })

export const qbGetCustomObject = <T extends QBCustomObject>(
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
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })

export const qbCreateChildCustomObject = async <T extends QBCustomObject>(
  parentClassName: string,
  parentId: QBCustomObject['_id'],
  childClassName: string,
  data: Dictionary<unknown>,
) => {
  const { config, session } = QB.service.qbInst
  const resData: T = await fetch(
    `https://${config.endpoints.api}/data/${parentClassName}/${parentId}/${childClassName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'QB-Token': session?.token || '',
      },
      body: JSON.stringify(data),
    },
  ).then((res) => res.json())

  return resData
}
