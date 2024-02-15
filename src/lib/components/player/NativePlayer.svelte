<script>
	import { fly } from 'svelte/transition';
	import { audioTrack } from '$components/store';
	import Hls from "hls.js";

	let audio;
	let paused = false;
	let currentTime;
	let duration;
	let hls;
	let volume = 0.5;

	$: {
		if($audioTrack) {
			if (Hls.isSupported() && $audioTrack.cdnUrl) { // HLS가 지원되는지 확인
				hls = new Hls();
				hls.loadSource($audioTrack.cdnUrl); // HLS 소스를 로드
				hls.attachMedia(audio); // audio를 hls에 연결
				hls.on(Hls.Events.MANIFEST_PARSED, function() {
					paused = false;
					audio.play();
				});
			}
		}
	}

	function resetAudioTrack() {
		audioTrack.set(null);
	}

</script>

{#if $audioTrack}
	<audio
			id="audio"
			bind:this={audio}
			autoplay={true}
			bind:paused={paused}
			bind:currentTime={currentTime}
			bind:duration={duration}
			bind:volume={volume}
	/>

	<div transition:fly={{ y: 60 }} class="bg-gray dark:bg-primary-dark w-full backdrop-blur-md border-t border-white/10">
		<div class="w-full bg-gray-300 dark:bg-primary-light rounded-sm h-1">
			<div class="bg-gray-dark dark:bg-primary h-1 rounded-sm transition-all duration-75"
				 style="width: {(currentTime * 100) / duration}%"
			/>
		</div>

		<div class="container py-4">
			<div class="flex space-x-2">
				<div class="hidden sm:flex shrink-0">
					{#if $audioTrack.imageUrl}
						<img
								alt="Albums"
								src={$audioTrack.imageUrl}
								class="w-14 h-14 object-cover rounded"
						/>
					{:else}
						<img
								alt="Albums"
								src="https://kv6d2rdb2209.edge.naverncp.com/GSctnLFiOr/defaultimage.jpg?type=f&w=300&h=300&ttype=jpg"
								class="w-14 h-14 object-cover rounded"
						/>
					{/if}

					<div class="w-14 h-14 absolute bg-primary-dark/50 overflow-hidden rounded" />
					<button
							type="button"
							class="absolute w-14 h-14 flex justify-center items-center text-gray-light z-20 drop-shadow"
							aria-label="Pause"
							on:click={() => (paused ? audio.play() : audio.pause())}
					>
						{#if paused}
							<i class="fa-solid fa-play"></i>
						{:else}
							<i class="fa-solid fa-pause"></i>
						{/if}
					</button>
				</div>

				<div class="flex flex-row-reverse w-full">
					<div class="flex items-start justify-end">
						<button class="float-right text-gray-dark dark:text-primary" on:click={resetAudioTrack}>
							<i class="gg-close" />
						</button>
					</div>
					<div class="flex items-end justify-end">
						<input class="range dark:range-primary range-xs" type="range" min="0" max="1" step="0.01" bind:value={volume} />
					</div>
					<dl class="w-full text-primary-dark dark:text-primary-light">
						<dt class="text-xs sm:text-sm font-bold truncate w-full">{$audioTrack.name}</dt>
						<div class="flex flex-wrap">
							<dd class="text-xs sm:text-sm font-light space-x-2">
								<a href="/artist/{$audioTrack.artistUsername}">{$audioTrack.artistNickname}</a>
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	</div>
{/if}
