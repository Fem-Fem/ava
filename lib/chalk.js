import chalk from 'chalk';

let instance = new chalk.Instance();
export default instance;

let configured = false;
export function set(options) {
	if (configured) {
		throw new Error('Chalk has already been configured');
	}

	configured = true;
	instance = new chalk.Instance(options);
}
