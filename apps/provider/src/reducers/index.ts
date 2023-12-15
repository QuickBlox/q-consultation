import { combineReducers } from 'redux'
import storageLocal from 'redux-persist/lib/storage'
import persistReducer from 'redux-persist/lib/persistReducer'
import { encryptTransform } from 'redux-persist-transform-encrypt'

import appointment from './qb-appointment'
import auth from './auth'
import call from './qb-webrtc'
import chat from './qb-chat'
import content from './qb-content'
import dialogs from './qb-dialogs'
import messages from './qb-messages'
import modal from './modal'
import notification from './notification'
import qb from './qb'
import recorder from './recorder'
import rephrase from './rephrase'
import translate from './translate'
import avatar from './avatar'
import users from './qb-users'

const authPersistConfig = {
  key: 'auth',
  storage: storageLocal,
  whitelist: ['session', 'account'],
  transforms: [
    encryptTransform({
      secretKey: QB_SDK_CONFIG_AUTH_SECRET,
    }),
  ],
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, auth),
  appointment,
  call,
  chat,
  content,
  dialogs,
  messages,
  modal,
  notification,
  qb,
  recorder,
  rephrase,
  translate,
  users,
  avatar,
})

export type StoreState = ReturnType<typeof rootReducer>

export default rootReducer
