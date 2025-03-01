<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<div data-theme="my-custom-theme">
	<AppShell>
		<svelte:fragment slot="header">
			<AppBar class="bg-primary-500">
				<svelte:fragment slot="lead">
					<strong class="text-xl uppercase text-on-primary">Luma</strong>
				</svelte:fragment>
				<svelte:fragment slot="trail">
					<a
						class="btn btn-sm variant-ghost-primary"
						href="/docs"
						rel="noreferrer"
					>
						Docs
					</a>
					<a
						class="btn btn-sm variant-ghost-primary"
						href="https://github.com/yourusername/luma"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					<a
						class="btn btn-sm variant-ghost-primary"
						href="/meetings"
						rel="noreferrer"
					>
						Meetings
					</a>
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>
		
		<!-- Main Content -->
		<slot />
	</AppShell>
</div>