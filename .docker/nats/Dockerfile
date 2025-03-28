# FROM alpine:latest AS curl-stage

# RUN apk add --no-cache curl


FROM 

# COPY --from=curl-stage /usr/bin/curl /usr/bin/curl

ENTRYPOINT ["/nats-server"]

CMD ["--config" "nats-server.conf" "-m" "8222"]