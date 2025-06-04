# dind-runner

This project contains a Docker-in-Docker (DinD) runner based on Alpine Linux. It is designed to provide a Docker environment within a container, which can be useful for running Docker commands or building images in isolated environments, such as CI/CD pipelines.

## Functionality

- **Docker-in-Docker:** Runs a full Docker daemon inside the container.
- **Alpine Linux based:** Provides a lightweight base image.
- **Essential tools:** Includes `docker`, `docker-cli`, and other necessary dependencies.
- **Entrypoint script:** Initializes and starts the Docker daemon upon container startup.

## Build and Publish

The project uses Nx with `@nx-tools/nx-container:build` executor for containerization.

- To build the Docker image for development:

  ```bash
  npx nx containerize dind-runner
  ```

- To build and push the Docker image for production (this target is used by the `publish` command):

  ```bash
  npx nx containerize dind-runner -c production
  ```

- The `publish` target in `project.json` is configured to build and push the image with a tag based on the content of the `version.txt` file:

  ```bash
  npx nx publish dind-runner
  ```

## Contents

- `Dockerfile`: Defines the steps to build the Docker image, including installing dependencies and copying the entrypoint script.
- `entrypoint.sh`: The script executed when the container starts, responsible for launching the Docker daemon.
- `project.json`: Nx project configuration, including `containerize` and `publish` targets.
- `version.txt`: Contains the version tag used when publishing the Docker image.
- `CHANGELOG.md`: Records changes for this project.
- `README.md`: This file.
