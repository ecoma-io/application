FROM node:18-alpine3.21 AS builder
WORKDIR /app
COPY dist/apps/sites/home-site .
RUN yarn install --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless
WORKDIR /app
COPY --from=builder /app /app
CMD [ "server/main.js" ]

FROM node:18-alpine3.21 AS debug
WORKDIR /app
COPY --from=builder /app /app
CMD [ "server/main.js" ]
