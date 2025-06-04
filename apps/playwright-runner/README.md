# Playwright with Docker-in-Docker
This project provides a custom Docker image built on the official Playwright platform (mcr.microsoft.com/playwright) with additional Docker-in-Docker capabilities.

Main objectives:

- Create an isolated environment ready for automated testing with Playwright
- Enable running Docker commands (e.g., building, starting auxiliary services in containers) during Playwright testing
- Ensure environment consistency across platforms, particularly useful for Continuous Integration/Continuous Deployment (CI/CD) systems like GitHub Actions

With this image, developers can accelerate the testing process by eliminating the need for manual browser and Docker tool installation, while easily testing Docker-dependent applications within the Playwright testing environment.