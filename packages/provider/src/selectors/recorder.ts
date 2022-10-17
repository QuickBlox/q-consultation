import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { RecorderReducer } from '../reducers/recorder'

export const recorderSelector = (state: StoreState) => state.recorder

export const recorderRecordingSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.recording,
)

export const recorderDataSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.records,
)
