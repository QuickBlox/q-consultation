There is no registration in the provider's application, so to create a user you need to use the [API](/api#tag/Provider/paths/~1ai~1providers~1suggestions/post).

1. **Console method**

   Enter the following command, replacing the values in angle brackets with the actual data:

    <Tabs groupId="request">

    <TabItem value="curl" label="cURL">

   ```bash
   curl --request POST \
     --url http://localhost:4000/users/provider \
     --header 'Content-Type: application/json' \
     --data '{
   	"full_name": "<Full name>",
   	"email": "<Email>",
   	"profession": "<Profession>",
   	"password": "<Password>"
   }'
   ```

    </TabItem>

    <TabItem value="httpie" label="HTTPie">

   ```bash
   echo '{
   	"full_name": "<Full name>",
   	"email": "<Email>",
   	"profession": "<Profession>",
   	"password": "<Password>"
   }' |  \
     http POST http://localhost:4000/users/provider \
     Content-Type:application/json
   ```

    </TabItem>

    </Tabs>

2. **Using an HTTP client (such as [Postman](https://www.postman.com) or [Insomnia](https://insomnia.rest))**

   - Open your preferred HTTP client.
   - Create a new request with the `POST` method.
   - Set the request URL to `http://localhost:4000/users/provider`.
   - Go to the "Body" tab and select "JSON".
   - Add the following form options with the actual data:
     - `full_name`
     - `email`
     - `profession`
     - `password`
   - Send the request.

:::note
In both methods, the request will be sent to the specified URL with the provided data about the provider. Make sure to replace `<Full name>`, `<Email>`, `<Profession>` and `<Password>` with the actual values you want to use for creating the provider.
:::

Choose the preferred method based on your development environment and tools.
