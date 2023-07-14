The client application has a self-registration option, so you can either create a client via the web application or via [API](/api#tag/Client/paths/~1users~1client/post).

1. **Registration via web application**

   To create a client, navigate to the registration page by accessing the following URL: <https://localhost:3001/signup>.
   Fill in the required information and submit form.

  <Image src='/img/snippets/create-client.jpg'/>

2. **Console method**

   Enter the following command, replacing the values in angle brackets with the actual data:

    <Tabs groupId="request">

    <TabItem value="curl" label="cURL">

   ```bash
   curl --request POST \
     --url http://localhost:4000/users/client \
     --header 'content-type: multipart/form-data' \
     --form 'full_name=<Full name>' \
     --form email=<Email> \
     --form password=<Password> \
     --form birthdate=<Birthdate> \
     --form gender=<Gender>
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
   Content-Disposition: form-data; name="birthdate"

   <Birthdate>
   -----011000010111000001101001
   Content-Disposition: form-data; name="gender"

   <Gender>
   -----011000010111000001101001--
   ' |  \
     http POST http://localhost:4000/users/client \
     content-type:'multipart/form-data; boundary=---011000010111000001101001'
   ```

    </TabItem>

    </Tabs>

3. **Using an HTTP client (such as [Postman](https://www.postman.com) or [Insomnia](https://insomnia.rest))**

   - Open your preferred HTTP client.
   - Create a new request with the `POST` method.
   - Set the request URL to `http://localhost:4000/users/client`.
   - Go to the "Body" tab and select "Multipart Form" (for Insomnia) or "form-data" (for Postman).
   - Add the following form options with the actual data:
     - `full_name`
     - `email`
     - `password`
     - `birthdate` (value in `YYYY-MM-DD` format)
     - `gender` (value: `male` or `female`)
   - Send the request.

:::note
In 2 and 3 methods, the request will be sent to the specified URL with the provided data about the client. Make sure to replace `<Full name>`, `<Email>`, `<Password>`, `<Birthdate>`, and `<Gender>` with the actual values you want to use for creating the client.
:::
