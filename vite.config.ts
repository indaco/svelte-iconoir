import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { sveltekit } from '@sveltejs/kit/vite';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);

import type { UserConfig } from 'vite';
const config: UserConfig = {
	define: {
		'process.env.VITE_SVELTEKIT_VERSION': JSON.stringify(
			String(pkg.devDependencies['@sveltejs/kit']),
		),
		'process.env.VITE_BUILD_TIME': JSON.stringify(new Date().toISOString()),
	},
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			// Alternatevaly set server.fs.strict to false
			allow: ['..'],
		},
	},
	plugins: [sveltekit()],
};

export default config;
