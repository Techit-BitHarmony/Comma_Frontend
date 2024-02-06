import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, params }) => ({
	artist: getArtist(fetch, params.id),
	albums: getArtistAlbums(fetch, params.id, 50)
})) satisfies PageServerLoad;
