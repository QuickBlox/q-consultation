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

export const userIsProvider = (user: QBUser) =>
  user?.user_tags?.toLowerCase()?.includes(PROVIDER_TAG) || false
