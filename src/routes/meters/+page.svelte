<script lang="ts">
    import {onMount} from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import type {Meter} from '$lib/entities';

    let meters: Meter[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/meters');
            if (response.ok) {
                meters = await response.json();
            } else {
                console.error('Failed to fetch meters');
            }
        } catch (error) {
            console.error('Error fetching meters:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
        title="Meters"
        items={meters}
        loading={loading}
        basePath="/meters"
        displayProperty="type"
        emptyMessage="No meters available"
        bind:detailed={showDetailed}
>
    <svelte:fragment slot="item-content" let:item>
        <span>: {item.building?.name || item.apartment?.name || 'N/A'}</span>
    </svelte:fragment>
</EntityList>