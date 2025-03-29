<script lang="ts">
    import {onMount} from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import {type Cost, costSchema} from '$lib/entities';

    let costs: Cost[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/costs');
            if (response.ok) {
                costs = await response.json();
            } else {
                console.error('Failed to fetch cost details');
            }
        } catch (error) {
            console.error('Error fetching cost details:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
        title="Costs"
        items={costs}
        loading={loading}
        basePath="/costs"
        displayProperty="name"
        emptyMessage="No costs available"
        bind:detailed={showDetailed}
        showAddButton={true}
        schema={costSchema}
>
    <svelte:fragment slot="item-content" let:item>
        <span>: {item.amount} {item.currency}</span>
    </svelte:fragment>
</EntityList>