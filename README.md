# keepassync
Sync KeePass file between devices
# Tutorial
- Install PM2 with `npm install -g pm2`.
- Generate the startup script with `pm2 startup`.
- Clone this repository.
- Install the dependencies with `npm install`.
- Create a Github personal access token with the "repo" scope checked.
- Create a .env file in the root of the keepassync repository with your Github personal access token. Example:
```
GITHUB_TOKEN=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
```
- Run `npm start`.

A directory called "repo" will be generated at the root of the repository. Now you can put your .kdbx files in that directory.