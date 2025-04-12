<script lang="ts">
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { generateHouseGraphic } from '$lib/houseGraphic';
    import EntityDetail from '../../../components/EntityDetail.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailButton from '../../../components/DetailButton.svelte';
    import { type Building, type Meter, type Cost } from '$lib/entities';
    import { buildingSchema } from '$lib/entities.js';

    let building: Building;
    let meters: Meter[] = [];
    let costs: Cost[] = [];
    let loading = true;
    $: buildingId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/buildings/${buildingId}`);
            if (response.ok) {
                building = await response.json();
                if (!building.apartments) {
                    building.apartments = [];
                }
                if (!building.meters) {
                    building.meters = [];
                }
                if (!building.costs) {
                    building.costs = [];
                }
                meters = building.meters;
                costs = building.costs;
            } else {
                console.error('Failed to fetch building details');
            }
        } catch (error) {
            console.error('Error fetching building details:', error);
        } finally {
            loading = false;
        }
    });

    function handleUnitClick(event: MouseEvent) {
        const target = event.target as Element;
        const apartmentGroup = target.closest('.apartment-group');
        if (apartmentGroup) {
            const apartmentId = apartmentGroup.getAttribute('data-apartment-id');
            if (apartmentId) {
                goto(`/apartments/${apartmentId}`);
            }
        }
    }
</script>

<EntityDetail
    title={building?.name || 'House'}
    loading={loading}
    entityType="buildings"
    schema={buildingSchema}
    entity={building}
>
    <svelte:fragment slot="graphic">
        <div class="building-graphic-container">
            <svg
                width="220"
                height={(building?.floors || 1) * 70 + 50}
                xmlns="http://www.w3.org/2000/svg"
                on:click={handleUnitClick}
                role="img"
                aria-label="Schematic representation of the building"
                aria-hidden="true"
            >
                {@html generateHouseGraphic(building?.floors || 1, building?.apartments || [])}
            </svg>
        </div>
    </svelte:fragment>

    <DetailSection title="Details">
        <p><strong>Floors:</strong> {building?.floors || 1}</p>
        <p><strong>Total Units:</strong> {(building?.apartments && building.apartments.length) || 0}</p>
        <p><strong>Address:</strong></p>
        <ul>
            <li>Street: {building?.address.street || 'N/A'}</li>
            <li>House Number: {building?.address.houseNumber || 'N/A'}</li>
            <li>City: {building?.address.city || 'N/A'}</li>
            <li>Postal Code: {building?.address.postalCode || 'N/A'}</li>
            <li>State: {building?.address.state || 'N/A'}</li>
            <li>Country: {building?.address.country || 'N/A'}</li>
        </ul>
    </DetailSection>

    <DetailSection title="Units">
        <ul>
            {#each building?.apartments || [] as apartment}
                <DetailButton clickable={true} href={`/apartments/${apartment.id}`}>
                    {apartment.name || 'Unnamed Unit'} - Floor {apartment.floor}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Building Meters">
        <ul>
            {#each meters || [] as meter}
                <DetailButton clickable={true} href={`/meters/${meter.id}`}>
                    {meter.type} - {meter.value} {meter.unit}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Building Costs">
        <ul>
            {#each costs || [] as cost}
                <DetailButton clickable={true} href={`/costs/${cost.id}`}>
                    {cost.name} - {cost.amount} {cost.currency}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>
</EntityDetail>