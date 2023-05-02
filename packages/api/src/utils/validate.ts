export const validateEmail = (email: string) =>
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(
    email,
  )

export const validateFullName = (fullName: string) =>
  /(?!.*([ _.'’-])\1)^(?:[\p{L}\p{N}]{1}[\p{L}\p{N} _.'’-]{2,59})$/u.test(
    fullName.trimEnd(),
  )
