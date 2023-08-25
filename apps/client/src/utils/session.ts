const TOKEN_LIFETIME = 2 // hours

export function getExpiresDate(date: string | Date) {
  const expiresDate = new Date(date)

  expiresDate.setHours(expiresDate.getHours() + TOKEN_LIFETIME)

  return expiresDate.getTime()
}

export function isSessionExpired(date: string) {
  const now = Date.now()
  const expiresDate = getExpiresDate(date)

  return now - expiresDate > -10
}
