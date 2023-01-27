import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter()
	},
	package: {
		dir: 'dist',
		emitTypes: true,
		// files to not be part of the package
		files: (filepath) => {
			const ds = /.DS_Store/;
			const mdFiles = /^_|\/_|\.md$/;
			return !ds.test(filepath) && !mdFiles.test(filepath);
		}
	}
};

export default config;
