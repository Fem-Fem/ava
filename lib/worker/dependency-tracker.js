import {createRequire} from 'module';

import channel from './channel.cjs';

const seenDependencies = new Set();
let newDependencies = [];

function flush() {
	if (newDependencies.length === 0) {
		return;
	}

	channel.send({type: 'dependencies', dependencies: newDependencies});
	newDependencies = [];
}

function track(filename) {
	if (seenDependencies.has(filename)) {
		return;
	}

	if (newDependencies.length === 0) {
		process.nextTick(flush);
	}

	seenDependencies.add(filename);
	newDependencies.push(filename);
}

export default {
	flush,
	track,
	install(testPath) {
		const {extensions} = createRequire(import.meta.url);
		for (const ext of Object.keys(extensions)) {
			const wrappedHandler = extensions[ext];

			extensions[ext] = (module, filename) => {
				if (filename !== testPath) {
					track(filename);
				}

				wrappedHandler(module, filename);
			};
		}
	}
};
