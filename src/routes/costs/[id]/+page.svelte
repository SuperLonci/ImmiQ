<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import EntityDetail from '../../../components/EntityDetail.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import { type Cost, costSchema } from '$lib/entities';

    let cost: Cost;
    let loading = true;
    $: costId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/costs/${costId}`);
            if (response.ok) {
                cost = await response.json();
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

<EntityDetail
    title="Cost Details"
    loading={loading}
    entityType="costs"
    schema={costSchema}
    entity={cost}
>
    <DetailSection title="Cost Information">
        <DetailItem label="Description">{cost?.name}</DetailItem>
        <DetailItem label="Amount">{cost?.amount} {cost?.currency}</DetailItem>
        <DetailItem label="Interval">{cost?.interval}</DetailItem>
        <DetailItem label="Type">{cost?.type}</DetailItem>
        <DetailItem label="Biller">{cost?.biller}</DetailItem>
        <DetailItem
            label="Occurred At">{cost?.occurredAt ? new Date(cost.occurredAt).toLocaleDateString() : 'N/A'}</DetailItem>
        <DetailItem label="Location">{cost.building?.name || cost.apartment?.name || 'N/A'}</DetailItem>
    </DetailSection>
</EntityDetail>