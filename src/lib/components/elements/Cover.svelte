<script>
	export let albumname, imgPath, artistNickname, artistUsername, id;

	// imgPath가 null이면 기본 이미지 주소로 설정
	$: {
		if (!imgPath) {
			imgPath = 'https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg';
		}
	}
</script>

<div class="bg-primary-dark dark:bg-primary-light p-3 rounded">
	<a href="/album/{id}" class="group space-y-2 relative" aria-label="Album detail page">
		<div class="w-auto rounded overflow-hidden relative">
			{#if albumname} <span class="sr-only">{albumname}</span>{/if}
			<div
				class="group-hover:bg-gray mix-blend-multiply transition-all absolute inset-0"
			/>
			<img alt="Albums" src="{imgPath}" />
		</div>
		{#if albumname}
			<div class="relative truncate w-32 xs:w-48 sm:w-32 font-bold text-sm text-inverse text-gray-light dark:text-gray-light">
				{albumname}
			</div>
		{/if}
	</a>
	<div class="text-md sm:text-xs">
		<a class="text-inverse text-gray-light dark:text-gray-light dark:hover:text-primary" href="/member/{artistUsername}" aria-label="Artist detail page">
			{artistNickname}
		</a>
	</div>
</div>
