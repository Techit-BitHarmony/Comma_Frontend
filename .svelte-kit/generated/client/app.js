export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14'),
	() => import('./nodes/15'),
	() => import('./nodes/16'),
	() => import('./nodes/17'),
	() => import('./nodes/18'),
	() => import('./nodes/19'),
	() => import('./nodes/20'),
	() => import('./nodes/21'),
	() => import('./nodes/22'),
	() => import('./nodes/23'),
	() => import('./nodes/24'),
	() => import('./nodes/25')
];

export const server_loads = [];

export const dictionary = {
		"/(app)": [~2],
		"/(app)/album/modify/[albumId]": [3],
		"/(app)/album/release": [4],
		"/(app)/album/[albumId]": [~5],
		"/(app)/credit": [6],
		"/(app)/credit/charge": [7],
		"/(app)/credit/charge/payment": [8],
		"/(app)/credit/charge/payment/fail": [9],
		"/(app)/credit/charge/payment/success": [10],
		"/(app)/credit/withdraw": [11],
		"/(app)/credit/withdraw/admin": [12],
		"/(legal)/imprint": [25],
		"/(app)/member/join": [13],
		"/(app)/member/login": [14],
		"/(app)/member/[username]": [~15],
		"/(app)/member/[username]/albums": [~16],
		"/(app)/member/[username]/community": [17],
		"/(app)/member/[username]/community/modify": [18],
		"/(app)/member/[username]/community/write": [19],
		"/(app)/member/[username]/donation": [20],
		"/(app)/member/[username]/donation/list": [21],
		"/(app)/member/[username]/modify": [22],
		"/(app)/member/[username]/modify/password": [23],
		"/(app)/search": [~24]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.js';