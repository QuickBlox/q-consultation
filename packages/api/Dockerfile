FROM node:18-alpine

WORKDIR /app/packages/api
ADD ./package.json ./
RUN npm install
ADD . .
RUN npm run build

ENTRYPOINT ["sh", "./run.sh"]

EXPOSE 4000
