import { ActionCreatorsMapObject, AnyAction, bindActionCreators } from 'redux'
import { useDispatch } from 'react-redux'
import { useMemo } from 'react'

export default function useActions<
  A extends AnyAction,
  M extends ActionCreatorsMapObject<A>,
>(actionCreatorDictionary: M, deps?: unknown[]) {
  const dispatch = useDispatch()

  return useMemo(
    () => bindActionCreators(actionCreatorDictionary, dispatch),
    deps ? [dispatch, ...deps] : [dispatch],
  )
}
