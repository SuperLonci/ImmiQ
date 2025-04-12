<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import EntityDetail from '../../../components/EntityDetail.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import { type Lease, leaseSchema } from '$lib/entities';

    let lease: Lease;
    let loading = true;
    $: leaseId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/leases/${leaseId}`);
            if (response.ok) {
                lease = await response.json();
            } else {
                console.error('Failed to fetch lease details');
            }
        } catch (error) {
            console.error('Error fetching lease details:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityDetail
    title="Lease Details"
    loading={loading}
    entityType="leases"
    schema={leaseSchema}
    entity={lease}
>
    <DetailSection title="Lease Information">
        <DetailItem label="Apartment">{lease?.apartment?.name || 'N/A'}</DetailItem>
        <DetailItem label="Tenant">{lease?.tenant?.name || 'N/A'}</DetailItem>
        <DetailItem label="Start Date">{new Date(lease?.startDate).toLocaleDateString()}</DetailItem>
        <DetailItem
            label="End Date">{lease?.endDate ? new Date(lease?.endDate).toLocaleDateString() : 'N/A'}</DetailItem>
        <DetailItem label="Rent Amount">${lease?.rentAmount}</DetailItem>
        <DetailItem label="Currency">{lease?.currency}</DetailItem>
    </DetailSection>
</EntityDetail>