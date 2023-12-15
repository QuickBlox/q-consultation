---
sidebar_label: 'Project structure'
sidebar_position: 3
---

# Project structure

```yaml
. # root of the application
├──── node_modules # npm packages used by the project
├──── .yarn
│     └──── releases # contain the Yarn releases used
│           └ yarn-3.6.3.cjs
├──── apps
│     ├──── api # package with API application
│     │     ├──── node_modules # npm packages used by the package
│     │     ├──── dist # build of the package
│     │     ├──── src # business logic of the package split into subfolders per API
│     │     │     ├──── constants
│     │     │     ├──── models
│     │     │     ├──── plugins
│     │     │     ├──── routes
│     │     │     ├──── services
│     │     │     ├──── types
│     │     │     ├──── utils
│     │     │     └ app.ts
│     │     │
│     │     ├ .eslintignore
│     │     ├ .eslintrc
│     │     ├ package.json
│     │     └ tsconfig.json
│     │
│     ├──── client # package with Client application
│     │     ├──── node_modules # npm packages used by the package
│     │     ├──── dist # build of the package
│     │     ├──── public # files accessible to the outside world
│     │     ├──── src
│     │     │     ├──── actionCreators # Redux action creators
│     │     │     ├──── actions # Redux action types
│     │     │     ├──── components # reusable components
│     │     │     │     └──── (component-name)
│     │     │     │           ├ index.tsx # UI part of the component
│     │     │     │           ├ styles.css
│     │     │     │           └ useComponent.ts # functional part of the component
│     │     │     │
│     │     │     ├──── hooks # custom React hooks
│     │     │     ├──── icons # SVG icons
│     │     │     ├──── modules # components with business logic
│     │     │     │     ├──── modals
│     │     │     │     └──── (module-name)
│     │     │     │           ├ index.tsx UI part of the component
│     │     │     │           ├ styles.css
│     │     │     │           └ useComponent.ts # functional part of the component
│     │     │     │
│     │     │     ├──── qb-api-calls
│     │     │     │     └ index.ts # service for working with QuickBlox SDK
│     │     │     │
│     │     │     ├──── reducers # Redux reducers
│     │     │     ├──── sagas # Redux sagas
│     │     │     ├──── screen # React pages
│     │     │     │     ├──── (screen-name)
│     │     │     │     │     ├ index.tsx UI part of the component
│     │     │     │     │     ├ styles.css
│     │     │     │     │     └ useComponent.ts # functional part of the component
│     │     │     │     │
│     │     │     │     └ index.tsx
│     │     │     │
│     │     │     ├──── selectors # Redux selectors
│     │     │     ├──── store
│     │     │     │     └ index.ts # Redux store
│     │     │     │
│     │     │     ├──── types
│     │     │     ├──── utils
│     │     │     │
│     │     │     ├ App.tsx
│     │     │     ├ global.d.ts
│     │     │     ├ i18n.ts
│     │     │     ├ index.css
│     │     │     ├ index.tsx
│     │     │     ├ serviceWorker.ts
│     │     │     └ variables.css
│     │     │
│     │     ├ .eslintignore
│     │     ├ .eslintrc
│     │     ├ package.json
│     │     ├ tsconfig.json
│     │     └ webpack.config.js
│     │
│     ├──── provider # package with Provider application
│     │     ├──── node_modules # npm packages used by the package
│     │     ├──── dist # build of the package
│     │     ├──── public # files accessible to the outside world
│     │     ├──── src
│     │     │     ├──── actionCreators # Redux action creators
│     │     │     ├──── actions # Redux action types
│     │     │     ├──── components # reusable components
│     │     │     │     └──── (component-name)
│     │     │     │           ├ index.tsx # UI part of the component
│     │     │     │           ├ styles.css
│     │     │     │           └ useComponent.ts # functional part of the component
│     │     │     │
│     │     │     ├──── hooks # custom React hooks
│     │     │     ├──── icons # SVG icons
│     │     │     ├──── modules # components with business logic
│     │     │     │     ├──── modals
│     │     │     │     └──── (module-name)
│     │     │     │           ├ index.tsx # UI part of the component
│     │     │     │           ├ styles.css
│     │     │     │           └ useComponent.ts # functional part of the component
│     │     │     │
│     │     │     ├──── qb-api-calls
│     │     │     │     └ index.ts # service for working with QuickBlox SDK
│     │     │     │
│     │     │     ├──── reducers # Redux reducers
│     │     │     ├──── sagas # Redux sagas
│     │     │     ├──── screen # React pages
│     │     │     │     ├──── (screen-name)
│     │     │     │     │     ├ index.tsx # UI part of the component
│     │     │     │     │     ├ styles.css
│     │     │     │     │     └ useComponent.ts # functional part of the component
│     │     │     │     │
│     │     │     │     └ index.tsx
│     │     │     │
│     │     │     ├──── selectors # Redux selectors
│     │     │     ├──── store
│     │     │     │     └ index.ts # Redux store
│     │     │     │
│     │     │     ├──── types
│     │     │     ├──── utils
│     │     │     │
│     │     │     ├ App.tsx
│     │     │     ├ global.d.ts
│     │     │     ├ i18n.ts
│     │     │     ├ index.css
│     │     │     ├ index.tsx
│     │     │     ├ serviceWorker.ts
│     │     │     └ variables.css
│     │     │
│     │     ├ .eslintignore
│     │     ├ .eslintrc
│     │     ├ package.json
│     │     ├ tsconfig.json
│     │     └ webpack.config.js
│     │
│     └──── integration-pages # package with demo integration pages
│           ├──── node_modules # npm packages used by the package
│           ├──── healthcare_files
│           ├──── recruting_files
│           │
│           ├ healthcare.html
│           ├ recruting.html
│           ├ index.html
│           └ package.json
│
├──── packages
│     ├──── bin # package with some scripts
│     │     ├ config.js # script to get config for client and provider apps
│     │     ├ initConfig.js # script to generate config
│     │     ├ initSchema.js # script to schema upload
│     │     └ package.json
│     │
│     ├──── icons # package with all icons
│     │     ├──── (category)
│     │     │     └ (icon).svg
│     │     │
│     │     └ package.json
│     │
│     └──── templates # package with all themes and translations
│           ├──── (template)
│           │     ├──── assets
│           │     │     ├ favicon.ico
│           │     │     ├ logo.svg
│           │     │     ├ logo192.png
│           │     │     └ logo512.png
│           │     │
│           │     ├──── transcriptions
│           │     │     ├ (lang).json
│           │     │     └ index.ts
│           │     │
│           │     └ variables.css
│           │
│           ├ index.d.ts
│           └ package.json
│
├──── documentation # package with Documentation
│     ├──── .docusaurus # files used to build
│     ├──── node_modules # npm packages used by the package
│     ├──── docs
│     │     ├──── dev
│     │     └──── snippets
│     │
│     ├──── i18n
│     │     └──── (lang-code)
│     │           └ code.json
│     │
│     ├──── src
│     │     ├──── components
│     │     ├──── css
│     │     └──── theme
│     │
│     ├──── static # files accessible to the outside world
│     │
│     ├ .eslintignore
│     ├ .eslintrc
│     ├ babel.config.js
│     ├ docusaurus.config.js
│     ├ package.json
│     ├ sidebars.js
│     └ tsconfig.json
│
├ .env # application config
├ .editorconfig
├ .gitignore
├ .prettierignore
├ .prettierrc
├ .yarnrc.yml
├ lerna.json
├ LICENSE
├ package.json
├ README.md
├ schema.yml # QuickBlox schema
└ yarn.lock
```
