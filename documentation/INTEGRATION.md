# **Integration Guide**

- [Authentication](#authentication)
  - [Initialization](#Initialization)
  - [Create session](#create-session)
  - [Create user](#create-user)
  - [Login user](#login-user)
- [Waiting room / Live queue](#waiting-room--live-queue)
  - [Create Dialog](#create-dialog)
  - [Create Custom Object (Appointment)](#create-custom-object-appointment)
  - [Connect to Chat server](#connect-to-chat-server)
  - [Send System message](#send-system-message)
- [App styling](#app-styling)
- [Integration pages](#integration-pages)

## Authentication

![](/documentation/assets/integration/004.png)

### Initialization

To integrate with Q-Consultation, you first need to initialize the **QuickBlox SDK**.

- iOS: <https://docs.quickblox.com/docs/ios-setup>
- Android: <https://docs.quickblox.com/docs/android-setup>
- JS: <https://docs.quickblox.com/docs/js-setup>
- ReactNative: <https://docs.quickblox.com/docs/react-native-setup>
- Flutter: <https://docs.quickblox.com/docs/flutter-setup>

### Create session

The next step is to create a session. This must be done before login or create user.

- iOS: <https://docs.quickblox.com/docs/ios-users#create-user>
- Android: <https://docs.quickblox.com/docs/android-users#create-user>
- JS: <https://docs.quickblox.com/docs/js-users#create-user>
- React Native: <https://docs.quickblox.com/docs/react-native-users#create-user>
- Flutter: <https://docs.quickblox.com/docs/flutter-users#create-user>

After login, you can use the session token to go to any Q-Consultation page without authorization on the site.

Routes:

- **https://client-website.com/[pathname]?token=[session_token]**
- **https://provider-website.com/[pathname]?token=[session_token]**

`[pathname]` is the path to a specific Q-Consultation page

`[session_token]` is the token from session (<https://docs.quickblox.com/reference/session-model>)

### Create user

![](/documentation/assets/integration/005.png)
**Sign Up** page in the client application

You can **create a user** on the **Sign Up** page in the client application, but you can create it outside the application using the API or SDK.

Routes:

- **https://client-website.com/signup**

User object schema: <https://docs.quickblox.com/reference/user-model>

![](/documentation/assets/integration/006.png)

There are 2 types of users in Q-Consultation: `client` and `provider`.

To create a `provider`, you need to set `user_tags` to `provider` value. For a `provider`, you can fill in the `custom_data` fields (optional): `description`, `language`, `avatar`.

To create a client, you need to leave the `user_tags` field empty. For a client, you can fill in the `custom_data` fields (optional): `address`, `birthdate`, `gender`, `language`, `avatar`.

`custom_data` is an JSON object converted to a string

- iOS: <https://docs.quickblox.com/docs/ios-users#create-user>
- Android: <https://docs.quickblox.com/docs/android-users#create-user>
- JS: <https://docs.quickblox.com/docs/js-users#create-user>
- React Native: <https://docs.quickblox.com/docs/react-native-users#create-user>
- Flutter: <https://docs.quickblox.com/docs/flutter-users#create-user>

### Login user

![](/documentation/assets/integration/007.png)

**Sign In** page in the client application

![](/documentation/assets/integration/008.png)

**Sign In** page in the provider application

You can **login** to the application on the **Sign In** page in the client and provider applications, or you can do it outside the application using the API or SDK.

Routes:

- **https://client-website.com/login**
- **https://provider-website.com/login**

To be able to work with all the data, you need to log in as a user.

- iOS: <https://docs.quickblox.com/docs/ios-authentication#log-in-user>
- Android: <https://docs.quickblox.com/docs/android-authentication#log-in-user>
- JS: <https://docs.quickblox.com/docs/js-authentication#log-in-user>
- React Native: <https://docs.quickblox.com/docs/react-native-authentication#log-in-user>
- Flutter: <https://docs.quickblox.com/docs/flutter-authentication#log-in-user>

## Waiting room / Live queue

**Appointments** created by client or provider are placed in a **Live queue** with the selected provider. The client is waiting for a response from the provider in the **Waiting room**.

![](/documentation/assets/integration/009.png)

Waiting room

![](/documentation/assets/integration/010.png)

Live queue

Routes:

- **https://client-website.com/appointment/[appointment_id]**
- **https://provider-website.com/queue/[appointment_id]**

To create an **Appointment** in Q-Consultation, it is imperative to create a `Dialog`, then create a `Custom object (Appointment)`. If you need to notify your opponent about the created `Appointment`, then you need to send `System messages` to your opponent (for this you need to be connected to the chat)

![](/documentation/assets/integration/011.png)

### Create Dialog

Need to create a **group** Dialog with the user

- iOS: <https://docs.quickblox.com/docs/ios-chat-dialogs#create-dialog>
- Android: <https://docs.quickblox.com/docs/android-chat-dialogs#create-dialog>
- JS: <https://docs.quickblox.com/docs/js-chat-dialogs#create-dialog>
- React Native: <https://docs.quickblox.com/docs/react-native-chat-dialogs#create-dialog>
- Flutter: <https://docs.quickblox.com/docs/flutter-chat-dialogs#create-dialog>

### Create Custom Object (Appointment)

`Appointment` is a Custom Object class(<https://docs.quickblox.com/reference/custom-objects>) with the next fields:

```
client_id: int // Client id(QB user id) to whom this appointment is scheduled

provider_id: int // Provider id(QB user id) to whom this appointment is scheduled

dialog_id: string // QB group dialog id associated with this appointment

description: string // Contains description for appointment

date_end: datetime // Appointment end date in ISO format

date_start: datetime // Appointment start date in ISO format

priority: int // may be 0,1 or 2, 0 - lowest

notes: string // Notes created by provider

conclusion: string // The conclusion from the provider

language: string // Language conclusion

records: int[] // Array of recorded files ids
```

When creating an `Appointment`, it is necessary to specify the fields: `client_id`, `provider_id`, `dialog_id`, `description`.

![](/documentation/assets/integration/012.png)

- iOS: <https://docs.quickblox.com/docs/ios-custom-objects#create-records>
- Android: <https://docs.quickblox.com/docs/android-custom-objects#create-records>
- JS: <https://docs.quickblox.com/docs/js-custom-objects#create-records>
- React Native: <https://docs.quickblox.com/docs/react-native-custom-objects#create-records>
- Flutter: <https://docs.quickblox.com/docs/flutter-custom-objects#create-records>

### Connect to Chat server

In order to send **System messages** and **Messages to Dialog**, you need to connect to the chat

- iOS: <https://docs.quickblox.com/docs/ios-chat-connection#connect-to-chat-server-with-quickblox-session-token>
- Android: <https://docs.quickblox.com/docs/android-chat-connection#connect-to-chat-server-with-quickblox-session-token>
- JS: <https://docs.quickblox.com/docs/js-chat-connection#connect-to-chat-server-with-quickblox-session-token>
- React Native: <https://docs.quickblox.com/docs/react-native-chat-connection#connect-to-chat-server>
- Flutter: <https://docs.quickblox.com/docs/flutter-chat-connection#connect-to-chat-server>

### Send System message

After creating an `Appointment`, you can send 2 system messages to your opponent.

The first system message must be sent with the parameters: `notification_type`(value: `"DIALOG"`) and `dialog_id`. This system message tells the opponent to get this `Dialog` and connect to it.

The second system message must be sent with the parameters: `notification_type`(value: `"APPOINTMENT"`) and `appointment_id`. This system message tells the opponent to get this `Appointment`.

- iOS: <https://docs.quickblox.com/docs/ios-chat-messaging#send-system-messages>
- Android: <https://docs.quickblox.com/docs/android-chat-messaging#send-system-messages>
- JS: <https://docs.quickblox.com/docs/js-chat-messaging#send-system-messages>
- React Native: <https://docs.quickblox.com/docs/react-native-chat-messaging#send-system-messages>
- Flutter: <https://docs.quickblox.com/docs/flutter-chat-messaging#send-system-messages>

## App styling

You can fully customize the application style settings. Most used colors are defined as css variables in `src/variables.css` in every packages.​

- [packages/client/src/variables.css](/packages/client/src/variables.css)
- [packages/provider/src/variables.css](/packages/provider/src/variables.css)

The main set of variables are the following:
Variable | Value | Description
---------- | ------------------ | -----------------------------------------------
--grey-10 | rgba(0, 0, 0, 0.4) | Shadow for header and notifications
--grey-11 | rgba(0, 0, 0, 0.8) | Backdrop color for modal dialogs
--blue-3 | #CCD0D9 | Border color
--blue-9 | #3978FC | Theme main color
--blue-5 | #99A9C6 | Theme secondary color
--grey-8 | #333333 | Primary text
--blue-7 | #6C7A92 | Secondary text
--red-4 | red | Errors text
--red-5 | #FF4B4B | Color for high priority button / notification
--green-5 | #00C248 | Color for medium priority button / notification
--orange-4 | #FFBE30 | Color for low priority button / notification

## Integration pages

Integration pages are examples of how you can interact with the Q-Consultation application.
Now the integration pages use links that lead to the provider's profile.

Link: https://localhost:3001/providers/[provider_id]

In this link, you need to replace `[provider_id]` with the id of the previously created provider.

To run the integration pages locally, you need to run the command: `npm run pages`

This command will run integration pages on <http://localhost:8000> 
