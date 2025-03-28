FROM node:22-alpine AS builder
WORKDIR /app
COPY dist/apps/services/alm-cleaner .
RUN yarn install --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless
WORKDIR /app
COPY --from=builder /app /app
CMD [ "main.js" ]

FROM node:22-alpine AS debug
WORKDIR /app
COPY --from=builder /app /app
CMD [ "main.js" ]

