<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import EntityDetail from '../../../components/EntityDetail.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import { type Tenant, tenantSchema } from '$lib/entities';

    let tenant: Tenant;
    let loading = true;
    $: tenantId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/tenants/${tenantId}`);
            if (response.ok) {
                tenant = await response.json();
            } else {
                console.error('Failed to fetch tenant details');
            }
        } catch (error) {
            console.error('Error fetching tenant details:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityDetail
    title="Tenant Details"
    loading={loading}
    entityType="tenants"
    schema={tenantSchema}
    entity={tenant}
>
    <DetailSection title="Tenant Information">
        <DetailItem label="First Name">{tenant?.firstName}</DetailItem>
        <DetailItem label="Name">{tenant?.name}</DetailItem>
        <DetailItem label="Email">{tenant?.email}</DetailItem>
        <DetailItem label="Phone Number">{tenant?.phoneNumber}</DetailItem>
    </DetailSection>
    <DetailSection title="Leases">
        {#if tenant?.leases && tenant.leases.length > 0}
            {#each tenant.leases as lease}
                <DetailItem label="Address">
                    {lease.apartment.building.address.street} {lease.apartment.building.address.houseNumber}
                    , {lease.apartment.building.address.city}
                </DetailItem>
            {/each}
        {:else}
            No active leases
        {/if}
    </DetailSection>
</EntityDetail>