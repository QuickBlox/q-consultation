To make online appointments and video records work in the Q-Consultation app, it’s necessary to import an appointment schema file to the QuickBlox admin panel.

:::caution
If you have registered your QuickBlox account via Google or GitHub and you do not have a password,
you can recover it on the [Forgot password](https://admin.quickblox.com/forgot) page or use another method to upload schema into application.
:::

You can add the schema automatically by running this command and following the instructions in the terminal.

<Tabs groupId="yarn-npm">

<TabItem value="npm" label="npm">

```bash
npm run init:schema
```

</TabItem>

<TabItem value="yarn" label="yarn">

```bash
yarn init:schema
```

</TabItem>

</Tabs>

<Image src='/img/snippets/schema.gif'/>
