import { QBUser, QBUserCustomData } from 'quickblox'

export const userHasTag = (user: QBUser, tag: string) => {
  return user.user_tags?.includes(tag)
}

export const parseUserCustomData = (
  customDataText: string | null,
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
