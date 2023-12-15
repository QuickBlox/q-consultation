export function isNumber<T>(value: T): boolean {
  const number = Number(value)

  return !Number.isNaN(number) && String(value) === String(number)
}

function formatTimeItem(value?: string | number): string {
  return `${value || ''}00`.substr(0, 2)
}

export function validateTimeAndCursor(
  value = '',
  defaultValue = '',
  colon = ':',
  cursorPosition = 0,
): [string, number] {
  const [oldH, oldM] = defaultValue.split(colon)

  let newCursorPosition = Number(cursorPosition)
  let [newH, newM] = String(value).split(colon)

  newH = formatTimeItem(newH)

  if (Number(newH[0]) > 2) {
    newH = oldH
    newCursorPosition -= 1
  } else if (Number(newH[0]) === 2) {
    if (Number(oldH[0]) === 2 && Number(newH[1]) > 3) {
      newH = `2${oldH[1]}`
      newCursorPosition -= 2
    } else if (Number(newH[1]) > 3) {
      newH = '23'
    }
  }

  newM = formatTimeItem(newM)

  if (Number(newM[0]) > 5) {
    newM = oldM
    newCursorPosition -= 1
  }

  const validatedValue = `${newH}${colon}${newM}`

  return [validatedValue, newCursorPosition]
}
