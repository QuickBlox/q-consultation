---
sidebar_label: 'Scripts'
sidebar_position: 1
---

import RunDev from '/docs/snippets/scripts/dev.md'
import RunBuild from '/docs/snippets/scripts/build.md'
import RunStartApi from '/docs/snippets/scripts/start-api.md'
import RunStartDoc from '/docs/snippets/scripts/start-doc.md'
import RunStartPages from '/docs/snippets/scripts/start-pages.md'
import RunLint from '/docs/snippets/scripts/lint.md'
import RunInitConfig from '/docs/snippets/scripts/init-config.md'
import RunInitSchema from '/docs/snippets/scripts/init-schema.md'

# Scripts

### Run application in development mode

<RunDev components={props.components} />

### Make a production build application

<RunBuild components={props.components} />

### Start API Server

<RunStartApi components={props.components} />

:::tip
Before launching the server API, it is necessary to make an [application build](#make-a-production-build-application)
:::

### Start of documentation development

<RunStartDoc components={props.components} />

### Start Integration Pages

<RunStartPages components={props.components} />

### Run code linting

<RunLint components={props.components} />

### Run configuration creation

<RunInitConfig components={props.components} />

### Run schema upload

<RunInitSchema components={props.components} />
