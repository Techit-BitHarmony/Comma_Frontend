const { fontFamily } = require('tailwindcss/defaultTheme');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',

	theme: {
		container: {
			center: true,
			screens: {
				'2xl': '768px'
			},
			padding: {
				DEFAULT: '0.5rem',
				md: '0rem'
			}
		},
		fontFamily: {
			sans: ['Raleway', ...fontFamily.sans]
		},
		extend: {
			screens: {
				xs: '465px'
				// => @media (min-width: 465px) { ... }
			},
			colors: {
				transparent: 'transparent',
				current: 'currentColor',
				white: '#FFF',
				black: '#000',
				gray: {
					// Light gray
					light: '#F5F5F5',
					// Dark gray
					DEFAULT: '#e8e8e8',
					// Night
					dark: '#121113'
				},
				primary: {
					// Light slate gray
					light: 'rgba(76,88,122,0.75)',
					// Cornflower blue
					DEFAULT: '#6495ED',
					// Eerie black
					dark: '#151816'
				}
			},
		}
	},

	plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography'), require('daisyui')]
};

module.exports = config;
