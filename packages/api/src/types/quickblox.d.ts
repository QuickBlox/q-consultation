declare module 'quickblox' {
  export interface QBConfig {
    debug: boolean
    endpoints: {
      chat?: string
      api?: string
    }
    webrtc: {
      iceServers?: string
    }
  }

  export interface QBError {
    code?: number
    status?: string
    detail?: string | string[] | Dictionary<string | string[]>
    message: string | string[] | Dictionary<string | string[]>
  }

  export interface QBUser {
    id: number
    full_name: string
    email: string
    // login: string;
    // phone: string;
    /** Date ISO string */
    created_at: string
    /** Date ISO string */
    updated_at: string
    /** Date ISO string */
    last_request_at: string
    custom_data: string | null
    user_tags: string | null
    password?: string
    old_password?: string
  }

  export type QBUserCustomData = Partial<{
    address: string
    birthdate: string
    profession: string
    description: string
    gender: string
    language: string
    keywords: string
    avatar: {
      id: number
      uid: string
    }
  }>

  export interface QBUserWithCustomData extends Omit<QBUser, 'custom_data'> {
    custom_data: QBUserCustomData
  }

  export interface ListUserResponse {
    current_page: number
    per_page: number
    total_entries: number
    items: Array<{ user: QBUser }>
  }

  export interface QBSession {
    _id: string
    application_id: number
    /** Date ISO string */
    created_at: string
    id: number
    nonce: string
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

  export interface ChatMessageAttachment {
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

  export enum QBChatDialogType {
    PUBLIC = 1,
    GROUP = 2,
    PRIVATE = 3,
  }

  export interface QBChatDialog {
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
    type: number
    /** Date ISO string */
    updated_at: string
    user_id: QBUser['id']
    xmpp_room_jid: string | null
    unread_messages_count: number | null
    joined?: boolean
  }

  export interface QBChatMessage {
    _id: string
    attachments: ChatMessageAttachment[]
    chat_dialog_id: QBChatDialog['_id']
    /** Date ISO string */
    created_at: string
    /** Date timestamp */
    date_sent: number
    delivered_ids?: Array<QBUser['id']>
    message: string | null
    read_ids?: Array<QBUser['id']>
    read: 0 | 1
    recipient_id: QBUser['id'] | null
    sender_id: QBUser['id']
    /** Date ISO string */
    updated_at: string
  }

  export interface QBMessageStatusParams {
    messageId: QBChatMessage['_id']
    dialogId: QBChatDialog['_id']
    userId: QBUser['id']
  }

  export interface QBChatNewMessage {
    type: 'chat' | 'groupchat'
    body: string
    extension: {
      attachments?: ChatMessageAttachment[]
      save_to_history: 0 | 1
      dialog_id: QBChatDialog['_id']
    }
    markable: 0 | 1
  }

  export interface QBChatXMPPMessage {
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
      type?: string
      user_id?: string
      profile_id?: string
      organization_id?: string
    }
  }

  export interface QBSystemMessageExtension {
    [key: string]: string | undefined
    notification_type: string
    action?: 'read' | 'delete'
  }

  export interface QBSystemMessage {
    id: string
    userId: QBUser['id']
    body: null | string
    extension: QBSystemMessageExtension
  }

  export interface QBGetDialogResult {
    items: QBChatDialog[]
    limit: number
    skip: number
    total_entries: number
  }

  export type GetMessagesResult = {
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
      getDialogIdFromNode(jid: string): QBChatDialog['_id']
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

  export interface QBContentObject {
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

  export interface QBCustomObject {
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

  type QBAppointmentPermissions = {
    read: { access: string }
    update: { access: string }
    delete: { access: string }
  }

  export interface QBAppointment extends Omit<QBCustomObject, '_parent_id'> {
    _parent_id: null
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
    appointment_name: string | null
    is_canceled: boolean | null
    is_finished: boolean | null
    has_assistant: boolean | null
    permissions: QBAppointmentPermissions
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

  export interface QBDataFile {
    content_type: string
    file_id: string
    name: string
    size: number
  }

  export interface BlobObject extends QBContentObject {
    blob_object_access: { params: string }
    blob_status: unknown
    set_completed_at: unknown
  }

  interface QBContentModule {
    privateUrl(fileUID: string): string
    publicUrl(fileUID: string): string
    getInfo(
      id: number,
      callback: (error?: QBError, file: { blob: QBContentObject }) => void,
    )
    create(
      params: { name: string; content_type: string; public?: boolean },
      callback: (error?: QBError, data: BlobObject) => void,
    )
    markUploaded(
      params: { id: number; size: number },
      callback: (error?: QBError, data: unknown) => void,
    )
    delete(id: number, callback: (error?: QBError, file: unknown) => void)
    createAndUpload(
      params: {
        name: string
        file: Buffer
        type: string
        size: number
        public?: boolean
      },
      callback: (error?: QBError, file: QBContentObject) => void,
    )
  }

  export interface QBDataDeletedResponse {
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
    fileUrl(
      className: string,
      params: { id: string; field_name: string },
    ): string
    uploadFile(
      className: string,
      params: { id: string; field_name: string; file: File; name: string },
      callback: (error?: QBError, result: QBDataFile) => void,
    ): void
    deleteFile(
      className: string,
      params: { id: string; field_name: string },
      callback: (error?: QBError, result: unknown) => void,
    )
  }

  export interface QBCreateUserWithLogin {
    login: string
    password: string
    blob_id?: number
    custom_data: string | null
    email?: string
    external_user_id?: string | number
    facebook_id?: string
    full_name?: string
    phone?: string
    tag_list?: string | string[]
    website?: string
  }

  export interface QBCreateUserWithEmail {
    email: string
    password: string
    blob_id?: number
    custom_data?: string | null
    external_user_id?: string | number
    facebook_id?: string
    full_name?: string
    login?: string
    phone?: string
    tag_list?: string | string[]
    website?: string
  }

  export type GetUserParam =
    | { login: string }
    | { full_name: string }
    | { facebook_id: string }
    | { phone: string }
    | { email: string }
    | { tags: string }
    | { external: string }

  export type GetUserParams =
    | GetUserParam
    | {
        page?: number
        per_page?: number
      }

  export type ListUserParams = {
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
    create<T = QBCreateUserWithLogin | QBCreateUserWithEmail>(
      params: T,
      callback: (error?: QBError, user: QBUser) => void,
    ): void
    delete(userId: number, callback: (error?: QBError, res?: '') => void): void
    update(
      userId: number,
      user: Partial<Omit<QBUser, 'id'>>,
      callback: (error?: QBError, user: QBUser) => void,
    ): void
  }

  interface Quickblox {
    buildNumber: string
    chat: QBChatModule
    content: QBContentModule
    data: QBDataModule
    createSession(callback: (error?: QBError, session: QBSession) => void): void
    createSession(
      params: QBLoginParams,
      callback: (error?: QBError, session: QBSession) => void,
    ): void
    startSessionWithToken(
      token: string,
      callback: (error?: QBError, response: { session: QBSession }) => void,
    )
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
        session: QBSession | null
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

  const SDK: QB

  export = SDK
}
