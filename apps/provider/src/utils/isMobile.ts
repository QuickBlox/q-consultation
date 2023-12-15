export const isMobile = () => {
  if (typeof window.orientation === 'number') {
    return true // deprecated, but good fallback
  }

  // Only as a last resort, fall back to user agent sniffing
  const { userAgent } = window.navigator

  const isMobileOS =
    /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(userAgent) ||
    /\b(Android|Windows Phone|iPad|iPod)\b/i.test(userAgent)

  return isMobileOS
}

export default isMobile()
