FROM busybox AS wget
ADD https://busybox.net/downloads/binaries/1.31.0-i686-uclibc/busybox_WGET /wget
RUN chmod a+x /wget

FROM node:18-alpine3.21 AS builder
WORKDIR /app
COPY dist/apps/sites/accounts-site .
RUN yarn install --production

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless
WORKDIR /app
COPY --from=builder /app /app
CMD [ "main.js" ]

FROM gcr.io/distroless/nodejs22-debian12:nonroot AS distroless-wget
WORKDIR /app
COPY --from=wget /wget /usr/bin/wget
COPY --from=builder /app /app
CMD [ "server/main.js" ]
