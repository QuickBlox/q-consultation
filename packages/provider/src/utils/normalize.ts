export const normalize = <T>(array: T[], keyName: keyof T) => {
  const entries: Dictionary<T> = {}
  const list: string[] = []

  array.forEach((item) => {
    const key = item[keyName]

    if (typeof key === 'string' || typeof key === 'number') {
      const currentKey = key.toString()

      list.push(currentKey)
      entries[currentKey] = item
    }
  })

  return { entries, list }
}

export const denormalize = <T>(entries: Dictionary<T>, list?: string[]) => {
  if (list) {
    return list.map((key) => entries[key])
  }

  return Object.values(entries)
}
