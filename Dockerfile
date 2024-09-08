FROM node:18-alpine AS base

WORKDIR /app
COPY package.json ./

RUN npm i

COPY app ./app
COPY public ./public
COPY next.config.mjs .
COPY tsconfig.json .
COPY .env .

RUN npm run build

CMD ["npm", "run", "start"]