import { createSelector } from 'reselect'
import { QBAppointment, QBRecord } from '@qc/quickblox'
import { StoreState } from '../reducers'
import { RecorderReducer } from '../reducers/recorder'

export const recorderSelector = (state: StoreState) => state.recorder

export const recorderRecordingSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.recording,
)

export const recorderEntriesSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.entries,
)

export const recorderDataSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.records,
)
export const recorderRecordsSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.records,
)

export const recorderLoadingSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.loading,
)

export const recorderProgressSelector = createSelector(
  recorderSelector,
  (recorder: RecorderReducer) => recorder.progress,
)

export const createRecordsByAppointmentIdSelector = (
  appointmentId?: QBAppointment['_id'],
) =>
  createSelector(
    [recorderEntriesSelector, recorderRecordsSelector],
    (entries, records): QBRecord[] =>
      (appointmentId &&
        records[appointmentId]?.map((recordId) => entries[recordId])) ||
      [],
  )

export const createRecordsByIdSelector = (recordId?: QBRecord['_id']) =>
  createSelector(recorderEntriesSelector, (entries) =>
    recordId ? entries[recordId] : undefined,
  )
