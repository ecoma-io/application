FROM node:18-alpine3.21 AS builder
WORKDIR /app
COPY dist/apps/sites/app-site .
RUN yarn install --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless
WORKDIR /app
COPY --from=builder /app /app
CMD [ "main.js" ]

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless-wget
WORKDIR /app
COPY scripts/wget /usr/bin/wget
COPY --from=builder /app /app
CMD [ "server/main.js" ]
