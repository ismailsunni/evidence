import { getEvidenceConfig } from '../../configuration/index.js';

/**
 * @returns {import('vite').Plugin}
 */
export const configVirtual = () => {
	return {
		name: 'evidence:virtuals-config',
		resolveId(id) {
			if (id === '$evidence/config') {
				return `\0$evidence/config`;
			}
			return null;
		},
		load: async (id) => {
			if (id === `\0$evidence/config`) {
				const config = getEvidenceConfig();
				return `export const config = ${JSON.stringify(config)};`;
			}
		}
	};
};
