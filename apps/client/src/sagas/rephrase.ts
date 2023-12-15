import { call, put, select, takeEvery } from 'redux-saga/effects'

import * as Types from '../actions'
import { rephraseSuccess, rephraseFailure } from '../actionCreators'
import { stringifyError } from '../utils/parse'
import { authSessionSelector } from '../selectors'
import { ajax } from './ajax'

function* rephrase(action: Types.RephraseRequestAction) {
  const { dialogId, text, tone, then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/ai/dialog/${dialogId}/rephrase`

    const {
      response,
    }: {
      response: {
        rephrasedText: string
      }
    } = yield call(ajax, {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session!.token}`,
      },
      body: JSON.stringify({
        tone,
        text,
      }),
      responseType: 'json',
    })
    const result = rephraseSuccess(response)

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const result = rephraseFailure(errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

export default [takeEvery(Types.REPHRASE_REQUEST, rephrase)]
