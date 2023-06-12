import { encode } from 'gpt-3-encoder'

export const tokenCounter = (text?: string) => (text ? encode(text).length : 0)

export const loopToLimitTokens = <T>(
  limit: number,
  data: T[],
  getValue: (item: T) => string = (item) =>
    typeof item === 'string' ? item : String(item),
  tokens = 0,
): T[] => {
  if (!data.length) {
    return []
  }

  const [firstItem, ...lastItems] = data

  const itemValue = getValue(firstItem)
  const itemTokens = tokenCounter(itemValue)
  const amountTokens = tokens + itemTokens

  if (amountTokens <= limit) {
    const nextData = loopToLimitTokens(limit, lastItems, getValue, amountTokens)

    return itemTokens === 0 ? nextData : [firstItem, ...nextData]
  }

  return []
}
