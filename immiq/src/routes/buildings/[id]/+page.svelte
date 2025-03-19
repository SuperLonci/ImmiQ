<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {generateHouseGraphic} from "$lib/houseGraphic";
    import type {Building, Meter, Cost} from '$lib/entities';

    let building: Building;
    let meters: Meter[] = [];
    let costs: Cost[] = [];
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
        }
    });

    function handleUnitClick(event: MouseEvent) {
        const target = event.target as Element;
        const unitGroup = target.closest('.unit-group');
        if (unitGroup) {
            const unitId = unitGroup.getAttribute('data-unit-id');
            if (unitId) {
                goto(`/apartments/${unitId}`);
            }
        }
    }

    function handleMeterClick(meterId: string) {
        goto(`/meters/${meterId}`);
    }
</script>

<style>
    .building-container {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
    }

    .building-graphic-container {
        flex-shrink: 0;
        filter: drop-shadow(3px 5px 2px rgba(0, 0, 0, 0.2));
        padding: 30px;
    }

    .building-content {
        flex: 1;
        min-width: 0;
        padding: 30px;
    }

    .building-header {
        text-align: left;
        margin-bottom: 20px;
    }

    .building-details p {
        margin: 10px 0;
        font-size: 16px;
    }

    .apartments-list, .meters-list, .fixed-costs-list {
        margin-top: 20px;
    }

    .apartments-list h3, .meters-list h3, .fixed-costs-list h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
    }

    .apartments-list ul, .meters-list ul, .fixed-costs-list ul {
        list-style-type: none;
        padding: 0;
    }

    .apartments-list ul li, .meters-list ul li, .fixed-costs-list ul li {
        background-color: #fff;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .apartments-list ul li:hover, .meters-list ul li:hover, .fixed-costs-list ul li:hover {
        background-color: #f0f0f0;
    }

    .unit-button, .meter-button, .fixed-cost-button {
        display: block;
        width: 100%;
        padding: 5px;
        text-align: left;
        background: none;
        border: none;
        cursor: pointer;
        border-radius: 2px;
        transition: background-color 0.2s;
        font-family: inherit;
        font-size: inherit;
    }

    .unit-button:hover, .meter-button:hover, .fixed-cost-button:hover {
        background-color: #f0f0f0;
        color: black;
    }

    .unit-button:focus, .meter-button:focus, .fixed-cost-button:focus {
        outline: 2px solid #4a90e2;
    }

    :global(.unit-group:hover rect) {
        stroke-width: 4;
        stroke: #663300;
    }
</style>

{#if building}
    <div class="building-container">
        <div class="building-graphic-container">
            <svg
                    width="220"
                    height={(building.floors || 1) * 70 + 50}
                    xmlns="http://www.w3.org/2000/svg"
                    on:click={handleUnitClick}
                    role="img"
                    aria-label="Schematic representation of the building"
                    aria-hidden="true"
            >
                {@html generateHouseGraphic(building.floors || 1, building.apartments || [])}
            </svg>
        </div>
        <div class="building-content">
            <div class="building-header">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">{building.name || 'House'}</h2>
            </div>
            <div class="building-details">
                <p><strong>Address:</strong> {building.address || 'No address'}</p>
                <p><strong>Floors:</strong> {building.floors || 1}</p>
                <p><strong>Total Units:</strong> {(building.apartments && building.apartments.length) || 0}</p>
            </div>
            {#if building.apartments && building.apartments.length > 0}
                <div class="apartments-list">
                    <h3>Units</h3>
                    <ul>
                        {#each building.apartments as unit}
                            <li>
                                <button
                                        class="unit-button"
                                        on:click={() => goto(`/apartments/${unit.id}`)}
                                        aria-label="View details for {unit.name || 'Unnamed Unit'}"
                                >
                                    <strong>{unit.name || 'Unnamed Unit'}</strong> - Floor {unit.floor}
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
            {#if meters && meters.length > 0}
                <div class="meters-list">
                    <h3>Meters</h3>
                    <ul>
                        {#each meters as meter}
                            <li>
                                <button
                                        class="meter-button"
                                        on:click={() => handleMeterClick(meter.id)}
                                        aria-label="View details for {meter.type} meter"
                                >
                                    <strong>{meter.type}</strong>
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
            {#if costs && costs.length > 0}
                <div class="fixed-costs-list">
                    <h3>Fixed Costs</h3>
                    <ul>
                        {#each costs as cost}
                            <li>
                                <button
                                        class="fixed-cost-button"
                                        aria-label="View details for {cost.name}"
                                >
                                    <strong>{cost.name}</strong> - {cost.amount}
                                </button>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading building details...</p>
    </div>
{/if}