const cp = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const dir = path.join(__dirname, 'repo');

class Repo {
	constructor(owner, token, repo) {
		this.owner = owner;
		this.token = token;
		this.repo = repo;
	}
	exec(cmd, cwd = true) {
		return new Promise((resolve, reject) => {
			cp.exec(cmd, { ...(cwd ? { cwd: dir } : {}) }, (err, stdout, stderr) => {
				if (err) {
					reject(new Error(stderr));
				}
				else {
					resolve(stdout);
				}
			});
		});
	}
	async ensure(createReadme) {
		if (await fs.pathExists(dir)) {
			await this.exec('git pull origin main');
			console.log(chalk.bold.greenBright('GIT PULL'));
		}
		else {
			await this.exec(`git clone https://${this.owner}:${this.token}@github.com/${this.owner}/${this.repo} ${dir}`, false);
			console.log(chalk.bold.greenBright('GIT CLONE'));
			if(createReadme) {
				await fs.writeFile(path.join(dir, 'README.md'), '# Keepass Sync Repo');
				await this.push('Initial commit');
			}
		}
	}
	async push(message) {
		try {
			await this.exec('git add .');
			await this.exec(`git commit -m "${message}"`);
			await this.exec('git push origin main');
			console.log(chalk.bold.greenBright('GIT COMMIT'), message);
		}
		catch (error) { /** */ }
	}
}

module.exports = Repo;