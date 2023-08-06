---
sidebar_label: '🚀 Quick Start Guide'
sidebar_position: 2
---

import InstallPrerequisites from '/docs/snippets/installation-prerequisites.md'
import RunDev from '/docs/snippets/scripts/dev.md'
import ScriptConfig from '/docs/snippets/script-config.md'
import ScriptSchema from '/docs/snippets/script-schema.md'
import CreateProvider from '/docs/snippets/create-provider.md'
import CreateClient from '/docs/snippets/create-client.md'

# Quick Start Guide

**Q-Consultation Lite** offers a lot of flexibility. Whether you want to go fast and quickly see the final result, or would rather dive deeper into the product, we got you covered. For this tutorial, we'll go for the DIY approach and build a project and data structure from scratch.

:::tip Prerequisites
<InstallPrerequisites components={props.components} />
:::

:::info Video Demo
If demos are more your thing, we have a video demo:

<div style={{ textAlign: 'center' }}>
  <iframe
    allowFullScreen
    frameBorder="0"
    title="YouTube video player"
    src="https://www.youtube.com/embed/-nEoba8vq_I"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    style={{ height: '315px', width: '100%', maxWidth: '560px' }}
  />
</div>
:::

## Step 1: Install dependencies

You will need to clone the repository or download it as a zip archive. Once you have cloned/dowloaded this repo you need to install dependencies running the following command in a terminal:

<Tabs groupId="yarn-npm">

<TabItem value="npm" label="npm">

```bash
npm install
```

</TabItem>

<TabItem value="yarn" label="yarn">

```bash
yarn
```

</TabItem>

</Tabs>

## Step 2: Register QuickBlox account

Next, you need to have a QuickBlox account. You can sign up here: https://admin.quickblox.com/signup. Feel free to skip this step in case you already have an account.

## Step 3: Create QuickBlox application

After registering the QuickBlox account, you need to create an application in your QuickBlox admin panel that will allow you to connect the Q-Consultation Lite app to the QuickBlox server. Follow the steps below:

1. Log into QuickBlox account (if you are not yet there) <https://admin.quickblox.com/signin>.
2. On the main page, click + sign to add a new application.
3. Fill in the required fields: **App title** and **App type**, and create app.

Once done, you will be redirected to the **Overview** page of your newly created application. There, you will find application credentials necessary to connect Q-Consultation application to the QuickBlox server. We will get back to them later.

<Image src='/img/quick-start/001.gif'/>

:::tip
You can read more about working with applications here: [QuickBlox Application](https://docs.quickblox.com/docs/application)
:::

## Step 4: Configure application

Now, let’s get back to the application credentials which you saw in the QuickBlox admin panel.

:::caution
If you have registered your QuickBlox account via Google or GitHub and you do not have a password,
you can recover it on the [Forgot password](https://admin.quickblox.com/forgot) page or use another method to configure the application.
:::

<ScriptConfig components={props.components} />

:::tip
For detailed application configuration information,
you can visit the [Configuration](/dev/setup-and-deployment/configurations#configure-application) page.
There you will find other ways to configure and a description of all configuration options.
:::

## Step 5: Upload Schema

<ScriptSchema components={props.components} />

:::tip
For details on uploading schema into applications,
you can visit the [Configuration](/dev/setup-and-deployment/configurations#upload-schema) page.
There you will find other ways to upload the schema.
:::

## Step 6: Run application

<RunDev components={props.components} />

## Step 7: Create users

### Provider

<CreateProvider components={props.components} />

### Client

<CreateClient components={props.components} />

## ⏩ What to do next?

After you complete the step with running the project in develop mode, Client and Provider apps should be automatically open in your default browser. Now, your Q-Consultation app is ready to be used for your goals.

How to proceed with app integration, you can find detailed instructions here: ​[Development](/dev/development).
