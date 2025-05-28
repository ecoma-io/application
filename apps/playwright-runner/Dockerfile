# Sử dụng image Playwright làm base
FROM mcr.microsoft.com/playwright:v1.52.0-noble

# Cập nhật danh sách gói và cài đặt các gói cần thiết để cài đặt Docker
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Thêm khóa GPG chính thức của Docker
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
RUN chmod a+r /etc/apt/keyrings/docker.gpg

# Thêm kho lưu trữ Docker vào Apt sources
RUN echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker Engine, containerd và Docker Compose
RUN apt-get update && apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin \
    && rm -rf /var/lib/apt/lists/*

# (Tùy chọn) Tạo một người dùng không phải root và thêm vào nhóm docker
# Điều này hữu ích nếu bạn muốn chạy các lệnh docker mà không cần sudo
ARG DOCKER_USER=playwrightuser
RUN useradd -m -s /bin/bash ${DOCKER_USER} && \
    usermod -aG docker ${DOCKER_USER}

# (Tùy chọn) Chuyển sang người dùng không phải root nếu bạn muốn
USER ${DOCKER_USER}

# Thiết lập một điểm vào mặc định hoặc lệnh nếu cần
CMD ["bash"]