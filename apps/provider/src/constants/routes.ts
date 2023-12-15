export const ROOT_ROUTE = '/'
export const LOGIN_ROUTE = '/login'
export const PROFILE_ROUTE = '/profile'
export const SELECTED_APPOINTMENT_ROUTE = `/:appointmentType/:appointmentId/:tab`
export const APPOINTMENT_TYPE_ROUTE = `/:appointmentType`
export const HISTORY_ROUTE = '/history'

export const PROVIDERS_CLIENT_ROUTE = `${CLIENT_APP_URL}/providers/:providerId`
export const APPOINTMENT_CLIENT_ROUTE = `${CLIENT_APP_URL}/appointment`

export type Routes =
  | typeof ROOT_ROUTE
  | typeof LOGIN_ROUTE
  | typeof PROFILE_ROUTE
  | typeof APPOINTMENT_TYPE_ROUTE
  | typeof HISTORY_ROUTE
