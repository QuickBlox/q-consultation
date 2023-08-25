There is no registration in the provider's application, so to create a user you need to use the [API](/api#tag/Provider/paths/~1ai~1providers~1suggestions/post).

1. **Console method**

   Enter the following command, replacing the values in angle brackets with the actual data:

    <Tabs groupId="request">

    <TabItem value="curl" label="cURL">

   ```bash
   curl --request POST \
   --url http://localhost:4000/users/provider \
   --header 'content-type: multipart/form-data' \
   --form 'full_name=<Full name>' \
   --form email=<Email> \
   --form profession=<Profession> \
   --form password=<Password>
   ```

    </TabItem>

    <TabItem value="httpie" label="HTTPie">

   ```bash
   echo '-----011000010111000001101001
   Content-Disposition: form-data; name="full_name"

   <Full name>
   -----011000010111000001101001
   Content-Disposition: form-data; name="email"

   <Email>
   -----011000010111000001101001
   Content-Disposition: form-data; name="password"

   <Password>
   -----011000010111000001101001
   Content-Disposition: form-data; name="profession"

   <Profession>
   -----011000010111000001101001--
   ' |  \
   http POST http://localhost:4000/users/provider \
   content-type:'multipart/form-data; boundary=---011000010111000001101001'
   ```

    </TabItem>

    </Tabs>

2. **Using an HTTP client (such as [Postman](https://www.postman.com) or [Insomnia](https://insomnia.rest))**

   - Open your preferred HTTP client.
   - Create a new request with the `POST` method.
   - Set the request URL to `http://localhost:4000/users/provider`.
   - Go to the "Body" tab and select "Multipart Form" (for Insomnia) or "form-data" (for Postman).
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
