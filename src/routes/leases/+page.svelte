<script lang="ts">
    import {onMount} from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import type {Lease} from '$lib/entities';

    let leases: Lease[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/leases');
            if (response.ok) {
                leases = await response.json();
            } else {
                console.error('Failed to fetch leases');
            }
        } catch (error) {
            console.error('Error fetching leases:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
        title="Leases"
        items={leases}
        loading={loading}
        basePath="/leases"
        displayProperty=""
        emptyMessage="No leases available"
        bind:detailed={showDetailed}
>
    <svelte:fragment slot="item-content" let:item>
        <span>{item.apartment.name}: {item.tenant.name}</span>
    </svelte:fragment>
</EntityList>