import { call, put, select, takeEvery } from 'redux-saga/effects'

import * as Types from '../actions'
import { getTranslateSuccess, getTranslateFailure } from '../actionCreators'
import { stringifyError } from '../utils/parse'
import { authSessionSelector } from '../selectors'
import { ajax } from './ajax'

function* translate(action: Types.GetTranslateRequestAction) {
  const { dialogId, messageId, language, then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/ai/dialog/${dialogId}/messages/${messageId}/translate`

    const {
      response,
    }: {
      response: {
        translate: string
      }
    } = yield call(ajax, {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session!.token}`,
      },
      body: JSON.stringify({
        language,
      }),
      responseType: 'json',
    })
    const result = getTranslateSuccess({
      dialogId,
      messageId,
      translatedMessage: response.translate,
    })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)
    const result = getTranslateFailure(messageId, errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

export default [takeEvery(Types.GET_TRANSLATE_REQUEST, translate)]
