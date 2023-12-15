import { QBChatDialog, QBUser, QBCustomObject, QBError } from 'quickblox'

export interface QBAppointment extends Omit<QBCustomObject, '_parent_id'> {
  _parent_id: null
  priority: number
  client_id: QBUser['id']
  provider_id: QBUser['id']
  dialog_id: QBChatDialog['_id']
  description: string
  notes: string | null
  conclusion: string | null
  date_end: string | null
  language: string | null
}

export interface QBRecord extends Omit<QBCustomObject, '_parent_id'> {
  _parent_id: QBCustomObject['_id']
  uid?: string
  name?: string
  summary?: string
  transcription?: string[]
  actions?: string
  appointment_id: QBAppointment['_id']
}

export type QBUserCustomData = Partial<{
  full_name: string
  address: string
  birthdate: string
  description: string
  profession: string
  keywords: string
  gender: string
  language: string
  avatar: {
    id: number
    uid: string
  }
}>

export interface QBCallback<T> {
  (error: null | undefined, result: T): void
  (error: QBError, result: null | undefined): void
}
