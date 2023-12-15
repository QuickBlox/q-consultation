import type { Action } from 'redux'
import type { ActionType } from '@redux-saga/types'
import { all, call, fork, put, race, take, takeEvery } from 'redux-saga/effects'

export function takeEveryAll<P extends ActionType[]>(
  patterns: P,
  worker: (...args: any[]) => any,
) {
  return fork(function* saga() {
    while (true) {
      const actions: Action[] = yield all(
        patterns.map((pattern) => take(pattern)),
      )

      yield fork(worker, actions)
    }
  })
}

export function takeOrCancel<P extends ActionType>(
  takePattern: P,
  cancelPattern: P,
  worker: (...args: any[]) => any,
) {
  return fork(function* saga() {
    while (true) {
      const action: Action = yield take(takePattern)

      yield race([call(worker, action), take(cancelPattern)])
    }
  })
}

export function* takeEveryQueue<
  S extends ActionType | ActionType[],
  F extends ActionType | ActionType[],
>(
  limit: number,
  startPattern: S,
  finishPattern: F,
  worker: (...args: any[]) => any,
) {
  const queue: Action[] = []
  let activeCount = 0

  yield takeEvery(startPattern, function* startSaga(action: Action) {
    if (activeCount < limit) {
      activeCount += 1
      yield fork(worker, action)
    } else {
      queue.push(action)
    }
  })
  yield takeEvery(finishPattern, function* finishSaga() {
    activeCount -= 1
    const nextAction = queue.shift()

    if (nextAction) {
      yield put(nextAction)
    }
  })
}
