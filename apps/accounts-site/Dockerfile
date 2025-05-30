FROM node:22-alpine@sha256:9f3ae04faa4d2188825803bf890792f33cc39033c9241fc6bb201149470436ca AS builder
WORKDIR /app
COPY dist/apps/accounts-site .
RUN yarn install --production

FROM node:22-alpine@sha256:9f3ae04faa4d2188825803bf890792f33cc39033c9241fc6bb201149470436ca AS debug
WORKDIR /app
COPY --from=builder /app /app
CMD [ "server/main.js" ]

FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:581893ba58980f0b4c7444d7a16b89f4e966cd89a89f3e0c6f26c482e312f008
WORKDIR /app
COPY --from=builder /app /app
CMD [ "server/main.js" ]