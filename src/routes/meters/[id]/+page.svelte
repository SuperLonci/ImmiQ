<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import DetailView from '../../../components/DetailView.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailItem from '../../../components/DetailItem.svelte';
    import type {Meter} from '$lib/entities';

    let meter: Meter;
    let loading = true;
    let error: string | null = null;
    $: meterId = page.params.id; // Added $ before page

    onMount(async () => {
        try {
            const response = await fetch(`/api/meters/${meterId}`);
            if (response.ok) {
                meter = await response.json();
            } else {
                const errorData = await response.json();
                error = errorData.message || 'Failed to fetch meter details';
            }
        } catch (error) {
            console.error('Error fetching meter details:', error);
            error = 'An unexpected error occurred';
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
    {#if meter}
        <DetailSection title="Meter Information">
            <DetailItem label="Type">{meter.type}</DetailItem>
            <DetailItem
                    label="Value">{meter.value !== null && meter.value !== undefined ? `${meter.value} ${meter.unit}` : 'Not set'}</DetailItem>
            <DetailItem label="Cost Per Unit">{meter.costPerUnit} per {meter.unit}</DetailItem>
            <DetailItem label="Created">{new Date(meter.createdAt).toLocaleString()}</DetailItem>
            <DetailItem label="Last Updated">{new Date(meter.updatedAt).toLocaleString()}</DetailItem>
        </DetailSection>

        <DetailSection title="Location">
            {#if meter.building}
                <DetailItem label="Building">
                    <a href="/buildings/{meter.buildingId}">{meter.building.name}</a>
                </DetailItem>
            {/if}

            {#if meter.apartment}
                <DetailItem label="Apartment">
                    <a href="/apartments/{meter.apartmentId}">{meter.apartment.name}</a>
                </DetailItem>
            {/if}
        </DetailSection>
    {/if}
</DetailView>