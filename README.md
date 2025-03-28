# Ecoma

## Development Enviroment Setup

- Install vscode and docker on your computer
- Open new vscode window Press F1 for Command Promt and search `Dev Containers: Clone Repository in Container Volume...`

![](https://github.com/ecoma-io/application/raw/refs/heads/main/docs/assets/clone-project.png)

Choose the project and branch and wait for devcontainer setup development enviroment

## Installing Self-Signed SSL Certificate

## Step 1: Get the Certificate

copy the file from `.docker/nginx/certs/wildcard.crt`.

## Step 2: Install the Certificate

### Windows

1. Double-click the `wildcard.crt` file.
2. Click **Install Certificate**.
3. Select **Local Machine** and click **Next**.
4. Choose **Place all certificates in the following store**, then click **Browse**.
5. Select **Trusted Root Certification Authorities** and click **OK**.
6. Click **Next**, then **Finish**.
7. Restart your browser.

### macOS

1. Open **Keychain Access**.
2. Drag and drop `wildcard.crt` into **System** keychain.
3. Double-click the certificate, expand **Trust**, and set **When using this certificate** to **Always Trust**.
4. Close the window and enter your password if prompted.
5. Restart your browser.

### Linux (Ubuntu/Debian)

1. Move the certificate to the system certificates folder:
   ```sh
   sudo cp wildcard.crt /usr/local/share/ca-certificates/wildcard.crt
   ```
2. Update the certificate store:
   ```sh
   sudo update-ca-certificates
   ```
3. Restart your browser.

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
