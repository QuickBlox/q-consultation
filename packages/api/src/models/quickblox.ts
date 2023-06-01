import { Type } from '@sinclair/typebox'

export const QBUserId = Type.Integer({ title: 'User ID' })
export const QBDialogId = Type.String({
  pattern: '^[a-z0-9]{24}$',
  title: 'Dialog ID',
})
export const QBCustomObjectId = Type.String({ pattern: '^[a-z0-9]{24}$' })

export const QBUser = Type.Object(
  {
    id: QBUserId,
    full_name: Type.String(),
    email: Type.String({ format: 'email' }),
    // login: Type.String(),
    // phone: Type.String(),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
    last_request_at: Type.String({ format: 'date-time' }),
    custom_data: Type.Union([
      Type.String({
        title: 'Additional data',
        description: 'This value is an JSON object converted to a string.',
      }),
      Type.Null({ title: 'Empty' }),
    ]),
    user_tags: Type.Union([
      Type.String({ title: 'Tags' }),
      Type.Null({ title: 'Empty' }),
    ]),
  },
  { $id: 'QBUser' },
)

const QBBaseUserData = Type.Omit(QBUser, ['custom_data', 'user_tags'], {
  $id: '',
})

export const QCProvider = Type.Intersect(
  [
    QBBaseUserData,
    Type.Object({
      full_name: Type.String(),
      description: Type.Optional(Type.String()),
      language: Type.Optional(Type.String()),
    }),
  ],
  { $id: 'QCProvider' },
)

export const QCClient = Type.Intersect(
  [
    QBBaseUserData,
    Type.Object({
      full_name: Type.String(),
      birthdate: Type.String(),
      gender: Type.Union([
        Type.Literal('male', { title: 'Male' }),
        Type.Literal('female', { title: 'Female' }),
      ]),
      address: Type.Optional(Type.String()),
      language: Type.Optional(Type.String()),
    }),
  ],
  { $id: 'QCClient' },
)

export const QBSession = Type.Object(
  {
    _id: Type.String(),
    application_id: Type.Integer(),
    created_at: Type.String({ format: 'date-time' }),
    id: Type.Integer(),
    nonce: Type.String(),
    token: Type.String(),
    ts: Type.Integer(),
    updated_at: Type.String({ format: 'date-time' }),
    user_id: QBUserId,
  },
  { $id: 'QBSession' },
)

export const QBDialog = Type.Object(
  {
    _id: QBDialogId,
    created_at: Type.String({ format: 'date-time' }),
    data: Type.Optional(Type.Record(Type.String(), Type.String())),
    last_message: Type.Union([Type.String(), Type.Null()]),
    last_message_date_sent: Type.Union([Type.String(), Type.Null()]),
    last_message_id: Type.Union([Type.String(), Type.Null()]),
    last_message_user_id: Type.Union([QBUserId, Type.Null()]),
    name: Type.String(),
    occupants_ids: Type.Array(QBUserId),
    photo: Type.Null(),
    type: Type.Integer(),
    updated_at: Type.String({ format: 'date-time' }),
    user_id: QBUserId,
    xmpp_room_jid: Type.Union([Type.String(), Type.Null()]),
    unread_messages_count: Type.Union([Type.Integer(), Type.Null()]),
    joined: Type.Optional(Type.Boolean()),
  },
  { $id: 'QBDialog' },
)

const QBCustomObject = Type.Object({
  _id: QBCustomObjectId,
  user_id: QBUserId,
  // _parent_id: Type.Union([QBCustomObjectId, Type.Null()]),
  created_at: Type.Integer(),
  updated_at: Type.Integer(),
})

export const QCAppointment = Type.Intersect(
  [
    QBCustomObject,
    Type.Object({
      _parent_id: Type.Null(),
      priority: Type.Integer({ minimum: 0, maximum: 2 }),
      client_id: QBUserId,
      provider_id: QBUserId,
      dialog_id: QBDialogId,
      description: Type.String(),
      notes: Type.Optional(Type.String()),
      conclusion: Type.Optional(Type.String()),
      date_end: Type.Optional(Type.String({ format: 'date-time' })),
      language: Type.Optional(Type.String()),
    }),
  ],
  { $id: 'QCAppointment' },
)

export const QCAppointmentSortKeys = Type.Union([
  Type.Literal('_id', { title: '_id' }),
  Type.Literal('created_at', { title: 'created_at' }),
  Type.Literal('updated_at', { title: 'updated_at' }),
  Type.Literal('priority', { title: 'priority' }),
  Type.Literal('client_id', { title: 'client_id' }),
  Type.Literal('provider_id', { title: 'provider_id' }),
  Type.Literal('dialog_id', { title: 'dialog_id' }),
  Type.Literal('description', { title: 'description' }),
  Type.Literal('notes', { title: 'notes' }),
  Type.Literal('conclusion', { title: 'conclusion' }),
  Type.Literal('date_end', { title: 'date_end' }),
  Type.Literal('language', { title: 'language' }),
])

export const QCRecord = Type.Intersect(
  [
    QBCustomObject,
    Type.Object({
      _parent_id: QBCustomObjectId,
    }),
    Type.Partial(
      Type.Object({
        uid: Type.String(),
        name: Type.String(),
        transcription: Type.Array(
          Type.String({ description: 'Format: "time|text"' }),
        ),
        summary: Type.String(),
        actions: Type.String(),
        appointment_id: QBCustomObjectId,
      }),
    ),
  ],
  { $id: 'QCRecord' },
)

export const QCRecordSortKeys = Type.Union([
  Type.Literal('_id', { title: '_id' }),
  Type.Literal('created_at', { title: 'created_at' }),
  Type.Literal('updated_at', { title: 'updated_at' }),
  Type.Literal('uid', { title: 'File uid' }),
  Type.Literal('name', { title: 'File name' }),
  Type.Literal('transcription', { title: 'transcription' }),
  Type.Literal('summary', { title: 'summary' }),
  Type.Literal('actions', { title: 'actions' }),
  Type.Literal('appointment_id', { title: 'appointment_id' }),
])
