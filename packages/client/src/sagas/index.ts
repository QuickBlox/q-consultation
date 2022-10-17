import { all } from 'redux-saga/effects'

import authSagas from './auth'
import qbAppointmentSagas from './qb-appointment'
import qbChatSagas from './qb-chat'
import qbContentSagas from './qb-content'
import qbDialogsSagas from './qb-dialogs'
import qbMessagesSagas from './qb-messages'
import qbSagas from './qb'
import qbUsersSagas from './qb-users'
import webrtcSagas from './qb-webrtc'

export default function* rootSaga() {
  yield all([
    ...authSagas,
    ...qbAppointmentSagas,
    ...qbChatSagas,
    ...qbContentSagas,
    ...qbDialogsSagas,
    ...qbMessagesSagas,
    ...qbSagas,
    ...qbUsersSagas,
    ...webrtcSagas,
  ])
}
