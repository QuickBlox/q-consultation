import { Selector, createStructuredSelector } from 'reselect'
import { StoreState } from '../reducers'

export const createMapStateSelector = <S>(selectors: {
  [K in keyof S]: Selector<StoreState, S[K]>
}) => createStructuredSelector(selectors)

export const combineSelectors =
  <S, C>(
    selectors: { [K in keyof S]: Selector<StoreState, S[K]> },
    combiner: (res: S) => { [K in keyof C]: Selector<StoreState, C[K]> },
  ) =>
  (state: StoreState) => {
    const mainSelector = createStructuredSelector(selectors)
    const mainData = mainSelector(state)

    const otherSelectorList = combiner(mainData)
    const otherSelector = createStructuredSelector(otherSelectorList)
    const otherData = otherSelector(state)

    return {
      ...mainData,
      ...otherData,
    }
  }
