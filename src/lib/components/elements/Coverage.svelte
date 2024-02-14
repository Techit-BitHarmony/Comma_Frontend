<script lang="ts">
	export let album: object;
</script>

<header class="relative">
	<div class="absolute inset-0 bg-gradient-to-tr from-primary-dark to-transparent px-4 pt-12 xs:px-10 xs:pt-24 flex flex-col rounded overflow-hidden">
		<h1 class="text-gray-light dark:text-gray-light text-2xl xs:text-4xl">{album.albumname}</h1>
		<a href="/member/{album.artistUsername}" class="sm:text-lg text-gray-light dark:text-gray-light dark:hover:text-primary">
			{album.artistNickname}
		</a>
		<div class="mt-4">
			<a href="/album/{album.id}" class="btn bg-primary-dark text-gray-light dark:text-gray-light dark:hover:text-primary">Go to Album</a>
		</div>
	</div>

	<img
		alt="Albums"
		src="{album.imgPath}"
		class="h-52 xs:h-64 w-full object-cover rounded"
	/>
</header>
