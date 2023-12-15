import { all } from 'redux-saga/effects'

import authSagas from './auth'
import qbSagas from './qb'
import qbAppointmentSagas from './qb-appointment'
import qbChatSagas from './qb-chat'
import qbContentSagas from './qb-content'
import qbDialogsSagas from './qb-dialogs'
import qbMessagesSagas from './qb-messages'
import qbUsersSagas from './qb-users'
import recorderSagas from './recorder'
import rephraseSagas from './rephrase'
import translateSagas from './translate'
import avatarSagas from './avatar'
import webrtcSagas from './qb-webrtc'

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...qbSagas,
    ...qbAppointmentSagas,
    ...qbChatSagas,
    ...qbContentSagas,
    ...qbDialogsSagas,
    ...qbMessagesSagas,
    ...qbUsersSagas,
    ...webrtcSagas,
    ...recorderSagas,
    ...rephraseSagas,
    ...translateSagas,
    ...avatarSagas,
  ])
}
