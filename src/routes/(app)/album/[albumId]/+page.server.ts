import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => ({
	album: getAlbum(fetch, params.id)
})) satisfies PageServerLoad;
