FROM node:18-alpine as build
ARG APP=api
WORKDIR /project
COPY .yarn/ .yarn/
COPY .yarnrc.yml package.json yarn.lock ./
COPY apps/${APP}/package.json ./apps/${APP}/
RUN yarn workspaces focus @qc-apps/${APP}
COPY apps/${APP}/ ./apps/${APP}/
WORKDIR /project/apps/${APP}
RUN yarn build

FROM node:18-alpine
ARG APP=api
WORKDIR /project
COPY .yarn/ .yarn/
COPY .yarnrc.yml package.json yarn.lock ./
COPY apps/${APP}/package.json ./apps/${APP}/
RUN yarn workspaces focus @qc-apps/${APP} --production
COPY --from=build /project/apps/${APP}/dist/ ./apps/${APP}/dist/

WORKDIR /project/apps/${APP}
CMD ["yarn", "start"]

EXPOSE 4000
