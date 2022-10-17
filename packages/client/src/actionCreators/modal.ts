import * as Types from '../actions'

export function toggleShowModal(
  payload: Types.ToggleShowModalAction['payload'],
): Types.ToggleShowModalAction {
  return { type: Types.TOGGLE_SHOW_MODAL, payload }
}

export function toggleCallModal(
  payload?: Types.ToggleCallModalAction['payload'],
): Types.ToggleCallModalAction {
  return { type: Types.TOGGLE_CALL_MODAL, payload }
}
