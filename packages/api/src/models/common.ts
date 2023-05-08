import { Type } from '@sinclair/typebox'

export const Error = Type.Object(
  {
    statusCode: Type.Integer(),
    error: Type.String(),
    message: Type.String(),
  },
  { $id: 'Error' },
)

export const QBUser = Type.Object(
  {
    id: Type.Integer(),
    full_name: Type.String(),
    email: Type.String({ format: 'email' }),
    // login: Type.String(),
    // phone: Type.String(),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
    last_request_at: Type.String({ format: 'date-time' }),
    custom_data: Type.Union([Type.String(), Type.Null()]),
    user_tags: Type.Union([Type.String(), Type.Null()]),
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
      gender: Type.Union([Type.Literal('male'), Type.Literal('female')]),
      address: Type.Optional(Type.String()),
      language: Type.Optional(Type.String()),
    }),
  ],
  { $id: 'QCClient' },
)

export const QBSession = Type.Object(
  {
    _id: Type.String({ format: 'uuid' }),
    application_id: Type.Integer(),
    created_at: Type.String({ format: 'date-time' }),
    id: Type.Integer(),
    nonce: Type.String(),
    token: Type.String(),
    ts: Type.Integer(),
    updated_at: Type.String({ format: 'date-time' }),
    user_id: QBUser.properties.id,
  },
  { $id: 'QBSession' },
)

export const QBDialog = Type.Object(
  {
    _id: Type.String(),
    created_at: Type.String(),
    data: Type.Optional(Type.Record(Type.String(), Type.String())),
    last_message: Type.Union([Type.String(), Type.Null()]),
    last_message_date_sent: Type.Union([Type.String(), Type.Null()]),
    last_message_id: Type.Union([Type.String(), Type.Null()]),
    last_message_user_id: Type.Union([QBUser.properties.id, Type.Null()]),
    name: Type.String(),
    occupants_ids: Type.Array(Type.Number()),
    photo: Type.Null(),
    type: Type.Number(),
    updated_at: Type.String(),
    user_id: QBUser.properties.id,
    xmpp_room_jid: Type.Union([Type.String(), Type.Null()]),
    unread_messages_count: Type.Union([Type.Number(), Type.Null()]),
    joined: Type.Optional(Type.Boolean()),
  },
  { $id: 'QBDialog' },
)

const QBCustomObject = Type.Object({
  _id: Type.String({ format: 'uuid' }),
  user_id: QBUser.properties.id,
  _parent_id: Type.Union([Type.String(), Type.Null()]),
  created_at: Type.Number(),
  updated_at: Type.Number(),
})

export const QCAppointment = Type.Intersect(
  [
    QBCustomObject,
    Type.Object({
      priority: Type.Number(),
      client_id: QBUser.properties.id,
      provider_id: QBUser.properties.id,
      dialog_id: QBDialog.properties._id,
      description: Type.String(),
      notes: Type.Union([Type.String(), Type.Null()]),
      conclusion: Type.Optional(Type.String()),
      // date_start: Type.Optional(Type.String()),
      date_end: Type.Optional(Type.String()),
      language: Type.Optional(Type.String()),
      // has_assitant: Type.Optional(Type.Boolean()),
      // records: Type.Optional(
      //   Type.Union([Type.Array(Type.Number()), Type.Null()]),
      // ),
    }),
  ],
  { $id: 'QCAppointment' },
)

export const QCRecord = Type.Intersect(
  [
    QBCustomObject,
    Type.Partial(
      Type.Object({
        uid: Type.String({ format: 'uuid' }),
        name: Type.String(),
        transcription: Type.Array(Type.String()),
        summary: Type.String(),
        actions: Type.String(),
        appointment_id: QBCustomObject.properties._id,
      }),
    ),
  ],
  { $id: 'QCRecord' },
)
