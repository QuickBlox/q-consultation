import { QBError, QBUser } from 'quickblox'
import { QBCallback, QBUserCustomData } from './types'

export function isQBError(error: unknown): error is QBError {
  return typeof error === 'object' && error !== null && 'message' in error
}

export const userHasTag = (user: QBUser, tag: string) => {
  return user.user_tags?.includes(tag)
}

export const parseUserCustomData = (
  customDataText?: string | null,
): QBUserCustomData => {
  try {
    const customData: QBUserCustomData = customDataText
      ? JSON.parse(customDataText)
      : {}

    return customData
  } catch (error) {
    return {}
  }
}

export const stringifyUserCustomData = (
  customDataText?: QBUserCustomData | null,
): string | undefined => {
  try {
    const customData: string | undefined = customDataText
      ? JSON.stringify(customDataText)
      : undefined

    return customData
  } catch (error) {
    return undefined
  }
}

interface PromisifyCall {
  <R>(fn: (cb: QBCallback<R>) => void): Promise<R>
  <T1, R>(fn: (arg1: T1, cb: QBCallback<R>) => void, arg1: T1): Promise<R>
  <T1, T2, R>(
    fn: (arg1: T1, arg2: T2, cb: QBCallback<R>) => void,
    arg1: T1,
    arg2: T2,
  ): Promise<R>
  <T1, T2, T3, R>(
    fn: (arg1: T1, arg2: T2, arg3: T3, cb: QBCallback<R>) => void,
    arg1: T1,
    arg2: T2,
    arg3: T3,
  ): Promise<R>
  <T1, T2, T3, T4, R>(
    fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, cb: QBCallback<R>) => void,
    arg1: T1,
    arg2: T2,
    arg3: T3,
    arg4: T4,
  ): Promise<R>
}

export const promisifyCall: PromisifyCall = (
  fn: (...args: any[]) => void, //F | [context: QBExtended, fn: F],
  ...args: any[]
) => {

  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    fn(...args, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}
