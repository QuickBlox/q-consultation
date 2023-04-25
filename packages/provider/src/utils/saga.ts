import type { ActionType } from '@redux-saga/types'
import type { Action } from 'redux'
import { all, fork, take } from 'redux-saga/effects'

export function takeEveryAll<P extends ActionType[]>(
  patterns: P,
  worker: (...args: any[]) => any,
) {
  return fork(function* () {
    while (true) {
      const actions: Action[] = yield all(
        patterns.map((pattern) => take(pattern)),
      )

      yield fork(worker, actions)
    }
  })
}
