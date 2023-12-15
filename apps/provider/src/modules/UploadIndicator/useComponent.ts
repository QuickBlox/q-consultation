import { useSelector } from 'react-redux'

import { uploadFileCancel } from '../../actionCreators'
import {
  contentLoadingSelector,
  contentProgressSelector,
  contentTypeSelector,
} from '../../selectors'
import { createUseComponent, useActions } from '../../hooks'
import { createMapStateSelector } from '../../utils/selectors'

const selector = createMapStateSelector({
  currentType: contentTypeSelector,
  progress: contentProgressSelector,
  uploading: contentLoadingSelector,
})

export default createUseComponent(() => {
  const store = useSelector(selector)
  const actions = useActions({
    uploadFileCancel,
  })

  return {
    store,
    actions,
  }
})
