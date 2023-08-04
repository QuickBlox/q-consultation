---
sidebar_label: 'API application'
sidebar_position: 2
---

# API application

API application implements the API for the [Client and Provider applications](/dev/development/provider-and-client),
as well as integration with them.
The application does not have its own database and uses [QuickBlox](https://docs.quickblox.com/) to store and share data.
Within this application, an API has been implemented that extends the capabilities of QuickBlox,
adapting them to the features of QConsultation Lite.
However, all other [QuickBlox methods](https://docs.quickblox.com/reference/overview) can be used without modification.

:::info Prerequisites

- **Programming language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Fastify](https://www.fastify.io/)
- **Chat & Video calling platform**: [QuickBlox](https://docs.quickblox.com/)
- **AI platform**: [OpenAI](https://platform.openai.com/docs/api-reference)
- **Request library**: [Node Fetch](https://github.com/node-fetch/node-fetch/tree/2.x#readme)
- **Utility library**: [Lodash](https://lodash.com/)
- **JSON Schema**: [TypeBox](https://github.com/sinclairzx81/typebox)
- **Code Linting**: [Prettier](https://prettier.io/), [ESLint](https://eslint.org/)

:::

## Structure

```yaml
packages
└──── api
      ├──── node_modules # npm packages used by the package
      ├──── dist # build of the package
      ├──── src # business logic of the package split into subfolders per API
      │     ├──── constants
      │     ├──── models
      │     ├──── plugins
      │     ├──── routes
      │     ├──── services
      │     ├──── types
      │     ├──── utils
      │     └ app.ts
      │
      ├ .eslintignore
      ├ .eslintrc
      ├ package.json
      └ tsconfig.json
```

## Plugins

Plugins define behavior that is common to all the routes in your
application. Authentication, caching, templates, and all the other cross
cutting concerns should be handled by plugins placed in this folder.

Files in `src/plugins` folder are typically defined through the
[`fastify-plugin`](https://github.com/fastify/fastify-plugin) module,
making them non-encapsulated. They can define decorators and set hooks
that will then be used in the rest of your application.

Check out:

- [The hitchhiker's guide to plugins](https://www.fastify.io/docs/latest/Guides/Plugins-Guide/)
- [Fastify decorators](https://www.fastify.io/docs/latest/Reference/Decorators/).
- [Fastify lifecycle](https://www.fastify.io/docs/latest/Reference/Lifecycle/).

Connected plugins:

- **[cors](https://github.com/fastify/fastify-cors)** - enables the use of [CORS](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).
- **[env](https://github.com/fastify/fastify-env)** - fastify plugin to check environment variables.
- **[multipart](https://github.com/fastify/fastify-multipart)** - plugin to parse the multipart content-type.
- **[sensible](https://github.com/fastify/fastify-sensible)** - plugin adds some useful utilities to your Fastify instance.
- **[swagger](https://github.com/fastify/fastify-swagger)** - automatically generated from your route schemas, or from an existing OpenAPI schema
- **[typebox](https://github.com/fastify/fastify-type-provider-typebox)** - set TypeBox validator compiler
- **auth** - implements a decorator for getting a token.
- **error** - plugin to parse errors.
- **quickblox** - produces QuickBlox SDK initialization and provide authentication strategies for different roles of users.

  The `fastify.verify` performs verification of the authorization strategy.
  Each strategy checks the validity of the token in an `Authorization` HTTP header.

  Implemented the following strategies:

  - `BearerToken` - Checks the validity of `BEARER_TOKEN` from the application configuration.
    This strategy executes requests on behalf of the owner of the QuickBlox account.
  - `ProviderSessionToken` - checks the validity of the provider's session token.
  - `ClientSessionToken` - checks the validity of the client's session token.
  - `SessionToken` - checks the validity of the session token of the provider or client.

  An endpoint can use multiple authorization strategies.

  In the following example, you will find a very simple implementation that should help you understand how to use this module:

  ```ts
  fastify.get(
    '/',
    {
      onRequest: fastify.verify(
        fastify.BearerToken,
        fastify.ProviderSessionToken,
      ),
    },
    async (request, reply) => {
      /* handler */
    },
  )
  ```

## Schemas & Models

Fastify uses a schema-based approach, and even if it is not mandatory we recommend using [TypeBox](https://github.com/sinclairzx81/typebox) to validate your routes and serialize your outputs. Internally, Fastify compiles the schema into a highly performant function.

The supported validations are:

- `body`: validates the body of the request if it is a `POST`, `PUT`, or `PATCH` method.
- `querystring`: validates the query string.
- `params`: validates the route params.
- `headers`: validates the request headers.

In addition, the scheme supports other properties:

- `tags` - allows grouping endpoints by tag
- `description` - description of the endpoint
- `consumes` - specifies the MIME Types for the request body.
  - Default: `["application/json"]`.
  - To upload files: `["multipart/form-data"]`.
- `security` - indicates the authorization method.
  This schema parameter must be used in conjunction with the definition of an authorization strategy.
  - `{ apiKey: [] }` - matches the `BearerToken` strategy
  - `{ providerSession: [] }` - matches the `ProviderSessionToken` strategy
  - `{ clientSession: [] }` - matches the `ClientSessionToken` strategy

Models (`src/models`) are generic TypeBox schemas that are used to validate requests and responses.

Example:

```ts
// Model from models folder
const UserModal = Type.Object(
  {
    id: Type.Integer(),
    full_name: Type.String(),
    email: Type.String({ format: 'email' }),
    created_at: Type.String({ format: 'date-time' }),
    updated_at: Type.String({ format: 'date-time' }),
  },
  { $id: 'QBUser' },
)

// Schema for endpoint
const updateUserSchema = {
  tags: ['Users'],
  description: 'Update user by id',
  params: Type.Object({
    id: Type.Integer(),
  }),
  body: Type.Object({
    full_name: Type.String(),
    email: Type.String({ format: 'email' }),
  }),
  response: {
    200: Type.Ref(UserModal),
  },
  security: [{ apiKey: [] }] as Security,
}

// ...
```

## Services

A service is a set of functions that implement business logic for a particular entity.

`src/services` directory implements functionality for working with OpenAI and QuickBlox entities.

:::tip
Read more information on OpenAI integration in the [OpenAI](/dev/development/api/openai) section.
:::

## Routing

Routes define endpoints within your application.

In `src/routes` folder you should define all the routes that define the endpoints
of your web application.
Each service is a [Fastify plugin](https://www.fastify.io/docs/latest/Reference/Plugins/), it is
encapsulated (it can have its own independent plugins) and it is
typically stored in a file; be careful to group your routes logically,
e.g. all `/users` routes in a `users.js` file.

Folders prefixed with `_` will be turned into route parameters.

If you want to use mixed route parameters use a double underscore `__`.

```yaml
├── routes
├── __country-__language
│   │  └── actions.ts
│   └── users
│       ├── _id
│       │   └── actions.ts
│       ├── __country-__language
│       │   └── actions.ts
│       └── index.ts
└── app.ts
#
# routes/users/_id/actions.js will be loaded with prefix /users/:id
# routes/__country-__language/actions.js will be loaded with prefix /:country-:language

# curl http://localhost:3000/users/index
# { userIndex: [ { id: 7, username: 'example' } ] }

# curl http://localhost:3000/users/7/details
# { user: { id: 7, username: 'example' } }

# curl http://localhost:3000/be-nl
# { country: 'be', language: 'nl' }
```

If a single file become too large, create a folder and add a `index.js` file there:
this file must be a Fastify plugin, and it will be loaded automatically
by the application. You can now add as many files as you want inside that folder.
In this way you can create complex routes within a single monolith,
and eventually extract them.

If you need to share functionality between routes, place that
functionality into the `plugins` folder, and share it via
[decorators](https://www.fastify.io/docs/latest/Reference/Decorators/).

## Endpoints

All information on API endpoints can be found on the [API Server page](/api).
There you can download the OpenAPI specification and see the description of all available endpoints.

:::tip
When studying api endpoints, pay attention to Authorization methods, MIME Type and fields of the request body.

The Authorization section specifies the authorization method.
Each of the methods indicates which token should be passed in an `Authorization` HTTP header.
Authorization header must be in the format `Bearer <token>`.

There are 3 authorization methods available:

- `apiKey` - `BEARER_TOKEN` set in app config. Used for API integration.
- `providerSession` - provider session token.
- `clientSession` - client session token.

The Request section will specify the MIME Type of the request body:

- `application/json` - used to send json in the body of the request.
  Use header: `"Content-Type": "application/json"`.
- `multipart/form-data` - used to send files in the body request.
  Use [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) in JavaScript.

<Image src='/img/api-endpoints.jpg'/>

:::
