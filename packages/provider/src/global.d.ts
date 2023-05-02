/// <reference types="templates" />

declare module '*.svg' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  export default ReactComponent
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.mp3' {
  const content: string
  export default content
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] }

type Dictionary<T> = Record<string, T>

type DictionaryByKey<T, V> = {
  [K in keyof T]?: V
}

type Primitive = string | number | boolean | undefined | null | Date | File

type SetTails<T, R extends Primitive> = T extends Array<unknown>
  ? Array<T[number] extends Primitive ? R : SetTails<T[number], R>>
  : {
      [K in keyof T]: T[K] extends Primitive ? R : SetTails<T[K], R>
    }

interface DateRange {
  from: Date
  to: Date
}

interface OptionType<T> {
  value: T
  label: string
}

interface QBConfig {
  debug: boolean
  endpoints: {
    chat?: string
    api?: string
  }
  webrtc: {
    iceServers?: RTCIceServer[]
  }
}

interface QBError {
  code?: number
  status?: string
  detail?: string | string[] | Dictionary<string | string[]>
  message: string | string[] | Dictionary<string | string[]>
}

interface QBUser {
  id: number
  full_name: string
  email: string
  login: string
  phone: string
  website: string
  /** Date ISO string */
  created_at: string
  /** Date ISO string */
  updated_at: string
  /** Date ISO string */
  last_request_at: string
  external_user_id: null
  facebook_id: string | null
  blob_id: null
  custom_data: string | null
  age_over16: boolean
  allow_statistics_analysis: boolean
  allow_sales_activities: boolean
  parents_contacts: string
  user_tags: string | null
  password?: string
  old_password?: string
}

type QBUserCustomData = Partial<{
  full_name: string
  address: string
  birthdate: string
  description: string
  gender: string
  language: string
  avatar: {
    id: number
    uid: string
  }
}>

interface QBUserWithCustomData extends Omit<QBUser, 'custom_data'> {
  custom_data: QBUserCustomData
}

interface QBSession {
  _id: string
  application_id: number
  /** Date ISO string */
  created_at: string
  id: number
  nonce: number
  token: string
  ts: number
  /** Date ISO string */
  updated_at: string
  user_id: QBUser['id']
}

type ChatConnectParams =
  | {
      userId: number
      /** user's password or session token */
      password: string
    }
  | {
      jid: string
      /** user's password or session token */
      password: string
    }
  | {
      email: string
      /** user's password or session token */
      password: string
    }

interface ChatMessageAttachment {
  /** ID of the file on QuickBlox server (UID of file from QB.content.createAndUpload) */
  id: string | number
  uid?: string
  /** Type of attachment. Example: audio, video, image or other */
  type: string
  /** Link to a file in Internet */
  url?: string
  name?: string
  size?: number
  [key: string]: unknown
}

enum QBChatDialogType {
  PUBLIC = 1,
  GROUP = 2,
  PRIVATE = 3,
}

interface QBChatDialog {
  _id: string
  /** Date ISO string */
  created_at: string
  data?: { [key: string]: string }
  last_message: string | null
  /** Date ISO string */
  last_message_date_sent: string | null
  last_message_id: string | null
  last_message_user_id: QBUser['id'] | null
  name: string
  occupants_ids: number[]
  photo: null
  type: typeof QBChatDialogType
  /** Date ISO string */
  updated_at: string
  user_id: QBUser['id']
  xmpp_room_jid: string | null
  unread_messages_count: number | null
  joined?: boolean
}

interface QBChatMessage {
  _id: string
  attachments: ChatMessageAttachment[]
  chat_dialog_id: QBChatDialog['_id']
  /** Date ISO string */
  created_at: string
  /** Date timestamp */
  date_sent: number
  delivered_ids?: Array<QBUser['id']>
  message: string
  read_ids?: Array<QBUser['id']>
  read: 0 | 1
  recipient_id: QBUser['id'] | null
  sender_id: QBUser['id']
  /** Date ISO string */
  updated_at: string
}

interface QBMessageStatusParams {
  messageId: QBChatMessage['_id']
  dialogId: QBChatDialog['_id']
  userId: QBUser['id']
}

interface QBChatNewMessage {
  type: 'chat' | 'groupchat'
  body: string
  extension: {
    attachments?: ChatMessageAttachment[]
    save_to_history: 0 | 1
    dialog_id: QBChatDialog['_id']
  }
  markable: 0 | 1
}

interface QBChatXMPPMessage {
  id: string
  dialog_id: QBChatDialog['_id']
  recipient_id: null
  type: 'chat' | 'groupchat'
  body: string
  delay: null
  markable: 0 | 1
  extension: {
    attachments?: ChatMessageAttachment[]
    date_sent: string
  }
}

interface QBSystemMessageExtension {
  [key: string]: string | undefined
  notification_type: string
  action?: 'read' | 'delete'
}

interface QBSystemMessage {
  id: string
  userId: QBUser['id']
  body: null | string
  extension: QBSystemMessageExtension
}

interface QBGetDialogResult {
  items: QBChatDialog[]
  limit: number
  skip: number
  total_entries: number
}

type GetMessagesResult = {
  items: QBChatMessage[]
  limit: number
  skip: number
}

interface QBChatModule {
  dialog: {
    create(
      params: Dictionary<unknown>,
      callback: (error?: QBError, result: QBChatDialog) => void,
    ): void
    list(
      params: Dictionary<unknown>,
      callback: (error?: QBError, result: QBGetDialogResult) => void,
    ): void
    update(
      id: string,
      data: Dictionary<unknown>,
      callback: (error?: QBError, result: QBChatDialog) => void,
    ): void
  }
  message: {
    list(
      params: Dictionary<unknown>,
      callback: (error?: QBError, result: GetMessagesResult) => void,
    ): void
  }
  isConnected: boolean
  send<T extends QBChatNewMessage>(
    jidOrUserId: QBUser['id'] | string,
    message: T,
  ): string
  sendSystemMessage(
    jidOrUserId: QBUser['id'] | string,
    message: { extension: QBSystemMessage['extension'] },
  ): string
  sendDeliveredStatus(params: QBMessageStatusParams): void
  sendReadStatus(params: QBMessageStatusParams): void
  sendIsTypingStatus(jidOrUserId: QBUser['id'] | string): void
  sendIsStopTypingStatus(jidOrUserId: QBUser['id'] | string): void
  connect: (
    params: ChatConnectParams,
    callback: (error?: QBError, result: unknown) => void,
  ) => void
  disconnect: () => void
  ping(jidOrUserId: string | number, callback: (error: unknown) => void): void
  ping(callback: (error?: QBError) => void): void
  muc: {
    join(
      dialogJid: string,
      callback: (error?: QBError, result: unknown) => void,
    ): void
    leave(
      dialogJid: string,
      callback: (error?: QBError, result: unknown) => void,
    ): void
  }
  helpers: {
    getDialogJid(dialogId: QBChatDialog['_id']): string
    getUserCurrentJid(): string
    getUserJid(userId: QBUser['id'], appId?: string | number): string
    getRoomJidFromDialogId(dialogId: QBChatDialog['_id']): string
  }
  onMessageListener?: (
    senderId: QBUser['id'],
    message: QBChatXMPPMessage,
  ) => void
  onMessageErrorListener?: (messageId: string, error: unknown) => void
  onMessageTypingListener?: (
    isTyping: boolean,
    userId: QBUser['id'],
    dialogId: QBChatDialog['_id'],
  ) => void
  onDeliveredStatusListener?: (
    messageId: string,
    dialogId: QBChatDialog['_id'],
    userId: QBUser['id'],
  ) => void
  onReadStatusListener?: (
    messageId: string,
    dialogId: QBChatDialog['_id'],
    userId: QBUser['id'],
  ) => void
  onSystemMessageListener?: (message: QBSystemMessage) => void
  onReconnectFailedListener?: (error: unknown) => void
  onDisconnectedListener?: VoidFunction
  onReconnectListener?: VoidFunction
}

interface QBContentObject {
  account_id: number
  app_id: number
  content_type: string
  created_at: string
  id: number
  name: string
  public: boolean
  size: number
  uid: string
  updated_at: string
}

interface QBCustomObject {
  /**
   * ID of the record
   * Generated automatically by the server after record creation
   */
  _id: string
  /** ID of the user who created the record */
  user_id: QBUser['id']
  /** ID of parent object (Relations) */
  _parent_id: string | null
  /** Date & time when a record was created, filled automatically */
  created_at: number
  /** Date & time when record was updated, filled automatically */
  updated_at: number
}

interface QBAppointment extends QBCustomObject {
  priority: number
  client_id: QBUser['id']
  provider_id: QBUser['id']
  dialog_id: QBChatDialog['_id']
  description: string
  notes: string
  conclusion?: string
  date_start?: string
  date_end?: string
  language?: string
  records?: Array<QBContentObject['id']>
}

interface QBRecord extends QBCustomObject {
  uid?: string
  name?: string
  summary?: string
  transcription?: string
  appointment_id: QBAppointment['_id']
}

type CreateAndUploadParams = {
  file: File
  name: File['name']
  type: File['type']
  size: File['size']
  public?: boolean
}

interface QBContentModule {
  privateUrl(fileUID: string): string
  publicUrl(fileUID: string): string
  getInfo(
    id: number,
    callback: (error?: QBError, file: { blob: QBContentObject }) => void,
  )
  delete(id: number, callback: (error?: QBError, file: unknown) => void)
}

interface QBDataDeletedResponse {
  deleted: Array<QBCustomObject['_id']>
  deletedCount: number
}

interface QBDataModule {
  create<T extends QBCustomObject>(
    className: string,
    data: Dictionary<unknown>,
    callback: (error?: QBError, customObject: T) => void,
  ): void
  delete<T extends QBCustomObject['_id'] | Array<QBCustomObject['_id']>>(
    className: string,
    ids: T,
    callback: (error?: QBError, res: QBDataDeletedResponse) => void,
  ): void
  list<T extends QBCustomObject>(
    className: string,
    filters: Dictionary<unknown>,
    callback: (
      error?: QBError,
      result: {
        class_name: string
        items: T[]
        limit: number
        skip: number
      },
    ) => void,
  ): void
  update<
    D extends { _id: string } & Dictionary<unknown>,
    T extends QBCustomObject,
  >(
    className: string,
    data: D,
    callback: (error?: QBError, result: T) => void,
  ): void
}

type GetUserParam =
  | { login: string }
  | { full_name: string }
  | { facebook_id: string }
  | { twitter_id: string }
  | { phone: string }
  | { email: string }
  | { tags: string }
  | { external: string }

type GetUserParams =
  | GetUserParam
  | {
      page?: number
      per_page?: number
    }

type ListUserParams = {
  page?: number
  per_page?: number
  filter?: Dictionary<unknown>
  order?: string
}

interface ListUserResponse {
  current_page: number
  per_page: number
  total_entries: number
  items: Array<{ user: QBUser }>
}

interface QBUsersModule {
  get(
    params: number,
    callback: (error?: QBError, response?: QBUser) => void,
  ): void
  get(
    params: GetUserParams,
    callback: (error?: QBError, response: ListUserResponse) => void,
  ): void
  listUsers(
    params: ListUserParams,
    callback: (error?: QBError, response: ListUserResponse) => void,
  ): void
  create(
    params: QBCreateUserParams,
    callback: (error?: QBError, user: QBUser) => void,
  ): void
  update(
    userId: number,
    user: Partial<QBUser>,
    callback: (error?: QBError, user: QBUser) => void,
  ): void
}

interface QBGetUserMediaParams {
  audio: MediaStreamConstraints['audio']
  video: MediaStreamConstraints['video']
  /** Id attribute of HTMLVideoElement */
  elemId?: string
  options?: {
    muted?: boolean
    mirror?: boolean
  }
}

interface QBWebRTCSession {
  State: {
    NEW: 1
    ACTIVE: 2
    HUNGUP: 3
    REJECTED: 4
    CLOSED: 5
  }
  ID: string
  /**
   * One of {@link QBWebRTCSession#State}
   */
  state: number
  initiatorID: number
  opponentsIDs: number[]
  peerConnections: { [userId: number]: RTCPeerConnection }
  callType: 1 | 2
  startCallTime?: Date
  localStream?: MediaStream
  mediaParams: QBGetUserMediaParams | null
  getUserMedia(
    params: QBGetUserMediaParams,
    callback: (error?: QBError, stream?: MediaStream) => void,
  ): void
  /** Attach media stream to audio/video element */
  attachMediaStream(
    videoElemId: string,
    stream: MediaStream,
    options?: QBGetUserMediaParams['options'],
  ): void
  /** Detach media stream from audio/video element */
  detachMediaStream(videoElemId: string): void
  mute(type: 'audio' | 'video'): void
  unmute(type: 'audio' | 'video'): void
  /** Innitiate a call */
  call(params: Dictionary<unknown>): void
  /** Accept call */
  accept(params: Dictionary<unknown>): void
  /** Reject call */
  reject(params: Dictionary<unknown>): void
  /** Stop call (Hang up) */
  stop(params: Dictionary<unknown>): void
  switchMediaTracks(
    deviceIds: { audio?: { exact: string }; video?: { exact: string } },
    callback: (error?: QBError, stream?: MediaStream) => void,
  ): void
  /** Add tracks from provided stream to local stream (and replace in peers) */
  _replaceTracks(stream: MediaStream): void
}

interface QBWebRTCModule {
  CallType: {
    VIDEO: 1
    AUDIO: 2
  }
  getMediaDevices(kind?: MediaDeviceKind): Promise<MediaDeviceInfo[]>
  createNewSession(opponentsIds: number[], callType: 1 | 2): QBWebRTCSession
  onAcceptCallListener?: (
    session: QBWebRTCSession,
    userId: number,
    userInfo: Dictionary<unknown>,
  ) => void
  onCallListener?: (
    session: QBWebRTCSession,
    userInfo: Dictionary<unknown>,
  ) => void
  onCallStatsReport?: (
    session: QBWebRTCSession,
    userId: number,
    stats: string[],
  ) => void
  onRejectCallListener?: (
    session: QBWebRTCSession,
    userId: number,
    userInfo: Dictionary<unknown>,
  ) => void
  onRemoteStreamListener?: (
    sesion: QBWebRTCSession,
    userId: number,
    stream: MediaStream,
  ) => void
  onSessionCloseListener?: (session: QBWebRTCSession) => void
  onSessionConnectionStateChangedListener?: (
    sesion: QBWebRTCSession,
    userId: number,
    state: unknown,
  ) => void
  onStopCallListener?: (
    session: QBWebRTCSession,
    userId: number,
    userInfo: Dictionary<unknown>,
  ) => void
  onUpdateCallListener?: (
    session: QBWebRTCSession,
    userId: number,
    userInfo: Dictionary<unknown>,
  ) => void
  onUserNotAnswerListener?: (session: QBWebRTCSession, userId: number) => void
}

type QBLoginParams =
  | {
      login: string
      password: string
    }
  | {
      email: string
      password: string
    }
  | {
      provider: 'firebase_phone'
      firebase_phone: { access_token: string; project_id: string }
    }

interface Quickblox {
  auth: {
    createSession: VoidFunction
  }
  buildNumber: string
  chat: QBChatModule
  content: QBContentModule
  createSession(callback: (error?: QBError, session: QBSession) => void): void
  data: QBDataModule
  destroySession(callback: (error?: QBError, res: unknown) => void): void
  getSession(
    callback: (error?: QBError, response?: { session: QBSession }) => void,
  ): void
  init(
    appIdOrToken: string | number,
    authKeyOrAppId: string | number,
    authSecret?: string,
    accountKey: string,
    config?: QBConfig,
  ): void
  login(
    params: QBLoginParams,
    callback: (error: unknown, user: QBUser) => void,
  ): void
  logout(callback: (error: unknown, res: unknown) => void): void
  service: {
    qbInst: {
      config: {
        webrtc: {
          answerTimeInterval: number
        }
        endpoints: {
          api: string
        }
        urls: {
          blobs: string
          type: string
          data: string
        }
      }
    }
  }
  users: QBUsersModule
  webrtc: QBWebRTCModule
  version: string
}

interface QuickbloxConstructor {
  prototype: Quickblox
  new (): Quickblox
}

interface QB extends Quickblox {
  QuickBlox: QuickbloxConstructor
}

declare const QB: QB

interface QBMediaRecorderConstructorProps {
  /** Preferred MIME type */
  mimeType?: string
  workerPath?: string
  /**
   * The minimum number of milliseconds of data to return
   * in a single Blob, fire 'ondataavaible' callback
   * (isn't need to use with 'audio/wav' of 'audio/mp3')
   *
   * @default 1000
   */
  timeslice?: number
  /**
   * What to do with a muted input MediaStreamTrack,
   * e.g. insert black frames/zero audio volume in the recording
   * or ignore altogether
   *
   * @default true
   */
  ignoreMutedMedia?: boolean
  /** Recording start event handler */
  onstart?: VoidFunction
  /** Recording stop event handler */
  onstop?: (file: Blob) => void
  /** Recording pause event handler */
  onpause?: VoidFunction
  /** Recording resume event handler */
  onresume?: VoidFunction
  /** Error event handler */
  onerror?: (error: unknown) => void
  /**
   * `dataavailable` event handler.
   * The Blob of recorded data is contained in this event (callback
   * isn't supported if use 'audio/wav' of 'audio/mp3' for recording)
   */
  ondataavailable?: (event: { data: Blob }) => void
}

interface QBMediaRecorder {
  /**
   * Switch recording Blob objects to the specified
   * MIME type if `MediaRecorder` support it.
   */
  toggleMimeType(mimeType: string): void
  /**
   * Returns current `MediaRecorder` state
   */
  getState(): 'inactive' | 'recording' | 'paused'
  /**
   * Starts recording a stream.
   * Fires `onstart` callback.
   */
  start(stream: MediaStream): void
  /**
   * Stops recording a stream
   *
   * @fires `onstop` callback and passing there Blob recorded
   */
  stop(): void
  /** Pausing stream recording */
  pause(): void
  /** Resumes stream recording */
  resume(): void
  /**
   * Change record source
   */
  change(stream: MediaStream): void
  /**
   * Create a file from blob and download as file.
   * This method will call `stop` if recording is in progress.
   *
   * @param {string} filename Name of video file to be downloaded
   * (default to `Date.now()`)
   */
  download(filename?: string): void
  _getBlobRecorded(): Blob
  callbacks: Pick<
    QBMediaRecorderConstructorProps,
    | 'onstart'
    | 'onstop'
    | 'onpause'
    | 'onresume'
    | 'ondataavailable'
    | 'onerror'
  >
}

declare const QBMediaRecorder: {
  /**
   * Checks capability of recording in the environment.
   * Checks `MediaRecorder`, `MediaRecorder.isTypeSupported` and `Blob`.
   */
  isAvailable(): boolean
  /**
   * Checks if AudioContext API is available.
   * Checks `window.AudioContext` or `window.webkitAudioContext`.
   */
  isAudioContext(): boolean
  /**
   * The `QBMediaRecorder.isTypeSupported()` static method returns
   * a Boolean which is true if the MIME type specified is one
   * the user agent should be able to successfully record.
   * @param mimeType The MIME media type to check.
   *
   * @returns true if the `MediaRecorder` implementation is capable of
   * recording `Blob` objects for the specified MIME type. Recording may
   * still fail if there are insufficient resources to support the
   * recording and encoding process. If the value is false, the user
   * agent is incapable of recording the specified format.
   */
  isTypeSupported(mimeType: string): boolean
  /**
   * Return supported mime types
   * @param type video or audio (dafault to 'video')
   */
  getSupportedMimeTypes(type: 'audio' | 'video' = 'video'): string[]
  new (config: QBMediaRecorderConstructorProps): QBMediaRecorder
}
