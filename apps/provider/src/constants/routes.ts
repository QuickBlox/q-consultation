export const ROOT_ROUTE = '/'
export const LOGIN_ROUTE = '/login'
export const PROFILE_ROUTE = '/profile'
export const APPOINTMENTS_ROUTE = `/queue/:appointmentId?/:tab?`
export const HISTORY_ROUTE = '/history'
export const APPOINTMENT_CLIENT_ROUTE = `${CLIENT_APP_URL}/appointment`

export type Routes =
  | typeof ROOT_ROUTE
  | typeof LOGIN_ROUTE
  | typeof PROFILE_ROUTE
  | typeof APPOINTMENTS_ROUTE
  | typeof HISTORY_ROUTE
