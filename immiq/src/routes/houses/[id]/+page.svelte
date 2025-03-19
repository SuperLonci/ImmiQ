<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';
    import {generateHouseGraphic} from "$lib/houseGraphic";
    import type {House, Meter} from '$lib/entities';

    let house: House;
    let meters: Meter[] = [];
    $: houseId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/houses/${houseId}`);
            if (response.ok) {
                house = await response.json();
                if (!house.units) {
                    house.units = [];
                }
                if (!house.meters) {
                    house.meters = [];
                }
                meters = house.meters;
            } else {
                console.error('Failed to fetch house details');
            }
        } catch (error) {
            console.error('Error fetching house details:', error);
        }
    });

    function handleUnitClick(event: MouseEvent) {
        const target = event.target as Element;
        const unitGroup = target.closest('.unit-group');
        if (unitGroup) {
            const unitId = unitGroup.getAttribute('data-unit-id');
            if (unitId) {
                goto(`/units/${unitId}`);
            }
        }
    }

    function handleMeterClick(meterId: string) {
        goto(`/meters/${meterId}`);
    }
</script>

<style>
    /* Existing styles */
    .house-container {
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

    .house-graphic-container {
        flex-shrink: 0;
        filter: drop-shadow(3px 5px 2px rgba(0, 0, 0, 0.2));
        padding: 30px;
    }

    .house-content {
        flex: 1;
        min-width: 0;
        padding: 30px;
    }

    .house-header {
        text-align: left;
        margin-bottom: 20px;
    }

    .house-details p {
        margin: 10px 0;
        font-size: 16px;
    }

    .units-list, .meters-list {
        margin-top: 20px;
    }

    .units-list h3, .meters-list h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
    }

    .units-list ul, .meters-list ul {
        list-style-type: none;
        padding: 0;
    }

    .units-list ul li, .meters-list ul li {
        background-color: #fff;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .units-list ul li:hover, .meters-list ul li:hover {
        background-color: #f0f0f0;
    }

    .unit-button, .meter-button {
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

    .unit-button:hover, .meter-button:hover {
        background-color: #f0f0f0;
        color: black;
    }

    .unit-button:focus, .meter-button:focus {
        outline: 2px solid #4a90e2;
    }

    :global(.unit-group:hover rect) {
        stroke-width: 4;
        stroke: #663300;
    }
</style>

{#if house}
    <div class="house-container">
        <div class="house-graphic-container">
            <svg
                    width="220"
                    height={(house.floors || 1) * 70 + 50}
                    xmlns="http://www.w3.org/2000/svg"
                    on:click={handleUnitClick}
                    role="img"
                    aria-label="Schematic representation of the house"
                    aria-hidden="true"
            >
                {@html generateHouseGraphic(house.floors || 1, house.units || [])}
            </svg>
        </div>
        <div class="house-content">
            <div class="house-header">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">{house.name || 'House'}</h2>
            </div>
            <div class="house-details">
                <p><strong>Address:</strong> {house.address || 'No address'}</p>
                <p><strong>Floors:</strong> {house.floors || 1}</p>
                <p><strong>Total Units:</strong> {(house.units && house.units.length) || 0}</p>
            </div>
            {#if house.units && house.units.length > 0}
                <div class="units-list">
                    <h3>Units</h3>
                    <ul>
                        {#each house.units as unit}
                            <li>
                                <button
                                        class="unit-button"
                                        on:click={() => goto(`/units/${unit.id}`)}
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
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading house details...</p>
    </div>
{/if}