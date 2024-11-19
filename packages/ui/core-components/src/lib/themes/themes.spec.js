// @ts-check

/** @template T @typedef {import('svelte/store').Readable<T>} Readable */
import { vi, describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { ThemeStores } from './themes.js';

vi.mock('$evidence/themes', () => ({
	themesConfig: {
		themes: {
			defaultAppearance: 'light'
		}
	},
	themes: {
		light: {
			colors: {
				myColor1: 'light_myColor1',
				myColor2: 'light_myColor2',
				lightOnly: '#abcdef'
			},
			colorPalettes: {
				myColorPalette1: [
					'light_myColorPalette1_color1',
					'light_myColorPalette1_color2',
					'light_myColorPalette1_color3'
				],
				myColorPalette2: [
					'light_myColorPalette2_color1',
					'light_myColorPalette2_color2',
					'light_myColorPalette2_color3'
				]
			},
			colorScales: {
				myColorScale1: ['light_myColorScale1_color1', 'light_myColorScale1_color2'],
				myColorScale2: ['light_myColorScale2_color1', 'light_myColorScale2_color2']
			}
		},
		dark: {
			colors: {
				myColor1: 'dark_myColor1',
				myColor2: 'dark_myColor2'
			},
			colorPalettes: {
				myColorPalette1: [
					'dark_myColorPalette1_color1',
					'dark_myColorPalette1_color2',
					'dark_myColorPalette1_color3'
				],
				myColorPalette2: [
					'dark_myColorPalette2_color1',
					'dark_myColorPalette2_color2',
					'dark_myColorPalette2_color3'
				]
			},
			colorScales: {
				myColorScale1: ['dark_myColorScale1_color1', 'dark_myColorScale1_color2'],
				myColorScale2: ['dark_myColorScale2_color1', 'dark_myColorScale2_color2']
			}
		}
	}
}));

describe('ThemeStores', async () => {
	const {
		setAppearance,
		resolveColor,
		resolveColorsObject,
		resolveColorPalette,
		resolveColorScale
	} = new ThemeStores();

	describe('resolveColor', () => {
		it('should leave undefined as-is', () => {
			const store = resolveColor(undefined);

			setAppearance('light');
			expect(get(store)).toBe(undefined);

			setAppearance('dark');
			expect(get(store)).toBe(undefined);
		});

		it('should convert single hex color to dark mode', () => {
			const store = resolveColor('#abcdef');

			setAppearance('light');
			expect(get(store)).toBe('#abcdef');

			setAppearance('dark');
			expect(get(store)).toBe('#176ab5');
		});

		it('should convert light-only theme color to dark mode', () => {
			const store = resolveColor('lightOnly');

			setAppearance('light');
			expect(get(store)).toBe('#abcdef');

			setAppearance('dark');
			expect(get(store)).toBe('#176ab5');
		});

		it('should resolve colors in theme', () => {
			const store = resolveColor('myColor1');

			setAppearance('light');
			expect(get(store)).toBe('light_myColor1');

			setAppearance('dark');
			expect(get(store)).toBe('dark_myColor1');
		});

		it('should resolve colors in theme and ignore extraneous whitespace', () => {
			const store = resolveColor('  myColor2  ');

			setAppearance('light');
			expect(get(store)).toBe('light_myColor2');

			setAppearance('dark');
			expect(get(store)).toBe('dark_myColor2');
		});

		it('should resolve tuple of hex codes', () => {
			const store = resolveColor(['#abcdef', '#fedcba']);

			setAppearance('light');
			expect(get(store)).toEqual('#abcdef');

			setAppearance('dark');
			expect(get(store)).toEqual('#fedcba');
		});

		it('should resolve a tuple of just one hex code', () => {
			const store = resolveColor(['#abcdef']);

			setAppearance('light');
			expect(get(store)).toEqual('#abcdef');

			setAppearance('dark');
			expect(get(store)).toEqual('#176ab5');
		});

		it('should resolve tuple of theme colors', () => {
			const store = resolveColor(['myColor1', 'myColor2']);

			setAppearance('light');
			expect(get(store)).toEqual('light_myColor1');

			setAppearance('dark');
			expect(get(store)).toEqual('dark_myColor2');
		});

		it('should resolve a tuple of just one theme color', () => {
			const store = resolveColor(['lightOnly']);

			setAppearance('light');
			expect(get(store)).toEqual('#abcdef');

			setAppearance('dark');
			expect(get(store)).toEqual('#176ab5');
		});
	});

	describe('resolveColorsObject', () => {
		it('should leave undefined as-is', () => {
			const store = resolveColorsObject(undefined);

			setAppearance('light');
			expect(get(store)).toBe(undefined);

			setAppearance('dark');
			expect(get(store)).toBe(undefined);
		});

		it('should convert single hex color to dark mode', () => {
			const store = resolveColorsObject({ key1: '#abcdef' });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: '#abcdef' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: '#176ab5' });
		});

		it('should convert light-only theme color to dark mode', () => {
			const store = resolveColorsObject({ key1: 'lightOnly' });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: '#abcdef' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: '#176ab5' });
		});

		it('should resolve colors in theme', () => {
			const store = resolveColorsObject({ key1: 'myColor1' });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: 'light_myColor1' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: 'dark_myColor1' });
		});

		it('should resolve colors in theme and ignore extraneous whitespace', () => {
			const store = resolveColorsObject({ key1: '  myColor2  ' });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: 'light_myColor2' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: 'dark_myColor2' });
		});

		it('should resolve tuple of hex codes', () => {
			const store = resolveColorsObject({ key1: ['#abcdef', '#fedcba'] });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: '#abcdef' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: '#fedcba' });
		});

		it('should resolve a tuple of just one hex code', () => {
			const store = resolveColorsObject({ key1: ['#abcdef'] });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: '#abcdef' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: '#176ab5' });
		});

		it('should resolve tuple of theme colors', () => {
			const store = resolveColorsObject({ key1: ['myColor1', 'myColor2'] });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: 'light_myColor1' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: 'dark_myColor2' });
		});

		it('should resolve a tuple of just one theme color', () => {
			const store = resolveColorsObject({ key1: ['lightOnly'] });

			setAppearance('light');
			expect(get(store)).toEqual({ key1: '#abcdef' });

			setAppearance('dark');
			expect(get(store)).toEqual({ key1: '#176ab5' });
		});

		it('should resolve an object with multiple types of color values', () => {
			const store = resolveColorsObject({
				key1: undefined,
				key2: '#abcdef',
				key3: 'lightOnly',
				key4: 'myColor1',
				key5: '  myColor2  ',
				key6: ['#abcdef', '#fedcba'],
				key7: ['#abcdef'],
				key8: ['myColor1', 'myColor2'],
				key9: ['lightOnly']
			});

			setAppearance('light');
			expect(get(store)).toEqual({
				key1: undefined,
				key2: '#abcdef',
				key3: '#abcdef',
				key4: 'light_myColor1',
				key5: 'light_myColor2',
				key6: '#abcdef',
				key7: '#abcdef',
				key8: 'light_myColor1',
				key9: '#abcdef'
			});

			setAppearance('dark');
			expect(get(store)).toEqual({
				key1: undefined,
				key2: '#176ab5',
				key3: '#176ab5',
				key4: 'dark_myColor1',
				key5: 'dark_myColor2',
				key6: '#fedcba',
				key7: '#176ab5',
				key8: 'dark_myColor2',
				key9: '#176ab5'
			});
		});
	});

	describe('resolveColorPalette', () => {
		it('should leave undefined as is', () => {
			const store = resolveColorPalette(undefined);

			setAppearance('light');
			expect(get(store)).toBe(undefined);

			setAppearance('dark');
			expect(get(store)).toBe(undefined);
		});

		it('should leave hex codes as is', () => {
			const store = resolveColorPalette(['#abcdef', '#fedcba']);

			setAppearance('light');
			expect(get(store)).toEqual(['#abcdef', '#fedcba']);

			setAppearance('dark');
			expect(get(store)).toEqual(['#abcdef', '#fedcba']);
		});

		it('should resolve theme colors from color palette', () => {
			const store = resolveColorPalette(['myColor1', 'myColor2']);

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColor1', 'light_myColor2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColor1', 'dark_myColor2']);
		});

		it('should resolve theme colors from color palette and ignore extraneous whitespace', () => {
			const store = resolveColorPalette(['  myColor1  ', '  myColor2  ']);

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColor1', 'light_myColor2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColor1', 'dark_myColor2']);
		});

		it('should return undefined if color palette doesnt exist in theme', () => {
			const store = resolveColorPalette('nonExistentPalette');

			setAppearance('light');
			expect(get(store)).toBe(undefined);

			setAppearance('dark');
			expect(get(store)).toBe(undefined);
		});

		it('should resolve color palettes in theme', () => {
			const store = resolveColorPalette('myColorPalette1');

			setAppearance('light');
			expect(get(store)).toEqual([
				'light_myColorPalette1_color1',
				'light_myColorPalette1_color2',
				'light_myColorPalette1_color3'
			]);

			setAppearance('dark');
			expect(get(store)).toEqual([
				'dark_myColorPalette1_color1',
				'dark_myColorPalette1_color2',
				'dark_myColorPalette1_color3'
			]);
		});

		it('should resolve color palettes in theme and ignore extraneous whitespace', () => {
			const store = resolveColorPalette('  myColorPalette2  ');

			setAppearance('light');
			expect(get(store)).toEqual([
				'light_myColorPalette2_color1',
				'light_myColorPalette2_color2',
				'light_myColorPalette2_color3'
			]);

			setAppearance('dark');
			expect(get(store)).toEqual([
				'dark_myColorPalette2_color1',
				'dark_myColorPalette2_color2',
				'dark_myColorPalette2_color3'
			]);
		});

		it('should resolve color palettes containing tuples of hex codes', () => {
			const store = resolveColorPalette([
				['#abcdef', '#fedcba'],
				['#123456', '#654321']
			]);

			setAppearance('light');
			expect(get(store)).toEqual(['#abcdef', '#123456']);

			setAppearance('dark');
			expect(get(store)).toEqual(['#fedcba', '#654321']);
		});

		it('should resolve color palettes containing tuples of theme colors', () => {
			const store = resolveColorPalette([
				['myColor1', 'myColor2'],
				['myColor2', 'myColor1']
			]);

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColor1', 'light_myColor2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColor2', 'dark_myColor1']);
		});
	});

	describe('resolveColorScale', () => {
		it('should leave undefined as is', () => {
			const store = resolveColorScale(undefined);

			setAppearance('light');
			expect(get(store)).toBe(undefined);

			setAppearance('dark');
			expect(get(store)).toBe(undefined);
		});

		it('should leave hex codes as is', () => {
			const store = resolveColorScale(['#abcdef', '#fedcba']);

			setAppearance('light');
			expect(get(store)).toEqual(['#abcdef', '#fedcba']);

			setAppearance('dark');
			expect(get(store)).toEqual(['#abcdef', '#fedcba']);
		});

		it('should resolve theme colors from color scale', () => {
			const store = resolveColorScale(['myColor1', 'myColor2']);

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColor1', 'light_myColor2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColor1', 'dark_myColor2']);
		});

		it('should resolve theme colors from color scale and ignore extraneous whitespace', () => {
			const store = resolveColorScale(['  myColor1  ', '  myColor2  ']);

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColor1', 'light_myColor2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColor1', 'dark_myColor2']);
		});

		it('should return undefined if color scale doesnt exist in theme', () => {
			const store = resolveColorScale('nonExistentScale');

			setAppearance('light');
			expect(get(store)).toBe(undefined);

			setAppearance('dark');
			expect(get(store)).toBe(undefined);
		});

		it('should resolve color scales in theme', () => {
			const store = resolveColorScale('myColorScale1');

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColorScale1_color1', 'light_myColorScale1_color2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColorScale1_color1', 'dark_myColorScale1_color2']);
		});

		it('should resolve color scales in theme and ignore extraneous whitespace', () => {
			const store = resolveColorScale('  myColorScale2  ');

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColorScale2_color1', 'light_myColorScale2_color2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColorScale2_color1', 'dark_myColorScale2_color2']);
		});

		it('should resolve color scales containing tuples of hex codes', () => {
			const store = resolveColorScale([
				['#abcdef', '#fedcba'],
				['#123456', '#654321']
			]);

			setAppearance('light');
			expect(get(store)).toEqual(['#abcdef', '#123456']);

			setAppearance('dark');
			expect(get(store)).toEqual(['#fedcba', '#654321']);
		});

		it('should resolve color scales containing tuples of theme colors', () => {
			const store = resolveColorScale([
				['myColor1', 'myColor2'],
				['myColor2', 'myColor1']
			]);

			setAppearance('light');
			expect(get(store)).toEqual(['light_myColor1', 'light_myColor2']);

			setAppearance('dark');
			expect(get(store)).toEqual(['dark_myColor2', 'dark_myColor1']);
		});
	});
});
