import { useSelector } from 'react-redux'

import {
  recorderLoadingSelector,
  recorderProgressSelector,
} from '../../selectors'
import { createUseComponent } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  progress: recorderProgressSelector,
  uploading: recorderLoadingSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const progressValue = store.progress || 0

  return {
    store,
    data: { progressValue },
  }
})
