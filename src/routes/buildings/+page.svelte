<script lang="ts">
    import {onMount} from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import type {Building} from '$lib/entities';
    import {buildingSchema} from '$lib/entities';

    let buildings: Building[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/buildings');
            if (response.ok) {
                buildings = await response.json();
            } else {
                console.error('Failed to fetch buildings');
            }
        } catch (error) {
            console.error('Error fetching buildings:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
        title="Buildings"
        items={buildings}
        loading={loading}
        basePath="/buildings"
        displayProperty="name"
        emptyMessage="No buildings available"
        bind:detailed={showDetailed}
        showAddButton={true}
        schema={buildingSchema}
>
    <svelte:fragment slot="item-content" let:item>
        <span>: {item.address}</span>
    </svelte:fragment>
</EntityList>