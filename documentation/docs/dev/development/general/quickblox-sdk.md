---
sidebar_label: 'Using QuickBlox SDK'
sidebar_position: 2
---

# Using QuickBlox SDK

In our application, we have integrated the [QuickBlox SDK](https://docs.quickblox.com/docs/js-quick-start) to enable video and audio calls, as well as to provide chat functionality.

## Extended QuickBlox SDK

In our application, we have extended the [QuickBlox SDK](https://docs.quickblox.com/docs/js-quick-start) by creating the QBExtended class.
This class enhances the functionality of the QuickBlox library and provides additional capabilities for handling various aspects of the application,
such as user management, data, and content.

```ts title="Internal Type"
declare type Dictionary<T> = Record<string, T>

declare interface QBCallback<T> {
  (error: null | undefined, result: T): void
  (error: QBError, result: null | undefined): void
}

declare type QBExtendedUsers = QuickBlox['users'] & {
  getById(id: QBUser['id'], callback: QBCallback<QBUser>): void
}

declare type QBExtendedData = QuickBlox['data'] & {
  createChild<T extends QBCustomObject>(
    parentClassName: string,
    parentId: QBCustomObject['_id'],
    childClassName: string,
    data: Dictionary<unknown>,
    callback: QBCallback<T>,
  ): void
  updateByCriteria<T extends QBCustomObject>(
    className: string,
    filters: Dictionary<unknown>,
    data: Dictionary<unknown>,
    callback: QBCallback<T>,
  ): void
  deleteByCriteria(
    className: string,
    data: Dictionary<unknown>,
    callback: QBCallback<{ total_deleted: number }>,
  ): void
}

declare class QBExtended extends QuickBlox {
  users: QBExtendedUsers;
  data: QBExtendedData;
  init(
    appIdOrToken: string | number,
    authKeyOrAppId: string | number,
    authSecret: string | null | undefined,
    accountKey: string,
    config?: QBConfig
  ): void;
  private _axios;
  private _bindMethods;
  private _initAxios;
  private _usersGetById;
  private _dataCreateChild;
  private _dataUpdateByCriteria;
  private _dataDeleteByCriteria;
  private _contentCreateAndUpload;
}
```

## Utilities

To enhance the usability of the library, a set of utilities has been developed to simplify
interaction with the QuickBlox SDK in the context of the Q-Consultation application.
These utilities were specifically created for the Q-Consultation application,
aiming to streamline and expedite the execution of tasks related to QuickBlox functionality in this application.
Below is a list of these utilities for your reference.

All utility functions are imported from the "quickblox" folder located in the "packages" directory.

```ts title="Import"
import {
  promisifyCall,
  isQBError,
  userHasTag,
  parseUserCustomData,
  stringifyUserCustomData
} from '@qc/quickblox'
```

### `promisifyCall`

This function provides the ability to invoke methods of the QBExtended class,
wrapping them in promises to ensure convenient asynchronous handling of function results.
The first parameter of the function is the method of the QBExtended class,
followed by the parameters that need to be passed to this method.

```ts title="Internal Type"
declare interface QBCallback<T> {
  (error: null | undefined, result: T): void
  (error: QBError, result: null | undefined): void
}

interface PromisifyCall {
    <R>(fn: (cb: QBCallback<R>) => void): Promise<R>;
    <T1, R>(fn: (arg1: T1, cb: QBCallback<R>) => void, arg1: T1): Promise<R>;
    <T1, T2, R>(fn: (arg1: T1, arg2: T2, cb: QBCallback<R>) => void, arg1: T1, arg2: T2): Promise<R>;
    <T1, T2, T3, R>(fn: (arg1: T1, arg2: T2, arg3: T3, cb: QBCallback<R>) => void, arg1: T1, arg2: T2, arg3: T3): Promise<R>;
    <T1, T2, T3, T4, R>(fn: (arg1: T1, arg2: T2, arg3: T3, arg4: T4, cb: QBCallback<R>) => void, arg1: T1, arg2: T2, arg3: T3, arg4: T4): Promise<R>;
}

declare const promisifyCall: PromisifyCall;
```

```ts title="Usage example"
import { promisifyCall } from '@qc/quickblox'

async () => {
  const user = await promisifyCall(QB.login, { email, password })
}
```

### `isQBError`

The function checks whether the error object is an instance of the QBError class.

```ts title="Internal Type"
declare function isQBError(error: unknown): error is QBError;
```

### `userHasTag`

The function checks whether the user object contains the specified tag in the `user_tags` array.

```ts title="Internal Type"
declare function userHasTag(user: QBUser, tag: string): boolean | undefined;
```

### `parseUserCustomData`

The function parses the JSON string `customDataText` into an object of type `QBUserCustomData`.

```ts title="Internal Type"
declare function parseUserCustomData(customDataText?: string | null): QBUserCustomData;
```

### `stringifyUserCustomData`

The function converts the customDataText object into a JSON string.

```ts title="Internal Type"
declare function stringifyUserCustomData(customDataText?: QBUserCustomData | null): string | undefined;
```
