import { useNavigate } from 'react-router-dom'
import { ROOT_ROUTE } from '../constants/routes'

export default function useLocalGoBack() {
  const navigate = useNavigate()

  const localGoBack = () => {
    if (navigate.length > 2) {
      navigate(-1)
    } else {
      navigate(ROOT_ROUTE)
    }
  }

  return localGoBack
}
