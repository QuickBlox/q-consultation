const description = `
# Overview

The Q-Consultation API consists of various web resources and establishes an API that enhances the features of QuickBlox. You have the ability to interact with these resources directly by employing specific actions using standard HTTP protocols.

> Should you require additional functionalities provided by QuickBlox, make use of [QuickBlox Server API](https://docs.quickblox.com/reference/overview).

The Q-Consultation API is constructed following RESTful principles, which are a defined set of guidelines for implementing and utilizing the HTTP protocol. Consequently, when you send HTTP requests, the received data is in the format of JSON payloads. Through the Server API, you can seamlessly integrate Q-Consultation's capabilities into your own application.

# Base URL

Base URL is a value identifying particular API resource. This URL remains constant for all requests and constitutes the first half of the complete request URL.

The second half of the resource URL is the endpoint representing a variable that must be set with appropriate values to access a specific resource. For example, \`/auth/login\`.

# Headers

A header is an integral part of each Server API request and response indicating information about request and response body and authorization. QuickBlox Server API provides two headers types:

## Standard header

A Content-Type API header that tells the server the media type of the request and is used for PUT and POST requests only. Thus, QuickBlox Server API supports \`application/json\` and \`multipart/form-data\` content type.

## Authorization header

The Authorization header enables the server to determine whether the sender has the permission to access the requested resource or perform the operation.
This header specifies the authorization method.
Each of the methods indicates which token should be passed in an \`Authorization\` HTTP header.
Authorization header must be in the format \`Bearer <token>\`.

There are 3 authorization methods available:

- \`apiKey\` - \`BEARER_TOKEN\` set in app config. Used for API integration.
- \`providerSession\` - provider session token.
- \`clientSession\` - client session token.

# Limits

Since the Q-Consultation API is built upon QuickBlox, it shares the same limits.

The purpose of the rate limit is to ensure a high quality of QuickBlox service across all QuickBlox accounts, by limiting the number of API requests that an account can produce per second.

If you go over these limits when using REST based APIs, QuickBlox will start returning a HTTP 429 Too Many Requests error.

Read more info about limits on [Plans page](https://quickblox.com/pricing/).

| Basic | Startup | Growth | HIPAA | Enterprise                                                      |
| ----- | ------- | ------ | ----- | --------------------------------------------------------------- |
| 10 Mb | 25 Mb   | 50 Mb  | 50 Mb | [Contact our sales team](https://quickblox.com/enterprise/#get) |

# Errors

Possible API errors are as follows:

| Code | Text | Description |
| --- | --- | --- |
| [400](https://en.wikipedia.org/wiki/Http_status_codes#400) | Bad Request | Missing or invalid parameter. Possible causes:  <br>- malformed request parameters. |
| [401](https://en.wikipedia.org/wiki/Http_status_codes#401) | Unauthorized | Authorization is missing or incorrect. Possible causes:  <br>- a user tries to authorize with a wrong login or password.  <br>- a user uses invalid session token. |
| [403](https://en.wikipedia.org/wiki/Http_status_codes#403) | Forbidden | Access has been refused. Possible causes:  <br>- a user tries to retrieve chat messages for a chat dialog while they are not in the occupants list. |
| [404](https://en.wikipedia.org/wiki/Http_status_codes#404) | Not Found | The requested resource could not be found. Possible causes:  <br>- a user tries to retrieve chat messages for the invalid chat dialog ID.  <br>- a user tries to retrieve a custom object record with invalid ID. |
| [422](https://en.wikipedia.org/wiki/Http_status_codes#422) | Unprocessable Entity | The request was well-formed but was unable to be followed due to validation errors. Possible causes:  <br>- create a user with the existent login or email.  <br>- provide values in the wrong format to create some object. |
| [429](https://en.wikipedia.org/wiki/Http_status_codes#429) | Too Many Requests | Rate limit for your [current plan](https://quickblox.com/pricing/) is exceeded. |
| [500](https://en.wikipedia.org/wiki/Http_status_codes#500) | Internal Server Error | Server encountered an error, try again later. |
| [503](https://en.wikipedia.org/wiki/Http_status_codes#503) | Service Unavailable | Server is at capacity, try again later. |

`

export default description
