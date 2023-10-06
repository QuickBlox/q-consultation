FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app/packages/client
ADD ./package.json ./
RUN npm install
ADD . .

ENTRYPOINT ["sh", "./run.sh"]

EXPOSE 3001
