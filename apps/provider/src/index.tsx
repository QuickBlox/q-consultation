import ReactDOM from 'react-dom'
import { compose } from 'redux'

import 'react-day-picker/lib/style.css'
import './variables.css'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

declare global {
  interface Window {
    QB: QB
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: (params: unknown) => typeof compose
  }
  interface Document {
    webkitFullscreenEnabled: boolean
    mozFullScreenEnabled: boolean
    msFullscreenEnabled: boolean
    webkitFullscreenElement: Element | null
    mozFullScreenElement: Element | null
    msFullscreenElement: Element | null
    webkitExitFullscreen?: () => Promise<void>
    mozExitFullScreen?: () => Promise<void>
    msExitFullscreen?: () => Promise<void>
  }

  interface HTMLDivElement {
    webkitRequestFullscreen?: () => Promise<void>
    mozRequestFullScreen?: () => Promise<void>
    msRequestFullscreen?: () => Promise<void>
  }

  interface MediaDevices extends EventTarget {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>
  }

  interface ScrollEvent extends Omit<Event, 'target'> {
    readonly target: Element | null
  }

  interface HTMLElementEventMap {
    scroll: ScrollEvent
  }

  interface JSON {
    parse<T>(text: string): T
  }

  export const __DEV__: boolean

  export const QB_SDK_CONFIG_APP_ID: number
  export const QB_SDK_CONFIG_AUTH_KEY: string
  export const QB_SDK_CONFIG_AUTH_SECRET: string
  export const QB_SDK_CONFIG_ACCOUNT_KEY: string
  export const QB_SDK_CONFIG_DEBUG: boolean
  export const QB_SDK_CONFIG_ENDPOINT_API: string | undefined
  export const QB_SDK_CONFIG_ENDPOINT_CHAT: string | undefined
  export const QB_SDK_CONFIG_ICE_SERVERS: Array<RTCIceServer>

  export const AI_QUICK_ANSWER: boolean
  export const AI_RECORD_ANALYTICS: boolean

  export const ENABLE_REDUX_LOGGER: boolean
  export const CLIENT_APP_URL: string
  export const SERVER_APP_URL: string
  export const PROVIDER_TAG: string
  export const DEFAULT_LANGUAGE: string
  export const FILE_SIZE_LIMIT: number
  export const FILE_EXTENSIONS_WHITELIST: string
  export const ENABLE_GUEST_CLIENT: boolean

  export const SECOND = 1000
  export const MINUTE = 60000
  export const HOUR = 3600000
}

ReactDOM.render(<App />, document.getElementById('app-root'))

if (!__DEV__) {
  serviceWorker.unregister()
}
