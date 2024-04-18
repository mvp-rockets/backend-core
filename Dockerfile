FROM node:20.12.2 AS build-env

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init=1.2.5 \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
USER node
WORKDIR /app
COPY --chown=node:node package*.json /app

RUN npm ci --omit=dev

#FROM gcr.io/distroless/nodejs20-debian11
FROM node:20.12.2-bookworm-slim
RUN apt-get update && apt-get upgrade -y \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production

COPY --from=build-env /usr/bin/dumb-init /usr/bin/dumb-init

USER node
WORKDIR /app
COPY --chown=node:node --from=build-env /app /app
COPY --chown=node:node . /app

EXPOSE 3000 4000
#CMD ["dumb-init", "node", "index.js"]
CMD ["node", "index.js"]

