<script lang="ts">
    import {onMount} from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import {type Apartment, apartmentSchema} from '$lib/entities';

    let apartments: Apartment[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/apartments');
            if (response.ok) {
                apartments = await response.json();
            } else {
                console.error('Failed to fetch apartments');
            }
        } catch (error) {
            console.error('Error fetching apartments:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
        title="Apartments"
        items={apartments}
        loading={loading}
        basePath="/apartments"
        displayProperty="name"
        emptyMessage="No apartments available"
        bind:detailed={showDetailed}
        showAddButton={true}
        schema={apartmentSchema}
>
    <svelte:fragment slot="item-content" let:item>
        <span>: {item.building.name}</span>
    </svelte:fragment>
</EntityList>