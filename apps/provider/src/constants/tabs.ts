export const QUEUE_TYPE = 'queue'

export const ABOUT_TAB = 'about'
export const CHAT_TAB = 'chat'
export const CALL_TAB = 'call'
export const HISTORY_TAB = 'history'

export type AppointmentTypes = typeof QUEUE_TYPE

export type ChatTabs =
  | typeof ABOUT_TAB
  | typeof CHAT_TAB
  | typeof CALL_TAB
  | typeof HISTORY_TAB

export type AppointmentDetailsTabs = typeof ABOUT_TAB | typeof CHAT_TAB
