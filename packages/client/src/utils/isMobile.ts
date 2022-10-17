/* eslint-disable @typescript-eslint/ban-ts-comment */

export const isMobile = () => {
  let hasTouchScreen = false

  if ('maxTouchPoints' in window.navigator) {
    hasTouchScreen = window.navigator.maxTouchPoints > 0
  } else if ('msMaxTouchPoints' in window.navigator) {
    // @ts-ignore
    hasTouchScreen = window.navigator.msMaxTouchPoints > 0
  } else {
    const mQ = window.matchMedia('(pointer:coarse)')

    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = mQ.matches
    } else if ('orientation' in window) {
      hasTouchScreen = true // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      // @ts-ignore
      const UA = window.navigator.userAgent

      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
    }
  }

  return hasTouchScreen
}

export default isMobile()
