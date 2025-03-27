# Ecoma

## Development Enviroment Setup

- Install vscode and docker on your computer
- Open new vscode window Press F1 for Command Promt and search `Dev Containers: Clone Repository in Container Volume...`

![](https://github.com/ecoma-io/application/raw/refs/heads/main/docs/assets/clone-project.png)

Choose the project and branch and wait for devcontainer setup development enviroment

## Run all project

```
docker compose up -d --wait
```

All project will run on domain fbi.com To reproduce everything as close to production as possible

The list of service domains:

| Service   | Domain               | Description                                                                          |
| --------- | -------------------- | ------------------------------------------------------------------------------------ |
| Home Site | https://fbi.com      | The main landing site of company                                                     |
| Maildev   | https://mail.fbi.com | Maildev will emulate the SMTP server developers will use this webmail to read emails |

Note: we use self-signed certificate so browser will warn
