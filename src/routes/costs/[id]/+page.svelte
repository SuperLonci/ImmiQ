<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import DetailView from '../../../components/DetailView.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import type {Cost} from '$lib/entities';

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

<DetailView
        title="Cost Details"
        backUrl="/costs"
        loading={loading}
>
    <DetailSection title="Cost Information">
        <DetailItem label="Description">{cost?.name}</DetailItem>
        <DetailItem label="Amount">{cost?.amount} {cost?.currency}</DetailItem>
        <DetailItem label="Interval">{cost?.interval}</DetailItem>
    </DetailSection>
</DetailView>