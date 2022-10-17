# **Q-Consultation**

## **Requirements**

In order to run / build this project you will need [NodeJS](https://nodejs.org) and [npm](https://www.npmjs.com) (shipped with NodeJS)

Once you have cloned this repo you need to install dependencies:

```bash
npm install
```

## **Configure application**

In order to work correctly application need to know a set of configs.

Create a folder "**`qconsultation_config`**" at the root of the project and put there a file "**`config.json`**". This file will be used by the application as a configuration file.

It should contain the following keys:

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
  // QuickBlox JS SDK custom API endpoint (optional)
  "QB_SDK_CONFIG_ENDPOINTS_API": "",
  // QuickBlox JS SDK custom chat endpoint (optional)
  "QB_SDK_CONFIG_ENDPOINTS_CHAT": "",
  // QuickBlox JS SDK custom ICE servers (optional)
  "QB_SDK_CONFIG_ICE_SERVERS": [],

  // enable redux-logger
  "ENABLE_REDUX_LOGGER": false,
  // link to client's application (used for Share feature via SMS and via Copy-Paste)
  "CLIENT_APP_URL": "",
  // userId to assign new appointments by default
  "DEFAULT_PROVIDER_ID": -1,
  // user's tag to identify provider
  "PROVIDER_TAG": "provider",
  // default language
  "DEFAULT_LANGUAGE": "",
  // file upload limit in bytes
  "FILE_SIZE_LIMIT": 104857600,
  // available for upload expansion files
  "FILE_EXTENSIONS_WHITELIST": "gif jpeg jpg mov mp4 png csv docx pdf pptx txt xls xlsx zip webm heic heif"
}
```

To specify custom Ice Servers instead of default ones you can set value for key "**`QB_SDK_CONFIG_ICE_SERVERS`**":

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

For more details on format see [RTCIceServer docs](https://developer.mozilla.org/en-US/docs/Web/API/RTCIceServer).

## **Styling**

Most used colors are defined as css variables in `src/variables.css` in every packages.

- `packages/client/src/variables.css`
- `packages/provider/src/variables.css`

### **Custom Object**

Custom Object (Appointment) schema used in this application:

```yaml
---
qb_schema:
  custom_class_Appointment:
    name: Appointment
    fields:
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
    permissions:
      read:
        access: open
        primary: true
      update:
        access: open
        primary: true
      delete:
        access: open
      create:
        access: open
        primary: true
```

**provider_id** - QuickBlox user Id to whom Appointment is assigned to  
**dialog_id** - QuickBlox dialog Id created for this Appointment  
**records** - array of QuickBlox Content object Ids (call records for this Appointment)

## **Available Scripts**

In the project directory, you can run:

### **Check code** `npm run lint`

This will run code linting using [eslint](https://eslint.org) which will analyse code to find problematic patterns or code that doesn't adhere to certain style guidelines.

### **Start dev server** `npm start`

Runs the app in the development mode.

The application will automatically open in the browser

- Provider: [https://0.0.0.0:3000](https://0.0.0.0:3000)
- Client: [https://0.0.0.0:3001](https://0.0.0.0:3001)

The page will reload if you make edits.

NOTE: It is using self-signed certificate so your web-browser will likely warn you about untrusted certificate.

### **Build application** `npm run build`

Builds the app for production. Artifacts will appear in `build` folder.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

---

You can read more information on how the application works in the [Instructions](/documentation/INSTRUCTION.md).
