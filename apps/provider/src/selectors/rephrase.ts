import { createSelector } from 'reselect'
import { StoreState } from '../reducers'
import { Rephrase } from '../reducers/rephrase'

export const rephraseSelector = (state: StoreState) => state.rephrase

export const rephraseErrorSelector = createSelector(
  rephraseSelector,
  (rephrase: Rephrase) => rephrase.error,
)

export const rephraseLoadingSelector = createSelector(
  rephraseSelector,
  (rephrase: Rephrase) => rephrase.loading,
)

export const rephraseDialogIdSelector = createSelector(
  rephraseSelector,
  (rephrase: Rephrase) => rephrase.dialogId,
)

export const rephraseOriginalTextSelector = createSelector(
  rephraseSelector,
  (rephrase: Rephrase) => rephrase.originalText,
)

export const rephraseRephrasedTextSelector = createSelector(
  rephraseSelector,
  (rephrase: Rephrase) => rephrase.rephrasedText,
)
