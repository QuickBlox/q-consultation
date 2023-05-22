- [Requirements](#requirements)
- [Start Guide](#start-guide)
  - [I - Install NodeJS](#i---install-nodejs)
  - [II - Install dependencies](#ii---install-dependencies)
  - [III - Register QuickBlox account](#iii---register-quickblox-account)
  - [IV - Create QuickBlox application](#iv---create-quickblox-application)
  - [V - Configure application](#v---configure-application)
  - [VI - Appointments](#vi---appointments)
- [Available Scripts](#available-scripts)
  - [Start dev server](#start-dev-server-npm-start)
  - [Build application for Production](#build-application-for-production-npm-run-build)
  - [Check code](#check-code-npm-run-lint)
- [What to do next?](#⏩-what-to-do-next)

[![Q-Consultation Lite: Application Launch Tutorial](/documentation/assets/start/video-tutorial.jpg)](https://youtu.be/-nEoba8vq_I)

Before you start, there are a few things you need to know ahead.

## Requirements

**Supported operating systems**:

- Windows 10
- macOS Mojave
- Ubuntu LTS/Debian 9.x

**Node:**

- NodeJS >= 16 <= 18
- NPM >= 8.x

**Supported browsers:**

- Desktop
  - Chrome: `(Current - 1) and Current`
  - Edge: `(Current - 1) and Current`
  - Firefox: `(Current - 1) and Current`
  - Safari: `(Current - 1) and Current`
  - Opera: `(Current - 1) and Current`
- Mobile
  - Chrome: `(Current - 1) and Current`
  - Firefox: `(Current - 1) and Current`
  - Safari: `(Current - 1) and Current`

_`(Current - 1) and Current` denotes that we support the current stable version of the browser and the version that preceded it. For example, if the current version of a browser is 24.x, we support the 24.x and 23.x versions._

> Please note that Q-Consultation Lite may work on other browsers and operating systems, but these are not tested nor officially supported at this time.

## **Start Guide**

### I - Install NodeJS

First of all, in order to run/build this project, you will need [NodeJS](https://nodejs.org) and [npm](https://www.npmjs.com) (shipped with NodeJS). We suggest the **NodeJS 16+** version.

### II - Install dependencies

Then, you will need to clone the repository or download it as a zip archive.
Once you have cloned/dowloaded this repo you need to install dependencies running the following command in cmd:

```bash
npm install
```

### III - Register QuickBlox account

Next, you need to have a QuickBlox account. You can sign up here: <https://admin.quickblox.com/signup>. Feel free to skip this step in case you already have an account.

### IV - Create QuickBlox application

After registering the QuickBlox account, you need to create an application in your QuickBlox admin panel that will allow you to connect the Q-Consultation Lite app to the QuickBlox server. Follow the steps below:

1. Log into QuickBlox account (if you are not yet there) <https://admin.quickblox.com/signin>.
2. On the main page, click + sign to add a new application.
3. Fill in the required fields: **App title** and **App type**, and create app.

Once done, you will be redirected to the **Overview** page of your newly created application. There, you will find application credentials necessary to connect Q-Consultation application to the QuickBlox server. We will get back to them later.

![](/documentation/assets/start/001.png)
![](/documentation/assets/start/002.png)
![](/documentation/assets/start/003.png)

> You can read more about working with applications here: <https://docs.quickblox.com/docs/application>

### V - Configure application

Now, let’s get back to the application credentials which you saw in the QuickBlox admin panel. In order to work correctly application need to know a set of configs.

You can create a configuration file by running this command and following the instructions in the terminal:

```bash
npm run init:config
```

![](/documentation/assets/start/config.jpeg)

You can also manually add the [**".env"**](/qconsultation_config/.env) file to the **"qconsultation_config"** folder.

You will need to set the following keys with your credentials:

```
 # [Required] QuickBlox application Id
 QB_SDK_CONFIG_APP_ID=-1
 # [Required] QuickBlox application Auth Key
 QB_SDK_CONFIG_AUTH_KEY=""
 # [Required] QuickBlox application Auth Secret
 "QB_SDK_CONFIG_AUTH_SECRET=""
 # [Required] QuickBlox account key
 QB_SDK_CONFIG_ACCOUNT_KEY=""
 # Should QuickBlox JS SDK work in debug mode (logging enabled)
 QB_SDK_CONFIG_DEBUG=false
 # QuickBlox JS SDK custom API endpoint
 QB_SDK_CONFIG_ENDPOINT_API="api.quickblox.com"
 # QuickBlox JS SDK custom chat endpoint
 QB_SDK_CONFIG_ENDPOINT_CHAT="chat.quickblox.com"
 # [Optional if you use QuickBlox Basic Plan] QuickBlox JS SDK custom ICE servers
 QB_SDK_CONFIG_ICE_SERVERS=[]
 # [Required if you need integration with your API] Bearer token
 BEARER_TOKEN=""
 # [Required if you need integration with your API] QuickBlox account owner email
 QB_ADMIN_EMAIL=""
 # [Required if you need integration with your API] QuickBlox account owner password
 QB_ADMIN_PASSWORD=""
 # [Required if you need AI features] OpenAI API Key
 OPENAI_API_KEY=""
 # Enable AI Quick answer feature
 AI_QUICK_ANSWER=true
 # Enable AI Suggest provider feature
 AI_SUGGEST_PROVIDER=true
 # Enable AI Record analytics feature
 AI_RECORD_ANALYTICS=true
 # Enable redux-logger
 ENABLE_REDUX_LOGGER=false
 # URL of the client application. Used by Share Link modal. (If not set, then Share Link will not be displayed in the application)
 CLIENT_APP_URL="https://localhost:3001"
 # URL API.
 SERVER_APP_URL="http://localhost:4000"
 # Default language (en / ua)
 DEFAULT_LANGUAGE="en"
 # File upload limit in bytes
 FILE_SIZE_LIMIT=10485760
 # Available for upload expansion files
 FILE_EXTENSIONS_WHITELIST="gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif"
```

_`[Required]` denotes that these variables must be set. Without them, the application will not work correctly._

_`[Optional if you use QuickBlox Basic Plan]` denotes that these variables may not be set only for the QuickBlox Basic Plan, otherwise they are required._

_`[Required if you need integration with your API]` denotes that these variables must be set to enable integration with your API. Enabling this integration will make it easier to work with available queries from your API._

_`[Required if you need AI features]` denotes that these variables must be set to enable and operate the AI feature.._

> NOTE: `FILE_SIZE_LIMIT` is used to initially check the size of uploaded files and display an error if it is exceeded. Modify it according to the limitations of your QuickBlox Plan.
>
> | Basic | Startup | Growth | HIPAA | Enterprise                                                      |
> | ----- | ------- | ------ | ----- | --------------------------------------------------------------- |
> | 10 Mb | 25 Mb   | 50 Mb  | 50 Mb | [Contact our sales team](https://quickblox.com/enterprise/#get) |

If you have QuickBlox Basic plan (Shared server), you can skip the following step. In case you have QuickBlox Enterprise plan, to specify custom Ice Servers instead of default ones you can set value for key **"QB_SDK_CONFIG_ICE_SERVERS"**:

```json
[
  {
    "urls": "stun:stun.services.mozilla.com",
    "username": "louis@mozilla.com",
    "credential": "webrtcdemo"
  },
  {
    "urls": ["stun:stun.example.com", "stun:stun-1.example.com"]
  }
]
```

For more details on the format see [RTCIceServer docs](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer).

### VI - Schema

To make online appointments and video records work in the Q-Consultation app, it’s necessary to import an appointment schema file to the QuickBlox admin panel.

You can add the schema automatically by running this command and following the instructions in the terminal.

```bash
npm run init:schema
```

![](/documentation/assets/start/schema.jpeg)

> If you have created a QuickBlox account via Google or GitHub and you do not have a password, then this option for adding a schema is not suitable for you and you need to add it manually.

You can also add a scheme manually through the [Admin Panel](https://admin.quickblox.com).

You will find the [**schema.yml**](/qconsultation_config/schema.yml) file in the **qconsultation_config** folder of the project directory.

To import this file to the QuickBlox admin panel, follow the steps below:

1. If you have the QuickBlox application open in the admin panel, go to the tab **Custom**.
2. In the top-right corner, you will find the **Import** tab.
3. There, click **Browse** for the **Import schema File**.
4. Once the file is added, click **Import Schema**.

![](/documentation/assets/start/008.png)

If something goes wrong, you can also manually create a custom class (**Appointment** and **Record**) in the way described below:

1. In the top-right corner, choose **List** of the **Custom** tab.
2. There, click **Add** and choose **Add new class** from the drop-down menu.

![](/documentation/assets/start/009.png)

3. A modal window will appear where you need to specify the class name and create and create its fields:

Appointment

```
  provider_id: Integer
  client_id: Integer
  dialog_id: String
  description: String
  priority: Integer
  notes: String
  conclusion: String
  language: String
  date_end: Date
```

![](/documentation/assets/start/010.png)

Record

```
  name: String
  appointment_id: String
  transcription: String_a
  summary: String
  actions: String
  uid: String
```

![](/documentation/assets/start/012.jpg)

4. After all the fields added, click **Create class**.
5. Once done, the modal window will close. You need to choose **Edit permission**, set the permissions as shown on the below screenshot and click **Edit permissions**:

Appointment
![](/documentation/assets/start/011.png)

Record
![](/documentation/assets/start/013.jpg)

## Available Scripts

Now, you set up everything necessary to finally run the project. Below, we provide set of scripts that will help you run the project.

In the project directory, you can run:

### Start dev server `npm run dev`

Runs the app in a development mode.

The application will automatically open in the browser after running the `npm run dev` script.

- API: <http://localhost:4000>
- Provider: <https://localhost:3000>
- Client: <https://localhost:3001>

The page will reload if you make edits.

> NOTE: It is using self-signed certificate so your web-browser will likely warn you about untrusted certificate.

### Build application for Production `npm run build`

Builds the app for production. Artifacts will appear in `build` folder.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

> NOTE: Be sure to use HTTPS on the server, otherwise video calls will not work for you.

### Start API server for Production `npm run start:api`

Runs the API server in a production mode.

### Check code `npm run lint`

This will run code linting using [eslint](https://eslint.org) which will analyze code to find problematic patterns or code that doesn't adhere to certain style guidelines.

### Launch of integration pages `npm run start:pages`

This script allows you to run integration pages on <http://localhost:8000>.
You can read more about how to work with integration pages here: [Integration page](./INTEGRATION.md#integration-pages)

## ⏩ What to do next?

After you complete the step with running the project in develop mode, Client and Provider apps should be automatically open in your default browser. Now, your Q-Consultation app is ready to be used for your goals.

How to proceed with app integration, you can find detailed instructions here: ​[Integration Guide](./INTEGRATION.md).
