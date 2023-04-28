// import { isValidPhoneNumber } from 'react-phone-number-input'

export const validateEmail = (email: string) =>
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(
    email,
  );

export const validateFullName = (fullName: string) =>
  /(?!.*([ _.'’-])\1)^(?:[\p{L}\p{N}]{1}[\p{L}\p{N} _.'’-]{2,59})$/u.test(
    fullName.trimEnd(),
  );

// export const validatePhoneNumber = (phone: string) => {
//   const isCommonPhoneValid = isValidPhoneNumber(phone)

//   return phone.startsWith('+380')
//     ? isCommonPhoneValid && phone.length === 13
//     : isCommonPhoneValid
// }
