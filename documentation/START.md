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

[![Q-Consultation Lite: Application Launch Tutorial](/documentation/assets/start/video-tutorial.jpg)](https://www.youtube.com/watch?v=BOJZS_LFGFE)

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

You can also manually add the [**"config.json"**](/qconsultation_config/config.json) file to the **"qconsultation_config"** folder.

You will need to set the following keys with your credentials:

```json
{
 // [Required] QuickBlox application Id
 "QB_SDK_CONFIG_APP_ID": -1,
 // [Required] QuickBlox application Auth Key
 "QB_SDK_CONFIG_AUTH_KEY": "",
 // [Required] QuickBlox application Auth Secret
 "QB_SDK_CONFIG_AUTH_SECRET": "",
 // [Required] QuickBlox account key
 "QB_SDK_CONFIG_ACCOUNT_KEY": "",
 // Should QuickBlox JS SDK work in debug mode (logging enabled)
 "QB_SDK_CONFIG_DEBUG": false,
 // [Optional if you use QuickBlox Basic Plan] QuickBlox JS SDK custom API endpoint
 "QB_SDK_CONFIG_ENDPOINT_API": "",
 // [Optional if you use QuickBlox Basic Plan] QuickBlox JS SDK custom chat endpoint
 "QB_SDK_CONFIG_ENDPOINT_CHAT": "",
 // [Optional if you use QuickBlox Basic Plan] QuickBlox JS SDK custom ICE servers
 "QB_SDK_CONFIG_ICE_SERVERS": [],
​
 // Enable redux-logger
 "ENABLE_REDUX_LOGGER": false,
 // URL of the client application. Used by Share Link modal. (If not set, then Share Link will not be displayed in the application)
 "CLIENT_APP_URL": "",
 // [Required] Default language (en / ua)
 "DEFAULT_LANGUAGE": "en",
 // [Required] File upload limit in bytes
 "FILE_SIZE_LIMIT": 10485760,
 // [Required] Available for upload expansion files
 "FILE_EXTENSIONS_WHITELIST": "gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif"
}
```

_`[Required]` denotes that these variables must be set. Without them, the application will not work correctly._

_`[Optional if you use QuickBlox Basic Plan]` denotes that these variables may not be set only for the QuickBlox Basic Plan, otherwise they are required._

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

### VI - Appointments

To make online appointments work in the Q-Consultation app, it’s necessary to import an appointment schema file to the QuickBlox admin panel.

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

**provider_id** - QuickBlox user Id to whom Appointment is assigned to
**dialog_id** - QuickBlox dialog Id created for this Appointment
**records** - array of QuickBlox Content object Ids (call records for this Appointment)

If something goes wrong, you can also manually create a custom class in the way described below:

1. In the top-right corner, choose **List** of the **Custom** tab.
2. There, click **Add** and choose **Add new class** from the drop-down menu.

![](/documentation/assets/start/009.png)

3. A modal window will appear where you need to specify the class name **Appointment** and create the following fields:

```
  provider_id: Integer
  description: String
  priority: Integer
  notes: String
  dialog_id: String
  records: Integer_add
  conclusion: String
  language: String
  date_end: Date
  client_id: Integer
  date_start: Date
```

![](/documentation/assets/start/010.png)

4. After all the fields added, click **Create class**.
5. Once done, the modal window will close. You need to choose **Edit permission**, set the permissions as shown on the below screenshot and click **Edit permissions**:

![](/documentation/assets/start/011.png)

## Available Scripts

Now, you set up everything necessary to finally run the project. Below, we provide set of scripts that will help you run the project.

In the project directory, you can run:

### Start dev server `npm start`

Runs the app in a development mode.

The application will automatically open in the browser after running the `npm start` script.

- Provider: <https://localhost:3000>
- Client: <https://localhost:3001>

The page will reload if you make edits.

> NOTE: It is using self-signed certificate so your web-browser will likely warn you about untrusted certificate.

### Build application for Production `npm run build`

Builds the app for production. Artifacts will appear in `build` folder.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

> NOTE: Be sure to use HTTPS on the server, otherwise video calls will not work for you.

### Check code `npm run lint`

This will run code linting using [eslint](https://eslint.org) which will analyze code to find problematic patterns or code that doesn't adhere to certain style guidelines.

### Launch of integration pages `npm run pages`

This script allows you to run integration pages on <http://localhost:8000>.
You can read more about how to work with integration pages here: [Integration page](./INTEGRATION.md#integration-pages)

## ⏩ What to do next?

After you complete the step with running the project in develop mode, Client and Provider apps should be automatically open in your default browser. Now, your Q-Consultation app is ready to be used for your goals.

How to proceed with app integration, you can find detailed instructions here: ​[Integration Guide](./INTEGRATION.md).
