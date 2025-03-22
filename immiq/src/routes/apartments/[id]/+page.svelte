<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {generateHouseGraphic} from '$lib/houseGraphic';
    import type {Apartment, Meter, Cost, Tenant} from '$lib/entities';

    let apartment: Apartment;
    let buildingMeters: Meter[] = [];
    let buildingCosts: Cost[] = [];
    let tenant: Tenant;
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
        }
    });

    function goBack() {
        goto('/apartments');
    }
</script>

<style>
    .apartment-container {
        display: flex;
        flex-direction: row; /* Explicitly set to row to ensure horizontal layout */
        align-items: flex-start; /* Align items at the top */
        gap: 20px; /* Space between the graphic and content */
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
    }

    .house-graphic-container {
        flex-shrink: 0; /* Prevent shrinking */
        filter: drop-shadow(3px 5px 2px rgba(0, 0, 0, 0.2));
        padding: 30px;
    }

    .apartment-content {
        flex: 1;
        min-width: 0; /* Allow content to shrink below its natural width if needed */
        padding: 30px;
    }

    .apartment-header {
        text-align: left; /* Align text to the left */
        margin-bottom: 20px;
    }

    .apartment-details {
        width: 100%;
    }

    .apartment-details p {
        margin: 10px 0;
        font-size: 16px;
    }

    .apartment-details h3 {
        margin-top: 20px;
        font-size: 18px;
        color: #333;
    }

    .apartment-details ul {
        list-style-type: none;
        padding: 0;
    }

    .apartment-details ul li {
        background-color: #fff;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

</style>

{#if apartment}
    <div class="apartment-container">
        <div class="header">
            <button on:click={goBack} class="back-button">&#8592;</button>
        </div>
        <div class="house-graphic-container">
            <svg
                    width="220"
                    height={(apartment.floor + 1) * 70 + 50}
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Schematic representation of the house"
                    aria-hidden="true"
            >
                {@html generateHouseGraphic(apartment.floor + 1, [apartment])}
            </svg>
        </div>
        <div class="apartment-content">
            <div class="apartment-header">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">{apartment.name || 'Unit'}</h2>
                <p>Floor: {apartment.floor}</p>
            </div>
            <div class="apartment-details">
                <h3>Tenant</h3>
                {#if tenant}
                    <p>Name: {tenant.name}</p>
                    <p>Email: {tenant.email}</p>
                    <p>Phone: {tenant.phoneNumber}</p>
                {:else}
                    <p>No tenant information available</p>
                {/if}

                <h3>General Rent Information</h3>
                <p>Size: {apartment.size} {apartment.sizeUnit}</p>
                <h4>Base Rent</h4>
                <ul>
                    {#each apartment.costs.filter(cost => cost.type === 'BASE_RENT') as cost}
                        <li>{cost.name} - {cost.amount} {cost.currency}</li>
                    {/each}
                </ul>
                <h4>Service Charge</h4>
                <ul>
                    {#each apartment.costs.filter(cost => cost.type === 'SERVICE_CHARGE') as cost}
                        <li>{cost.name} - {cost.amount} {cost.currency}</li>
                    {/each}
                </ul>

                <h3>Payment Details</h3>
                <ul>
                    {#each apartment.payments as rent}
                        <li>
                            <p>Amount: {rent.amount} {rent.currency}</p>
                            <p>Due Date: {new Date(rent.dueDate).toLocaleDateString()}</p>
                            <p>Status: {rent.status}</p>
                        </li>
                    {/each}
                </ul>

                <h3>Apartment Meters</h3>
                <ul>
                    {#each apartment.meters as meter}
                        <li>{meter.type} - {meter.value} {meter.unit}</li>
                    {/each}
                </ul>

                <h3>Apartment Costs</h3>
                <ul>
                    {#each apartment.costs as cost}
                        <li>{cost.name} - {cost.amount} {cost.currency}</li>
                    {/each}
                </ul>

                <h3>Building Meters</h3>
                <ul>
                    {#each buildingMeters as meter}
                        <li>{meter.type} - {meter.value} {meter.unit}</li>
                    {/each}
                </ul>

                <h3>Building Costs</h3>
                <ul>
                    {#each buildingCosts as cost}
                        <li>{cost.name} - {cost.amount} {cost.currency}</li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading apartment details...</p>
    </div>
{/if}