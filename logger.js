const dayjs = require('dayjs');

const log = (...args) => {
	console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}]`, ...args);
};

module.exports = {
	log
};
