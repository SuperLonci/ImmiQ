<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import EntityDetail from '../../../components/EntityDetail.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import { type Address, addressSchema } from '$lib/entities';

    let address: Address;
    let loading = true;
    $: addressId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/addresses/${addressId}`);
            if (response.ok) {
                address = await response.json();
            } else {
                console.error('Failed to fetch address details');
            }
        } catch (error) {
            console.error('Error fetching address details:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityDetail
    title="Address Details"
    loading={loading}
    entityType="addresses"
    schema={addressSchema}
    entity={address}
>
    <DetailSection title="Details">
        <DetailItem label="Street">
            {address.street}
        </DetailItem>
        <DetailItem label="House Number">
            {address.houseNumber}
        </DetailItem>
        <DetailItem label="City">
            {address.city}
        </DetailItem>
        <DetailItem label="Postal Code">
            {address.postalCode}
        </DetailItem>
        <DetailItem label="State">
            {address.state}
        </DetailItem>
        <DetailItem label="Country">
            {address.country}
        </DetailItem>
    </DetailSection>
    <DetailSection title="Buildings">
        {#if address?.buildings && address.buildings.length > 0}
            {#each address.buildings as building}
                <DetailItem label="Name">
                    {building.name}
                </DetailItem>
            {/each}
        {:else}
            No buildings
        {/if}
    </DetailSection>
</EntityDetail>