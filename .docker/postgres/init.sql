-- Tạo các database
CREATE DATABASE kratos;
CREATE DATABASE hydra;
CREATE DATABASE oauthkeeper;
CREATE DATABASE keto;

-- Gán quyền cho user 'myuser'
GRANT ALL PRIVILEGES ON DATABASE kratos TO user;
GRANT ALL PRIVILEGES ON DATABASE hydra TO user;
GRANT ALL PRIVILEGES ON DATABASE oauthkeeper TO user;
GRANT ALL PRIVILEGES ON DATABASE keto TO user;
