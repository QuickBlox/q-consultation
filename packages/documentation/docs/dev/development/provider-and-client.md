---
sidebar_label: 'Provider & Client application'
sidebar_position: 2
---

# Provider & Client application

:::info Prerequisites

- **Programming language**: [TypeScript](https://www.typescriptlang.org/)
- **Chat & Video calling platform**: [QuickBlox](https://docs.quickblox.com/)
- **UI library**: [React](https://react.dev/)
- **Navigational library**: [React Router](https://v5.reactrouter.com/)
- **Managing application state**: [Redux](https://redux.js.org/), [Redux-Saga](https://redux-saga.js.org/)
- **Internationalization libraries**: [i18next](https://www.i18next.com/), [react-i18next](https://react.i18next.com/)
- **Date library**: [Moment.js](https://momentjs.com/)
- **Utility library**: [Lodash](https://lodash.com/)
- **Code Linting**: [Prettier](https://prettier.io/), [ESLint](https://eslint.org/)
- **Application bundler**: [Webpack](https://webpack.js.org/)

:::

## Structure

In the packages directory there are 2 React applications similar in structure: provider and client.

```yaml
packages
└──── (provider or client)
      ├──── node_modules # npm packages used by the package
      ├──── build # build of the package
      ├──── public # files accessible to the outside world
      ├──── src
      │     ├──── actionCreators # Redux action creators
      │     ├──── actions # Redux action types
      │     ├──── components # reusable components
      │     │     └──── (component-name)
      │     │           ├ index.tsx # UI part of the component
      │     │           ├ styles.css
      │     │           └ useComponent.ts # functional part of the component
      │     │
      │     ├──── hooks # custom React hooks
      │     ├──── icons # SVG icons
      │     ├──── modules # components with business logic
      │     │     ├──── modals
      │     │     └──── (module-name)
      │     │           ├ index.tsx # UI part of the component
      │     │           ├ styles.css
      │     │           └ useComponent.ts # functional part of the component
      │     │
      │     ├──── qb-api-calls
      │     │     └ index.ts # service for working with QuickBlox SDK
      │     │
      │     ├──── reducers # Redux reducers
      │     ├──── sagas # Redux sagas
      │     ├──── screen # React pages
      │     │     ├──── (screen-name)
      │     │     │     ├ index.tsx # UI part of the component
      │     │     │     ├ styles.css
      │     │     │     └ useComponent.ts # functional part of the component
      │     │     │
      │     │     └ index.tsx
      │     │
      │     ├──── selectors # Redux selectors
      │     ├──── store
      │     │     └ index.ts # Redux store
      │     │
      │     ├──── transcriptions
      │     │     ├ (lang).json
      │     │     └ index.ts
      │     │
      │     ├──── utils
      │     │
      │     ├ App.tsx
      │     ├ global.d.ts
      │     ├ i18n.ts
      │     ├ index.css
      │     ├ index.tsx
      │     ├ serviceWorker.ts
      │     └ variables.css
      │
      ├ .eslintignore
      ├ .eslintrc
      ├ package.json
      ├ tsconfig.json
      └ webpack.config.js
```

## Screens, Modules and Components

UI is divided into 3 parts: **Screens**, **Modules** and **Components**.
Each of this part is a React component and includes JSX (`index.tsx`), styles (`styles.css`) and functional part (`useComponent.ts`).

**Components** are the smallest UI parts of an application.
These include only reusable components that do not have global state (Redux Store) and do not affect the business logic of the application.
They get all the necessary data through props.

**Modules** can also be reusable, but they already have access to the global state or affect the business logic of the proposal.

**Screens** are essentially application pages. They can combine several modules and also have access to the global state and can affect the business logic of the application.

## Routing

Routing and navigation through the application is implemented using the [React Router](https://v5.reactrouter.com/) library.

The main part of the routing logic is implemented in the **RootRoute** screen (`src/screens/index.tsx`),
where the **QuickBlox SDK** is initialized and the application's public and private routes are separated.
All private routes are located in the **RootScreen** and contain the bulk of the application's business logic.
Public routes represent the authorization and registration of users.

## Redux

[Redux](https://redux.js.org/) is a structured approach for storing and updating application state.

The Redux part of the app consists of **Store**, **Actions**, **Action creators**, **Reducers** and **Sagas**.

Store is the global store/state of the application.

Actions are simple objects that represent a payload that sends data from the application to the store.

An action creator is a function that returns an action object.

Reducer is a pure function that takes the previous state and action as arguments and returns the new state.
Reducers define how the application's state changes in response to actions sent to the store.

Sagas are generator functions that allow you to process actions.
With the help of them, the main part of the business logic of the application is implemented.

## App styling

You can fully customize the application style settings. Most used colors are defined as css variables in `src/variables.css` in every packages.​

The main set of variables are the following:

| Variable   | Value              | Description                                     |
| ---------- | ------------------ | ----------------------------------------------- |
| --grey-10  | rgba(0, 0, 0, 0.4) | Shadow for header and notifications             |
| --grey-11  | rgba(0, 0, 0, 0.8) | Backdrop color for modal dialogs                |
| --blue-3   | #CCD0D9            | Border color                                    |
| --blue-9   | #3978FC            | Theme main color                                |
| --blue-5   | #99A9C6            | Theme secondary color                           |
| --grey-8   | #333333            | Primary text                                    |
| --blue-7   | #6C7A92            | Secondary text                                  |
| --red-4    | red                | Errors text                                     |
| --red-5    | #FF4B4B            | Color for high priority button / notification   |
| --green-5  | #00C248            | Color for medium priority button / notification |
| --orange-4 | #FFBE30            | Color for low priority button / notification    |

Svg file is used as a logo. This file can be found in `src/icons` directory in every packages.

The logo is only used in the Header component.
When replacing a logo, it may be necessary to change the height of your logo.
To change the height of the logo, you need to change the value of the css variable `--HeaderLogo-height`

## Internationalization

The [react-i18next](https://react.i18next.com) library was used to implement the translations.

Translations can be found in `src/translations` directory in every packages.​

You can add text here with new languages.
After adding new languages, be sure to include them in the i18next configuration files (`src/i18n.ts`).
