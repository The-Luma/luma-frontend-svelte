<script lang="ts">
	import '../app.postcss';
	import { AppShell, initializeStores } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';

	// Initialize stores
	initializeStores();
</script>

<Toast />

<div data-theme="luma-original-theme">
	<AppShell>
		<slot />
	</AppShell>
</div>
