FROM node:22-alpine AS builder
WORKDIR /app
COPY dist/apps/admin-site .
RUN yarn install --production

FROM node:22-alpine AS debug
WORKDIR /app
COPY --from=builder /app /app
CMD [ "server/main.js" ]


FROM gcr.io/distroless/nodejs22-debian12:nonroot
WORKDIR /app
COPY --from=builder /app /app
CMD [ "server/main.js" ]