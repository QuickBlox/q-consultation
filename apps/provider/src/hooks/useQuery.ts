import { useLocation } from 'react-router-dom'

export default function useQuery() {
  const location = useLocation()
  const search = new URLSearchParams(location.search)
  const query: Dictionary<string> = {}

  search.forEach((value, key) => {
    query[key] = value
  })

  return query
}
