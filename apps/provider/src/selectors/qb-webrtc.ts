import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { CallReducer } from '../reducers/qb-webrtc'
import { authMyAccountIdSelector } from './auth'

export const callSelector = (state: StoreState) => state.call

export const callDurationSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.callDuration,
)

export const callSessionSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.session,
)

export const callRemoteStreamSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.remoteStream,
)

export const callIsActiveSelector = createSelector(
  callSessionSelector,
  (session) => Boolean(session),
)

export const callMuteAudioSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.muteAudio,
)

export const callMuteVideoSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.muteVideo,
)

export const callScreenshareSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.screenshare,
)

export const callVideoInputSourcesSelector = createSelector(
  callSelector,
  (call: CallReducer) => call.videoInputSources,
)

export const callAppointmentIdSelector = createSelector(
  callSelector,
  (call) => call.appointmentId,
)

export const callOpponentIdSelector = createSelector(
  [callSessionSelector, authMyAccountIdSelector],
  (session, myAccountId) => {
    const participantsIds = session
      ? [...session.opponentsIDs, session.initiatorID]
      : []

    return participantsIds.find((id) => id !== myAccountId)
  },
)
