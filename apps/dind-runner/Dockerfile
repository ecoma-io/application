FROM alpine

# Cài đặt Docker và các phụ thuộc
RUN apk update && apk add --no-cache \
    docker \
    docker-cli \
    containerd \
    git \
    runc \
    iptables \
    e2fsprogs-libs \
    util-linux \
    ca-certificates \
    openssl \
    bash \
    && rm -rf /var/cache/apk/*

COPY apps/dind-runner/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]