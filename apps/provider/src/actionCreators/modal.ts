import * as Types from '../actions'

export function toggleShowModal(
  payload: Types.ToggleShowModalAction['payload'],
): Types.ToggleShowModalAction {
  return { type: Types.TOGGLE_SHOW_MODAL, payload }
}
