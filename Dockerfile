FROM node:18-alpine

ARG APP
WORKDIR /project

COPY .yarn/ .yarn/

COPY .yarnrc.yml package.json yarn.lock lerna.json ./
COPY packages/ ./packages/
COPY apps/${APP}/ ./apps/${APP}/
RUN yarn

CMD ["yarn", "dev"]
