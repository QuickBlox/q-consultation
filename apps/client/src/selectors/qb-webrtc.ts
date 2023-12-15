import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { authMyAccountIdSelector } from './auth'
import { getCallOpponentId } from '../utils/user'

export const callSelector = (state: StoreState) => state.call

export const callDurationSelector = createSelector(
  callSelector,
  (call) => call.callDuration,
)

export const callSessionSelector = createSelector(
  callSelector,
  (call) => call.session,
)

export const callIsActiveSelector = createSelector(
  callSessionSelector,
  (session) => Boolean(session),
)

export const callMuteAudioSelector = createSelector(
  callSelector,
  (call) => call.muteAudio,
)

export const callMuteVideoSelector = createSelector(
  callSelector,
  (call) => call.muteVideo,
)

export const callScreenshareSelector = createSelector(
  callSelector,
  (call) => call.screenshare,
)

export const callVideoInputSourcesSelector = createSelector(
  callSelector,
  (call) => call.videoInputSources,
)

export const callAppointmentIdSelector = createSelector(
  callSelector,
  (call) => call.appointmentId,
)

export const callOpponentIdSelector = createSelector(
  [callSessionSelector, authMyAccountIdSelector],
  (session, myAccountId) => getCallOpponentId(myAccountId, session),
)
