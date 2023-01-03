- [Start Guide](#start-guide)
  - [I - Install NodeJS](#i---install-nodejs)
  - [II - Register QuickBlox account](#ii---register-quickblox-account)
  - [III - Create QuickBlox application](#iii---create-quickblox-application)
  - [IV - Create a default provider](#iv---create-a-default-provider)
  - [V - Configure application](#v---configure-application)
  - [VI - Appointments](#vi---appointments)
  - [VII - Install dependencies](#vii---install-dependencies)
- [Available Scripts](#available-scripts)
  - [Start dev server](#start-dev-server-npm-start)
  - [Build application for Production](#build-application-for-production-npm-run-build)
  - [Check code](#check-code-npm-run-lint)
- [What to do next?](#⏩-what-to-do-next)

Before you start, there are a few things you need to know ahead.

## **Start Guide**

### I - Install NodeJS

First of all, in order to run/build this project, you will need [NodeJS](https://nodejs.org) and [npm](https://www.npmjs.com) (shipped with NodeJS). We suggest the **NodeJS 16+** version.

### II - Register QuickBlox account

Next, you need to have a QuickBlox account. You can sign up here: <https://admin.quickblox.com/signup>. Feel free to skip this step in case you already have an account.

### III - Create QuickBlox application

After registering the QuickBlox account, you need to create an application in your QuickBlox admin panel that will allow you to connect the Q-Consultation Lite app to the QuickBlox server. Follow the steps below:

1. Log into QuickBlox account (if you are not yet there) <https://admin.quickblox.com/signin>.
2. On the main page, click + sign to add a new application.
3. Fill in the required fields: **App title** and **App type**, and create app.

Once done, you will be redirected to the **Overview** page of your newly created application. There, you will find application credentials necessary to connect Q-Consultation application to the QuickBlox server. We will get back to them later.

![](/documentation/assets/start/001.png)
![](/documentation/assets/start/002.png)
![](/documentation/assets/start/003.png)

### IV - Create a default provider

The Q-Consultation app has two roles: Provider and Client.
Clients can register their own accounts via the Q-Consultation application.
However, the app doesn’t originally provide self-registration features for Providers.
A Provider should be created by the app administrator, you, via QuickBlox admin panel or QuickBlox API.

Currently, it’s important that you create one Provider for being a default Provider. If there is no default Provider, then the Client web application will constantly send API requests to the the QuickBlox server for the Provider to show as a default. Later, you are free to change this logic in the code.

In order to create a Provider, complete the steps bellow:

1. If you are on the **Overview** page of your QuickBlox application, go to the tab **Users**;
2. Choose **Add new user**.
3. Fill in user data (Full Name, email address or login, password, confirm password) and set a Tag `provider`, choose **Yes** for **I’m over 16** and click **Add user**.

When a user is created, it will show its ID. You will need this `user_id` later.

![](/documentation/assets/start/004.png)
![](/documentation/assets/start/005.png)
![](/documentation/assets/start/006.png)
![](/documentation/assets/start/007.png)

### V - Configure application

Now, let’s get back to the application credentials which you saw in the QuickBlox admin panel. In order to work correctly application need to know a set of configs.

In the project directory, you will find a **"qconsultation_config"** folder, and there is [**"config.json"**](/qconsultation_config/config.json) file.

You will need to update the following keys with your credentials:

```json
{
 // QuickBlox application Id
 "QB_SDK_CONFIG_APP_ID": -1,
 // QuickBlox application Auth Key
 "QB_SDK_CONFIG_AUTH_KEY": "",
 // QuickBlox application Auth Secret
 "QB_SDK_CONFIG_AUTH_SECRET": "",
 // QuickBlox account key
 "QB_SDK_CONFIG_ACCOUNT_KEY": "",
 // should QuickBlox JS SDK work in debug mode (logging enabled) (optional)
 "QB_SDK_CONFIG_DEBUG": false,
 // QuickBlox JS SDK custom API endpoint (optional if you use QuickBlox Basic Plan)
 "QB_SDK_CONFIG_ENDPOINTS_API": "",
 // QuickBlox JS SDK custom chat endpoint (optional if you use QuickBlox Basic Plan)
 "QB_SDK_CONFIG_ENDPOINTS_CHAT": "",
 // QuickBlox JS SDK custom ICE servers (optional if you use QuickBlox Basic Plan)
 "QB_SDK_CONFIG_ICE_SERVERS": [],
​
 // enable redux-logger
 "ENABLE_REDUX_LOGGER": false,
 // link to client's application (used for Share feature via SMS and via Copy-Paste)
 "CLIENT_APP_URL": "",
 // userId to assign new appointments by default
 "DEFAULT_PROVIDER_ID": -1,
 // user's tag to identify provider
 "PROVIDER_TAG": "provider",
 // default language (en / ua)
 "DEFAULT_LANGUAGE": "en",
 // file upload limit in bytes
 "FILE_SIZE_LIMIT": 104857600,
 // available for upload expansion files
 "FILE_EXTENSIONS_WHITELIST": "gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif"
}
```

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

### VII - Install dependencies

Then, you will need to clone the repository or download it as a zip archive.
Once you have cloned/dowloaded this repo you need to install dependencies running the following command in cmd:

```bash
npm install
```

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

See the section about [deployment] (https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Check code `npm run lint`

This will run code linting using [eslint](https://eslint.org) which will analyze code to find problematic patterns or code that doesn't adhere to certain style guidelines.

### Launch of integration pages `npm run pages`

This script allows you to run integration pages on <http://localhost:8000>.
You can read more about how to work with integration pages here: [Integration page](./INTEGRATION.md#integration-pages)

## ⏩ What to do next?

After you complete the step with running the project in develop mode, Client and Provider apps should be automatically open in your default browser. Now, your Q-Consultation app is ready to be used for your goals.

How to proceed with app integration, you can find detailed instructions here: ​[Integration Guide](./INTEGRATION.md).
