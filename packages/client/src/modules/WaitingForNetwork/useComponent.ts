import { createUseComponent } from '../../hooks'
import useIsOffLine from '../../hooks/useIsOffLine'

export default createUseComponent(() => {
  const isOffLine = useIsOffLine()

  return {
    data: {
      isOffLine,
    },
  }
})
