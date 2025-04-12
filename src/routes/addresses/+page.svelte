<script lang="ts">
    import { onMount } from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import { type Address, addressSchema } from '$lib/entities';

    let addresses: Address[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/addresses');
            if (response.ok) {
                addresses = await response.json();
            } else {
                console.error('Failed to fetch addresses');
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
    title="Addresses"
    items={addresses}
    loading={loading}
    basePath="/addresses"
    displayProperty=""
    emptyMessage="No addresses available"
    bind:detailed={showDetailed}
    showAddButton={true}
    schema={addressSchema}
>
    <svelte:fragment slot="item-content" let:item>
        <span>{item.street} {item.houseNumber}, {item.city}</span>
    </svelte:fragment>
</EntityList>