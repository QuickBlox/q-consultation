import { useHistory } from 'react-router-dom'
import { ROOT_ROUTE } from '../constants/routes'

export default function useLocalGoBack() {
  const history = useHistory()

  const localGoBack = () => {
    if (history.length > 2) {
      history.goBack()
    } else {
      history.push(ROOT_ROUTE)
    }
  }

  return localGoBack
}
