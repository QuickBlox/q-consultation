import { AnyAction } from 'redux'
import { EventChannel, eventChannel, Task } from 'redux-saga'
import {
  actionChannel,
  all,
  call,
  cancel,
  cps,
  delay,
  fork,
  put,
  select,
  take,
  takeEvery,
  race,
} from 'redux-saga/effects'

import * as Types from '../actions'
import {
  chatDisconnected,
  getDialog,
  chatConnected,
  messageDelivered,
  messageRead,
  receivedChatMessage,
  receivedSystemMessage,
  showNotification,
  userIsTyping,
  chatPing,
  getAppointments,
  logout as logoutRequest,
} from '../actionCreators'
import {
  authSessionSelector,
  authMyAccountIdSelector,
  authLoadingSelector,
} from '../selectors'
import { isSessionExpired } from '../utils/session'
import { stringifyError } from '../utils/parse'
import {
  APPOINTMENT_NOTIFICATION,
  DIALOG_NOTIFICATION,
  CLOSE_SESSION_NOTIFICATION,
  TEXT_NOTIFICATION,
} from '../constants/notificationTypes'
import { QBChatConnect } from '../qb-api-calls'

function isSystemMessage(action: {
  type: string
}): action is Types.QBChatIncomingSystemMessageAction {
  return action && action.type === Types.QB_CHAT_SYSTEM_MESSAGE
}

type ChannelActions =
  | Types.QBChatDisconnectedAction
  | Types.QBChatConnectedAction
  | Types.QBChatIncomingMessageAction
  | Types.QBChatIncomingSystemMessageAction
  | Types.QBChatMessageDeliveredAction
  | Types.QBChatMessageReadAction
  | Types.QBChatUserTypingAction

function createQBChatEventChannel(myAccountId: QBUser['id']) {
  return eventChannel<ChannelActions>((emitter) => {
    const disconnectedHandler = () => emitter(chatDisconnected())

    window.addEventListener('offline', disconnectedHandler)
    QB.chat.onDisconnectedListener = disconnectedHandler
    QB.chat.onReconnectListener = () => emitter(chatConnected())
    QB.chat.onMessageListener = (userId, message) =>
      emitter(
        receivedChatMessage({
          userId,
          message,
          isMine: myAccountId === userId,
        }),
      )
    QB.chat.onSystemMessageListener = (message) =>
      emitter(receivedSystemMessage({ message }))
    QB.chat.onDeliveredStatusListener = (messageId, dialogId, userId) =>
      emitter(messageDelivered({ messageId, dialogId, userId }))
    QB.chat.onReadStatusListener = (messageId, dialogId, userId) =>
      emitter(messageRead({ messageId, dialogId, userId }))
    QB.chat.onMessageTypingListener = (isTyping, userId, dialogId) =>
      emitter(userIsTyping({ isTyping, userId, dialogId }))

    return () => {
      window.removeEventListener('offline', disconnectedHandler)
    }
  })
}

function* handleQBChatEvents() {
  const myAccountId: ReturnType<typeof authMyAccountIdSelector> = yield select(
    authMyAccountIdSelector,
  )
  const channel: EventChannel<ChannelActions> = yield call(
    createQBChatEventChannel,
    myAccountId,
  )

  while (true) {
    try {
      const event: ChannelActions = yield take(channel)

      yield put(event)

      if (isSystemMessage(event)) {
        const {
          message: { extension },
        } = event.payload

        if (extension.notification_type) {
          if (extension.notification_type === CLOSE_SESSION_NOTIFICATION) {
            yield put(
              showNotification({
                id: Date.now().toString(),
                translate: true,
                message: 'SESSION_FINISHED',
                type: 'error',
                duration: 3 * SECOND,
                position: 'top-center',
              }),
            )

            yield delay(3000)

            yield put(logoutRequest())
          }

          if (
            extension.notification_type === APPOINTMENT_NOTIFICATION &&
            extension.appointment_id
          ) {
            yield put(
              getAppointments({ _id: extension.appointment_id, limit: 1 }),
            )
          }

          if (
            extension.notification_type === TEXT_NOTIFICATION &&
            extension.notification_text
          ) {
            yield put(
              showNotification({
                id: Date.now().toString(),
                translate: extension.translate === 'true',
                translateOptions: extension.translate_options
                  ? JSON.parse(extension.translate_options)
                  : undefined,
                message: extension.notification_text,
                position: 'top-center',
                type: 'cancel',
              }),
            )
          }

          if (
            extension.notification_type === DIALOG_NOTIFICATION &&
            typeof extension.dialog_id === 'string'
          ) {
            yield put(
              getDialog({
                _id: extension.dialog_id,
              }),
            )
          }
        }
      }
    } catch (e) {
      const errorMessage = stringifyError(e)

      yield put({ type: 'QB_CHAT_CHANNEL_ERROR', error: errorMessage })
    }
  }
}

function* pingChat() {
  try {
    const { failure }: { failure: boolean } = yield race({
      success: cps([QB.chat, QB.chat.ping]),
      // Setting a limit on waiting for a response from the server
      failure: delay(5000),
    })

    // If there is no response from the server at the specified time, then the connection to the chat is called again
    if (failure) {
      const myAccountId: ReturnType<typeof authMyAccountIdSelector> =
        yield select(authMyAccountIdSelector)
      const session: ReturnType<typeof authSessionSelector> = yield select(
        authSessionSelector,
      )

      yield call(QBChatConnect, {
        jid: QB.chat.helpers.getUserJid(myAccountId),
        password: session?.token || '',
      })
    }

    yield put(chatConnected())
  } catch (e) {
    yield put(chatDisconnected())
  }
}

function* keepAliveChatConnection() {
  while (true) {
    yield delay(MINUTE)

    if (!document.hidden) {
      yield put(chatPing())
    }
  }
}

function* disconnectWorker() {
  const actionsChanel: EventChannel<AnyAction> = yield actionChannel([
    ...Types.API_SUCCESS_ACTIONS,
    ...Types.CHAT_RECEIVED_ACTIONS,
  ])
  const eventsChannel = eventChannel((emitter) => {
    const onlineHandler = () => {
      emitter('online')
    }

    window.addEventListener('online', onlineHandler)

    return () => {
      window.removeEventListener('online', onlineHandler)
    }
  })

  while (true) {
    yield race([take(actionsChanel), take(eventsChannel)])

    if (!document.hidden) {
      yield put(chatPing())
    }
  }
}

function* chatDisconnectFlow() {
  while (true) {
    yield take(Types.QB_CHAT_DISCONNECTED)
    const task: Task = yield fork(disconnectWorker)

    yield take(Types.QB_CHAT_CONNECTED)
    yield cancel(task)
  }
}

function* chatFlow() {
  while (true) {
    yield take(Types.QB_LOGIN_SUCCESS)
    const tasks: Task[] = yield all([
      fork(handleQBChatEvents),
      fork(keepAliveChatConnection),
      fork(chatDisconnectFlow),
    ])

    yield take(Types.LOGOUT_SUCCESS)
    yield cancel(tasks)
  }
}

function* disconnectedChat() {
  const isLoading: ReturnType<typeof authLoadingSelector> = yield select(
    authLoadingSelector,
  )
  const session: ReturnType<typeof authSessionSelector> = yield select(
    authSessionSelector,
  )

  if (!isLoading && session && isSessionExpired(session.updated_at)) {
    yield put(logoutRequest())
  }
}

export default [
  chatFlow(),
  takeEvery(Types.QB_CHAT_PING, pingChat),
  takeEvery(Types.QB_CHAT_DISCONNECTED, disconnectedChat),
]
