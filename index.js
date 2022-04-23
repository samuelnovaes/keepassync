require('dotenv').config();

const chokidar = require('chokidar');
const path = require('path');
const Repo = require('./repo.js');
const { Octokit } = require('@octokit/core');

const token = process.env.GITHUB_TOKEN;
const repo = 'keepassync_repo';
const octokit = new Octokit({ auth: token });

(async () => {

	const info = await octokit.request('GET /user');
	const owner = info.data.login;

	try {
		await octokit.request('GET /repos/{owner}/{repo}', {
			owner,
			repo
		});
	}
	catch(error) {
		if(error.status === 404) {
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