---
sidebar_label: 'Authorization'
sidebar_position: 4
---

# Authorization

Q-Consultation comprises two types of users: Clients (users who receive a specific service) or Providers (users who offer a certain service). Separate applications have been developed for each user type: [Client](https://github.com/QuickBlox/q-consultation/blob/master/packages/client) and [Provider](https://github.com/QuickBlox/q-consultation/blob/master/packages/provider), along with an [API](https://github.com/QuickBlox/q-consultation/blob/master/packages/api).

For implementing authorization within the application, the functionality of QuickBlox was utilized, which offers various authentication options. Currently, the app features email and password-based authentication, although QuickBlox supports additional authentication methods.

You can delve into the relevant documentation through the following link: <https://docs.quickblox.com>. Additionally, more detailed information about the authentication process in QuickBlox can be found at this link: <https://docs.quickblox.com/docs/js-authentication>.

## QuickBlox SDK Methods

First, let's briefly go over the QuickBlox SDK methods necessary for authentication.

- SDK Initialization: The [QB.init](https://docs.quickblox.com/docs/js-setup#initialize-quickblox-sdk) method allows initializing the SDK using the application's credentials.

- Session Creation: The [QB.createSession](https://docs.quickblox.com/docs/js-authentication#create-session) method establishes a user session.

- Session Termination: You can end the current session using the [QB.destroySession](https://docs.quickblox.com/docs/js-authentication#destroy-session-token) method.

- User Authentication: The [QB.login](https://docs.quickblox.com/docs/js-authentication#log-in-user) method facilitates the user authentication process.

- New User Creation: The [QB.users.create](https://docs.quickblox.com/docs/js-users#create-user.) method is used to create a new user and requires an active session.

## How do we utilize the QuickBlox SDK?

To simplify the usage of SDK methods, we've created wrappers in the form of promises, enabling convenient interaction with QuickBlox SDK methods. Additional details about wrapper functions are available through the following paths:

- [Client](https://github.com/QuickBlox/q-consultation/blob/master/packages/client/src/qb-api-calls)
- [Provider](https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/src/qb-api-calls)
- [API](https://github.com/QuickBlox/q-consultation/blob/master/packages/api/src/services/quickblox)

Below, you will find the functions that we use for authentication using the SDK.

### Client & Provider Applications

```ts title="Function QBInit"
declare function QBInit(params: QBInitParams): void

type QBInitParams = {
  appIdOrToken: string | number
  authKeyOrAppId: string | number
  authSecret?: string
  accountKey: string
  config?: {
    debug: boolean
    endpoints: {
      chat?: string
      api?: string
    }
    webrtc: {
      iceServers?: RTCIceServer[]
    }
  }
}
```

```ts title="Function QBCreateSession"
declare function QBCreateSession():  new Promise<QBSession>

interface QBSession {
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
```

```ts title="Function loginToQuickBlox"
declare function loginToQuickBlox(params: QBLoginParams): Promise<QBUser>

type QBLoginParams =
  | {
      login: string
      password: string
    }
  | {
      email: string
      password: string
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
```

:::caution
It's also important to note that logging into the system requires the presence of a previously created session, as mentioned earlier.
:::

```ts title="Function registrationAccount"
declare function registrationAccount(
  params: QBCreateUserParams,
): Promise<QBUser>

type QBLoginParams =
  | {
      login: string
      password: string
    }
  | {
      email: string
      password: string
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
```

:::caution
Just like with the login method, it's also essential here to have a pre-created session.
:::

### API Application

In the API application, we extended the QuickBlox class.

```ts
class QBApi extends QuickBlox {
  public axios: AxiosInstance
  public init(): void
}
```

This class also includes axios for sending requests using [QuickBlox API endpoints](https://docs.quickblox.com/reference/overview), as well as a overridden init method that is used without parameters.

Within our API, there are two instances that are used for making requests on behalf of an administrator and a user:

```ts
const QBUserApi: QBApi
const QBAdminApi: QBApi
```

`QBUserApi` creates an instance of the `QBApi` class, which is intended for user session operations. The session data is obtained from the Authorization header in the request. When using this instance, initialization and the authentication process (login) occur automatically before each request.

`QBAdminApi` also creates an instance of the `QBApi` class and is designed for operations on behalf of an administrator. In this case, all operations (including initialization and authentication) need to be performed manually in the places where they are required.

More detailed information about the implementation can be found at this [link](https://github.com/QuickBlox/q-consultation/blob/master/packages/api/src/plugins/quickblox).

```ts title="Function qbCreateSession"
declare const qbCreateSession = (QB: QBApi, credentials?: QBLoginParams) =>
  Promise<QBSession>

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

interface QBSession {
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
```

```ts title="Function qbGetSession"
declare const qbGetSession = (QB: QBApi) => Promise<QBSession>
```

```ts title="Function qbLogin"
declare const qbLogin = (QB: QBApi, credentials: LoginCredentials) =>
  Promise<QBSession>

type LoginCredentials =
  | {
      login: string
      password: string
    }
  | {
      email: string
      password: string
    }
```

```ts title="Function qbCreateUser"
declare const qbCreateUser = <
  T = QBCreateUserWithLogin | QBCreateUserWithEmail,
>(
  QB: QBApi,
  data: T,
) => Promise<QBUser>

type QBCreateUserWithLogin = {
  login: string
  password: string
  blob_id?: number
  custom_data?: string
  email?: string
  external_user_id?: string | number
  facebook_id?: string
  full_name?: string
  phone?: string
  tag_list?: string | string[]
  twitter_id?: string
  website?: string
}
type QBCreateUserWithEmail = {
  email: string
  password: string
  blob_id?: number
  custom_data?: string
  external_user_id?: string | number
  facebook_id?: string
  full_name?: string
  login?: string
  phone?: string
  tag_list?: string | string[]
  twitter_id?: string
  website?: string
}

interface QBUser {
  id: number
  full_name: string
  email: string
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
```

## Implementation details of Client & Provider.

As mentioned above, Q-Consultation includes two applications for login and supports "email + password" authentication. Below are examples of authentication implementation for application versions using [React](https://react.dev) and [Redux Saga](https://redux-saga.js.org).

In Q-Consultation, login, logout, and registration functionalities are handled through the `auth` saga using the following paths:

- For the [client application](https://github.com/QuickBlox/q-consultation/blob/master/packages/client/src/sagas/auth.ts)

- For the [provider application](https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/src/sagas/auth.ts)

### Login

To perform a login in the application, you need to call the `emailLogin` action. This can be done using the action creator.

```ts
declare function emailLogin(payload: {
  email: string
  password: string
}): QBEmailLoginRequestAction

interface QBEmailLoginRequestAction extends Action {
  type: typeof QB_LOGIN_REQUEST
  payload: { email: string; password: string }
}
```

Subsequently, this action will be processed using the `emailLoginWatcher` generator function.

```ts
function* emailLoginWatcher (action:Types.QBEmailLoginRequestAction) => void
```

There, the `QBLogin` function is called, which authorizes the user.

```ts
const result: { session: QBSession; user: QBUser } = yield call(
  QBLogin,
  action.payload,
)
```

The result of the saga's work is the invocation of action creators ` loginSuccess` and `loginError`:

- In the case of successful authentication.

```ts
declare function loginSuccess(payload: {
  session: QBSession
  user: QBUser
}): QBLoginSuccessAction

interface QBLoginSuccessAction extends Action {
  type: typeof QB_LOGIN_SUCCESS
  payload: { session: QBSession; user: QBUser }
}
```

- In case of an error occurring.

```ts
declare function loginError(error: string): QBLoginFailureAction

interface QBLoginFailureAction extends Action {
  type: typeof QB_LOGIN_FAILURE
  error: string
}
```

The functions in the sagas for both the provider and the client are essentially the same, with the difference being only in the check of whether the given user is a provider or not. In the event that a user who usually operates from the client side attempts to log in as a provider, this action will be unsuccessful. Similarly, a provider won't be able to authenticate as a client.

```ts
if (userIsProvider(result.user)) {
  // code
}
```

The `userIsProvider` function is a utility function that returns the result of checking whether the given user is a provider or not. You can review it at the following path:

- [/packages/client/src/utils/user.ts](https://github.com/QuickBlox/q-consultation/blob/master/packages/client/src/utils/user.ts)
- [/packages/provider/src/utils/user.ts](https://github.com/QuickBlox/q-consultation/blob/master/packages/provider/src/utils/user.ts)

### Logout

To perform a logout from the system, you need to call the action creator `logout`:

```ts
declare function logout(
  then?: (data: Types.LogoutSuccessAction) => void,
): LogoutRequestAction

interface LogoutRequestAction extends Action {
  type: typeof LOGOUT_REQUEST
  payload: { then?: (data: LogoutSuccessAction) => void }
}
```

Then, this action will be processed using the `logout` generator function, within which a call to `QBLogout` will be executed:

```ts
declare function* logout(action: Types.LogoutRequestAction)=> void
```

The result of the saga's work is the invocation of action creators `logoutSuccess` and `logoutFailure`:

- Upon successful completion of the logout process.

```ts
declare function logoutSuccess(): LogoutSuccessAction

interface LogoutSuccessAction extends Action {
  type: typeof LOGOUT_SUCCESS
}
```

- In case an error occurs

```ts
declare function logoutFailure(error: string): LogoutFailureAction

interface LogoutFailureAction extends Action {
  type: typeof LOGOUT_FAILURE
  error: string
}
```

### Registration

The process of registering new users is implemented exclusively in the client application. To register a new user, an action creator named `createAccount` is used:

```ts
declare function createAccount(
  data: Types.CreateAccount,
  then?: (data: Types.QBAccountCreateSuccessAction) => void,
): QBAccountCreateRequestAction

interface QBAccountCreateRequestAction extends Action {
  type: typeof QB_ACCOUNT_CREATE_REQUEST
  payload: {
    data: CreateAccount
    then?: (data: QBAccountCreateSuccessAction) => void
  }
}
```

This action triggers the `createAccount` generator function, within which the `QBUserCreate` function is called. This function is responsible for creating new users:

```ts
function* createAccount(action: Types.QBAccountCreateRequestAction) => void
```

The result of the function's execution is the invocation of action creators `createAccountSuccess` and `createAccountFailure`:

- Upon successful registration

```ts
declare function createAccountSuccess(payload: {
session: QBSession
user: QBUser
})QBAccountCreateSuccessAction

interface QBAccountCreateSuccessAction extends Action {
type: typeof QB_ACCOUNT_CREATE_SUCCESS
payload: { session: QBSession; user: QBUser }
}
```

- In case an error occurs

```ts
declare function createAccountFailure(
  error: string,
): QBAccountCreateFailureAction

interface QBAccountCreateFailureAction extends Action {
  type: typeof QB_ACCOUNT_CREATE_FAILURE
  error: string
}
```

## API Authentication

Before starting to work with API authentication in Q-Consultation, you need to familiarize yourself with the [API reference](https://quickblox.github.io/q-consultation/api). There, you will find a detailed description of all endpoints.

The API also utilizes a session-based authentication method, which returns information about a "session". Users can authenticate themselves as either a "client" or a "provider".

### Endpoints

The following API endpoints are used for authentication:

| Method | URL                 | Description                                                                                              |
| ------ | ------------------- | -------------------------------------------------------------------------------------------------------- |
| POST   | /api/auth/login     | [Login](https://quickblox.github.io/q-consultation/api/#tag/Auth/paths/~1auth~1login/post)               |
| POST   | /api/auth/logout    | [Logout](https://quickblox.github.io/q-consultation/api/#tag/Auth/paths/~1auth~1logout/delete)           |
| POST   | /api/users/client   | [Create client](https://quickblox.github.io/q-consultation/api#tag/Users/paths/~1users~1client/post)     |
| POST   | /api/users/provider | [Create provider](https://quickblox.github.io/q-consultation/api#tag/Users/paths/~1users~1provider/post) |

### Node.js Implementation

For interacting with the API, we use [Node.js](https://nodejs.org/en) with the [Fastify](https://fastify.dev) framework. Responsible for API authentication, the `login` function:

```ts
declare const login: FastifyPluginAsyncTypebox = async (fastify) =>
{ session: QBSession, data: QBUser } | string
```

To ensure request validation, we will use the [TypeBox](https://github.com/sinclairzx81/typebox#typebox) library. It provides tools for strict data typing, which helps avoid errors related to passing incorrect information. This offers a more reliable way to validate data that enters our system.

TypeBox is a library that creates JSON schema objects for TypeScript types at runtime. These schemas are automatically derived from TypeScript types. The generated schemas adhere to the rules of TypeScript's static type checking provided by the TypeScript compiler. TypeBox provides a unified type that can be statically checked in TypeScript and validated at runtime using standard JSON Schema validation tools.

```ts
const loginSchema = {
  tags: ['Auth'],
  summary: 'User login',
  body: Type.Object({
    role: Type.Union([
      Type.Literal('client', { title: 'Client' }),
      Type.Literal('provider', { title: 'Provider' }),
    ]),
    email: Type.String({ format: 'email' }),
    password: Type.String(),
  }),
  response: {
    200: Type.Object({
      session: Type.Ref(QBSession),
      data: Type.Ref(QBUser),
    }),
  },
}
```

Inside the function, we retrieve user data mentioned earlier and call the authentication methods from the QuickBlox SDK: `qbCreateSession` and `qbLogin`.

The function responsible for handling logout is named `logout`.

```ts
const logoutSchema = {
  tags: ['Auth'],
  summary: 'User logout',
  response: {
    204: Type.Null({ description: 'No content' }),
  },
  security: [{ providerSession: [] }, { clientSession: [] }] as Security,
}

declare const logout: FastifyPluginAsyncTypebox = async (fastify) =>
  string | undefined
```

Before performing the logout process, the `handleResponse` function calls QuickBlox SDK methods that send a notification to the UI application, informing the user that the session will be terminated, and subsequently perform the logout from the application.

```ts
await qbChatConnect(session.user_id, session.token)
const dialogId = QB.chat.helpers.getUserJid(session.user_id)


await qbChatSendSystemMessage(dialogId, {
extension: {
notification_type: CLOSE_SESSION_NOTIFICATION,
  },
}
```

After pre-processing the request, we call the QuickBlox SDK method `qbLogout` which leads to the termination of the session in the API.

The `signup` function is responsible for registering in the API, and it is used for both clients and providers. These functions have a similar structure with some minor differences, as described below.

```ts
const signUpSchema = {
  tags: ['Users', 'Client'],
  summary: 'Signup client',
  consumes: ['multipart/form-data'],
  body: Type.Intersect([
    Type.Omit(QCClient, ['id', 'created_at', 'updated_at', 'last_request_at']),
    Type.Object({
    password: Type.String(),
    avatar: Type.Optional(MultipartFile),
    }),
  ]),
  response: {
    200: Type.Object({
    session: Type.Ref(QBSession),
    user: Type.Ref(QBUser),
    }),
  },
}


declare const signup: FastifyPluginAsyncTypebox = async (fastify) =>
{ session: QBSession, data: QBUser } | string
```

To register as a provider, you need to provide the following additional parameters in the request body: "profession" and "description". The data types for each parameter will be detailed in the request schema.

```ts
const { profession, description, avatar, email, password } = request.body
```

For registering as a client:

```ts
const { avatar, email, password } = request.body
```

After successfully obtaining the data, the process involves creating a session with `qbCreateSession`, registering the new user as a service provider with `qbCreateUser`, and then logging into the system with this account using `qbLogin`.

## Replacing login with email

To change the authentication method from using email to login, you will need to replace the parameter `email` with `login` in the SDK methods such as `login` or `createSession`.

```ts
var params = { login: 'garry', password: 'garry5santos' }

QB.login(params, function (error, result) {
  // callback function
})

QB.createSession(params, function (error, result) {
  // callback function
})
```

Next, when working with the UI component, we pass the following object type to the `emailLoginWatcher` function:

```ts
payload: {
  login: string
  password: string
}
```

If we are talking about the API, the first step is to make changes to the `loginSchema` to replace the `email` field with the `login` field. Then, the data that will be sent should look as follows:

```ts
{
"role": "string",
"login": "string",
"password": "string"
}
```
