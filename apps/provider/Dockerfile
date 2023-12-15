FROM node:18-alpine as build
ARG APP=provider
WORKDIR /project
COPY .yarn/ .yarn/
COPY .yarnrc.yml package.json yarn.lock lerna.json .env ./
COPY apps/${APP}/ ./apps/${APP}/
COPY packages/ ./packages/
RUN yarn
RUN yarn build

FROM node:18-alpine
ARG APP=provider
WORKDIR /app
RUN npm i -g serve
COPY --from=build /project/apps/${APP}/dist/ ./

CMD ["serve", "-l", "3000"]

EXPOSE 3000
