import { Type } from '@sinclair/typebox'
import { DateISO } from './common'

export const QBUserId = Type.Integer({
  title: 'User ID',
  description:
    'ID of the user. Generated automatically by the server after user creation',
})
export const QBDialogId = Type.String({
  pattern: '^[a-z0-9]{24}$',
  title: 'Dialog ID',
})
export const QBMessageId = Type.String({
  pattern: '^[a-z0-9]{24}$',
  title: 'Message ID',
})
export const QBCustomObjectId = Type.String({
  pattern: '^[a-z0-9]{24}$',
  description:
    'ID of the custom object. Generated automatically by the server after creation',
})

export const QBUser = Type.Object(
  {
    id: QBUserId,
    full_name: Type.String({
      description: "User's full name",
      minLength: 3,
      maxLength: 60,
    }),
    email: Type.String({ format: 'email', description: "User's email" }),
    // login: Type.String(),
    // phone: Type.String(),
    created_at: DateISO,
    updated_at: DateISO,
    last_request_at: DateISO,
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
      profession: Type.String({
        description: "User's profession",
      }),
      description: Type.Optional(
        Type.String({
          description: "Description of the user's profession",
        }),
      ),
      language: Type.Optional(
        Type.String({
          description: "User's language",
        }),
      ),
    }),
  ],
  { $id: 'QCProvider' },
)

export const QCClient = Type.Intersect(
  [
    QBBaseUserData,
    Type.Object({
      birthdate: Type.String({
        pattern: '^\\d{4}-\\d{2}-\\d{2}$',
        title: 'Date',
        description: "User's birthdate",
      }),
      gender: Type.Union(
        [
          Type.Literal('male', { title: 'Male' }),
          Type.Literal('female', { title: 'Female' }),
        ],
        { description: "User's gender" },
      ),
      address: Type.Optional(
        Type.String({
          description: "User's address",
        }),
      ),
      language: Type.Optional(
        Type.String({
          description: "User's language",
        }),
      ),
    }),
  ],
  { $id: 'QCClient' },
)

export const QBSession = Type.Object(
  {
    _id: Type.String(),
    application_id: Type.Integer(),
    created_at: DateISO,
    id: Type.Integer(),
    nonce: Type.String(),
    token: Type.String(),
    ts: Type.Integer(),
    updated_at: DateISO,
    user_id: QBUserId,
  },
  { $id: 'QBSession' },
)

export const QBDialog = Type.Object(
  {
    _id: QBDialogId,
    created_at: DateISO,
    data: Type.Optional(Type.Record(Type.String(), Type.String())),
    last_message: Type.Union([Type.String(), Type.Null()]),
    last_message_date_sent: Type.Union([Type.Integer(), Type.Null()]),
    last_message_id: Type.Union([QBMessageId, Type.Null()]),
    last_message_user_id: Type.Union([QBUserId, Type.Null()]),
    name: Type.String(),
    occupants_ids: Type.Array(QBUserId),
    photo: Type.Null(),
    type: Type.Integer(),
    updated_at: DateISO,
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
      priority: Type.Integer({
        minimum: 0,
        maximum: 2,
        description: 'The priority of the appointment in the queue',
      }),
      client_id: QBUserId,
      provider_id: QBUserId,
      dialog_id: QBDialogId,
      description: Type.String({
        description: 'Description of the appointment',
      }),
      notes: Type.Optional(
        Type.String({
          description: 'Notes for appointment',
        }),
      ),
      conclusion: Type.Optional(
        Type.String({
          description: 'Conclusions for appointments',
        }),
      ),
      date_end: Type.Optional(DateISO),
      language: Type.Optional(
        Type.String({ description: 'Language of the appointment' }),
      ),
    }),
  ],
  { $id: 'QCAppointment' },
)

export const QCAppointmentSortKeys = Type.Union(
  [
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
  ],
  {
    description:
      'Returns appointments with sorting in ascending or descending order',
  },
)

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

export const QCRecordSortKeys = Type.Union(
  [
    Type.Literal('_id', { title: '_id' }),
    Type.Literal('created_at', { title: 'created_at' }),
    Type.Literal('updated_at', { title: 'updated_at' }),
    Type.Literal('uid', { title: 'File uid' }),
    Type.Literal('name', { title: 'File name' }),
    Type.Literal('transcription', { title: 'transcription' }),
    Type.Literal('summary', { title: 'summary' }),
    Type.Literal('actions', { title: 'actions' }),
    Type.Literal('appointment_id', { title: 'appointment_id' }),
  ],
  {
    description:
      'Returns records with sorting in ascending or descending order',
  },
)
