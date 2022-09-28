ARG DATABASE_URL
ARG JWT_KEY
ARG JWT_EXPIRES

# BUILD DEV
FROM node:16-alpine AS development

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn
RUN yarn global add @nestjs/cli

COPY --chown=node:node . .

USER node

# BUILD PROD
FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY --chown=node:node package.json ./
COPY --chown=node:node yarn.lock ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

ARG DATABASE_URL
ARG JWT_KEY
ARG JWT_EXPIRES

RUN yarn build

ENV NODE_ENV production

RUN yarn && yarn cache clean

USER node

# PROD RUN
FROM node:16-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/src/main" ]
