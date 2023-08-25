import { matchPath, useLocation } from 'react-router-dom'

import { PUBLIC_ROUTES } from '../constants/routes'

export default function usePrivateReferrer() {
  const { pathname, state, search } = useLocation<{ referrer?: string }>()
  const query = new URLSearchParams(search)

  query.delete('token')

  const currentSearch = query.toString()
  const isPublicRoute = PUBLIC_ROUTES.some((path) =>
    matchPath(pathname, { path }),
  )

  if (state?.referrer && isPublicRoute) {
    return state?.referrer
  }

  return pathname && currentSearch ? `${pathname}?${currentSearch}` : pathname
}
