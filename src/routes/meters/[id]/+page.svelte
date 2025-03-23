<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import DetailView from '../../../components/DetailView.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import type {Meter} from '$lib/entities';

    let meter: Meter;
    let loading = true;
    $: meterId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/meters/${meterId}`);
            if (response.ok) {
                meter = await response.json();
            } else {
                console.error('Failed to fetch meter details');
            }
        } catch (error) {
            console.error('Error fetching meter details:', error);
        } finally {
            loading = false;
        }
    });
</script>

<DetailView
        title="Meter Details"
        backUrl="/meters"
        loading={loading}
>
    <DetailSection title="Meter Information">
        <DetailItem label="Type">{meter?.type}</DetailItem>
        <DetailItem label="House ID">{meter?.buildingId || 'N/A'}</DetailItem>
        <DetailItem label="Unit ID">{meter?.apartmentId || 'N/A'}</DetailItem>
    </DetailSection>
</DetailView>