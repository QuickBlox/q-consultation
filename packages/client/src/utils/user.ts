import { memoize } from 'lodash'

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

export const parseUser = (user: QBUser): QBUserWithCustomData => {
  const customData = parseUserCustomData(user.custom_data)

  return {
    ...user,
    custom_data: customData,
  }
}

export const parseUserMemo = memoize(parseUser)

export const userIsProvider = (user: QBUser) =>
  user?.user_tags?.toLowerCase()?.includes(PROVIDER_TAG) || false

export const getCallOpponentId = (
  myAccountId: number,
  session?: QBWebRTCSession,
) => {
  const participantsIds = session
    ? [...session.opponentsIDs, session.initiatorID]
    : []

  return participantsIds.find((id) => id !== myAccountId)
}

export const isGuestClient = (user: QBUserWithCustomData) =>
  user?.user_tags?.toLowerCase()?.includes('guest') || false
