<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 text-center flex flex-col items-center">
		<h1 class="text-4xl font-bold text-primary-600">Welcome to Luma</h1>
		
		<!-- Luma Logo Section -->
		<figure class="relative group">
			<div class="absolute inset-0 bg-primary-400/20 rounded-full blur-3xl animate-pulse" />
			<svg
				class="w-64 h-64 md:w-80 md:h-80 text-primary-500"
				viewBox="0 0 100 100"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z"
					fill="currentColor"
					fill-opacity="0.1"
				/>
				<path
					d="M50 75L25 50L35 40L50 55L65 40L75 50L50 75Z"
					fill="currentColor"
				/>
				<path
					d="M50 30L30 50L40 60L50 50L60 60L70 50L50 30Z"
					fill="currentColor"
				/>
			</svg>
		</figure>

		<div class="flex flex-col gap-4">
			<a
				href="/docs"
				class="btn variant-filled-primary px-8 py-3 text-lg"
			>
				Get Started
			</a>
			
			<div class="flex gap-4 justify-center">
				<a
					href="/docs"
					class="btn variant-ghost-primary"
				>
					Documentation
				</a>
				<a
					href="https://github.com/yourusername/luma"
					target="_blank"
					class="btn variant-ghost-primary"
					rel="noreferrer"
				>
					GitHub
				</a>
			</div>
		</div>

		<div class="text-surface-500 mt-8">
			<p class="text-sm">Start building with Luma design system</p>
		</div>
	</div>
</div>

<style lang="postcss">
	figure {
		@apply relative transition-transform duration-300 hover:scale-105;
	}
	
	@keyframes pulse {
		50% {
			opacity: 0.3;
		}
	}
</style>