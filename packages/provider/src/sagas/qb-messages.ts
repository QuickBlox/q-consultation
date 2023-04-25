import {
  call,
  put,
  SagaReturnType,
  select,
  take,
  takeEvery,
} from 'redux-saga/effects'

import * as Types from '../actions'
import {
  getMessagesFailure,
  getMessagesSuccess,
  getQuickAnswerFailure,
  getQuickAnswerSuccess,
  sendMessageFailure,
  sendMessageSuccess,
  sendSystemMessageFailure,
  sendSystemMessageSuccess,
} from '../actionCreators'
import {
  QBChatGetMessages,
  QBChatMarkMessageRead,
  QBChatSendMessage,
  QBChatSendSystemMessage,
} from '../qb-api-calls'
import { normalize } from '../utils/normalize'
import { authMyAccountIdSelector, authSessionSelector, chatConnectedSelector } from '../selectors'
import { stringifyError } from '../utils/parse'
import { ajax } from './ajax'

function* getChatMessages(action: Types.QBGetMessageRequestAction) {
  const { dialogId, skip, limit } = action.payload

  try {
    const res: Types.GetMessagesResponse = yield call(
      QBChatGetMessages,
      dialogId,
      skip,
      limit,
    )

    if (
      res.dialogId &&
      typeof res.items !== 'string' &&
      Array.isArray(res.items)
    ) {
      const { entries } = normalize(res.items.reverse(), '_id')

      yield put(
        getMessagesSuccess({
          dialogId,
          entries,
          skip: res.skip,
          limit: res.limit,
        }),
      )
    } else {
      throw new Error('Failed get messages')
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(getMessagesFailure(errorMessage))
  }
}

function* sendMessage(action: Types.QBSendMessageRequestAction) {
  const { dialogId, message, then } = action.payload

  try {
    const connected: ReturnType<typeof chatConnectedSelector> = yield select(
      chatConnectedSelector,
    )

    if (!connected) {
      yield take(Types.QB_CHAT_CONNECTED)
    }
    const userId: ReturnType<typeof authMyAccountIdSelector> = yield select(
      authMyAccountIdSelector,
    )
    const messageId: SagaReturnType<typeof QBChatSendMessage> = yield call(
      QBChatSendMessage,
      dialogId,
      message,
    )
    const dateString = new Date().toISOString()
    const result = sendMessageSuccess({
      _id: messageId,
      attachments: message.extension.attachments || [],
      chat_dialog_id: message.extension.dialog_id,
      created_at: dateString,
      date_sent: Date.now() / 1000,
      delivered_ids: [userId],
      message: message.body,
      read_ids: [userId],
      read: 0,
      recipient_id: null,
      sender_id: userId,
      updated_at: dateString,
    })

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(sendMessageFailure(errorMessage))
  }
}

function* sendSystemMessage(action: Types.QBSendSystemMessageRequestAction) {
  const { dialogId, message, then } = action.payload

  try {
    const connected: ReturnType<typeof chatConnectedSelector> = yield select(
      chatConnectedSelector,
    )

    if (!connected) {
      yield take(Types.QB_CHAT_CONNECTED)
    }
    const messageId: SagaReturnType<typeof QBChatSendSystemMessage> =
      yield call(QBChatSendSystemMessage, dialogId, message)
    const result = sendSystemMessageSuccess(messageId)

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    yield put(sendSystemMessageFailure(errorMessage))
  }
}

function* sendReadStatus(action: Types.QBMarkMessageReadAction) {
  yield call(QBChatMarkMessageRead, action.payload)
}

function* getQuickAnswer(
  action: Types.QBGetQuickAnswerRequestAction,
) {
  const { question, then } = action.payload

  try {
    const session: ReturnType<typeof authSessionSelector> = yield select(
      authSessionSelector,
    )
    const url = `${SERVER_APP_URL}/ai/quick-answer`

    const {
      response,
    }: {
      response: { answer: string }
      // @ts-ignore
    } = yield call(ajax, {
      method: 'POST',
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session?.token && `Bearer ${session.token}`,
      },
      body: JSON.stringify({ question }),
      responseType: 'json',
    })

    const result = getQuickAnswerSuccess(response)

    yield put(result)

    if (then) {
      then(result)
    }
  } catch (e) {
    const errorMessage = stringifyError(e)

    const result = getQuickAnswerFailure(errorMessage)

    yield put(result)

    if (then) {
      then(result)
    }
  }
}

export default [
  takeEvery(Types.QB_CHAT_GET_MESSAGE_REQUEST, getChatMessages),
  takeEvery(Types.QB_CHAT_SEND_MESSAGE_REQUEST, sendMessage),
  takeEvery(Types.QB_CHAT_SEND_SYSTEM_MESSAGE_REQUEST, sendSystemMessage),
  takeEvery(Types.QB_CHAT_MARK_MESSAGE_READ, sendReadStatus),
  takeEvery(Types.QB_GET_QUICK_ANSWER_REQUEST, getQuickAnswer),
]
