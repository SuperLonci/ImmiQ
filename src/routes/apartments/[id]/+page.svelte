<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {generateHouseGraphic} from '$lib/houseGraphic';
    import DetailView from '../../../components/DetailView.svelte';
    import DetailSection from '../../../components/DetailSection.svelte';
    import DetailButton from '../../../components/DetailButton.svelte';
    import type {Apartment, Meter, Cost, Tenant} from '$lib/entities';

    let apartment: Apartment;
    let buildingMeters: Meter[] = [];
    let buildingCosts: Cost[] = [];
    let tenant: Tenant;
    let loading = true;
    $: apartmentId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/apartments/${apartmentId}`);
            if (response.ok) {
                apartment = await response.json();
                buildingMeters = apartment.building.meters;
                buildingCosts = apartment.building.costs;
                tenant = apartment.leases[0]?.tenant;
            } else {
                console.error('Failed to fetch apartment details');
            }
        } catch (error) {
            console.error('Error fetching apartment details:', error);
        } finally {
            loading = false;
        }
    });
</script>

<DetailView
        title={apartment?.name || 'Unit'}
        backUrl="/apartments"
        loading={loading}
>
    <svelte:fragment slot="graphic">
        <div class="house-graphic-container">
            <svg
                    width="220"
                    height={(apartment?.floor || 0) * 70 + 120}
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Schematic representation of the house"
                    aria-hidden="true"
            >
                {@html generateHouseGraphic(apartment?.floor + 1 || 1, [apartment])}
            </svg>
        </div>
    </svelte:fragment>

    <p>Floor: {apartment?.floor}</p>

    <DetailSection title="Tenant">
        {#if tenant}
            <DetailButton clickable={true} href={`/tenants/${tenant.id}`}>
                <p>Name: {tenant.name}</p>
                <p>Email: {tenant.email}</p>
                <p>Phone: {tenant.phoneNumber}</p>
            </DetailButton>
        {:else}
            <p>No tenant information available</p>
        {/if}
    </DetailSection>

    <DetailSection title="General Rent Information">
        <p>Size: {apartment?.size} {apartment?.sizeUnit}</p>

        <h4>Base Rent</h4>
        <ul>
            {#each apartment?.costs.filter(cost => cost.type === 'BASE_RENT') || [] as cost}
                <DetailButton clickable={true} href={`/costs/${cost.id}`}>
                    {cost.name} - {cost.amount} {cost.currency}
                </DetailButton>
            {/each}
        </ul>

        <h4>Service Charge</h4>
        <ul>
            {#each apartment?.costs.filter(cost => cost.type === 'SERVICE_CHARGE') || [] as cost}
                <DetailButton clickable={true} href={`/costs/${cost.id}`}>
                    {cost.name} - {cost.amount} {cost.currency}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Payment Details">
        <ul>
            {#each apartment?.payments || [] as payment}
                <DetailButton clickable={true} href={`/payments/${payment.id}`}>
                    <p>Amount: {payment.amount} {payment.currency}</p>
                    <p>Due Date: {new Date(payment.dueDate).toLocaleDateString()}</p>
                    <p>Status: {payment.status}</p>
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Apartment Meters">
        <ul>
            {#each apartment?.meters || [] as meter}
                <DetailButton clickable={true} href={`/meters/${meter.id}`}>
                    {meter.type} - {meter.value} {meter.unit}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Apartment Costs">
        <ul>
            {#each apartment?.costs || [] as cost}
                <DetailButton clickable={true} href={`/costs/${cost.id}`}>
                    {cost.name} - {cost.amount} {cost.currency}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Building Meters">
        <ul>
            {#each buildingMeters || [] as meter}
                <DetailButton clickable={true} href={`/meters/${meter.id}`}>
                    {meter.type} - {meter.value} {meter.unit}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>

    <DetailSection title="Building Costs">
        <ul>
            {#each buildingCosts || [] as cost}
                <DetailButton clickable={true} href={`/costs/${cost.id}`}>
                    {cost.name} - {cost.amount} {cost.currency}
                </DetailButton>
            {/each}
        </ul>
    </DetailSection>
</DetailView>