require('dotenv').config();

const chokidar = require('chokidar');
const path = require('path');
const Repo = require('./repo.js');
const { Octokit } = require('@octokit/core');
const chalk = require('chalk');
const { log } = require('./logger');

const token = process.env.GITHUB_TOKEN;
const repo = 'keepassync_repo';
const octokit = new Octokit({ auth: token });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {

	let owner = null;

	while (!owner) {
		try {
			log(chalk.bold.yellowBright('Try to get owner...'));
			const info = await octokit.request('GET /user');
			owner = info.data.login;
			log(chalk.bold.yellowBright('Owner: ' + owner));
		} catch (e) {
			await wait(1000);
		}
	}

	try {
		await octokit.request('GET /repos/{owner}/{repo}', {
			owner,
			repo
		});
	}
	catch (error) {
		if (error.status === 404) {
			await octokit.request('POST /user/repos', {
				name: repo,
				private: true
			});
		}
	}

	const git = new Repo(owner, token, repo);
	await git.ensure();

	const watch = chokidar.watch(path.join(__dirname, 'repo', '*.kdbx'), {
		persistent: true
	});

	watch.on('all', async (event, file) => {
		const filename = file.split(path.sep).pop();
		await git.push(`${event} ${filename}`);
	});

})();