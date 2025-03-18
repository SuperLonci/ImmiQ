<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {generateHouseGraphic} from '$lib/houseGraphic';
    import type {Unit} from '$lib/entities';

    let unit: Unit;
    $: unitId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/units/${unitId}`);
            if (response.ok) {
                unit = await response.json();
            } else {
                console.error('Failed to fetch unit details');
            }
        } catch (error) {
            console.error('Error fetching unit details:', error);
        }
    });
</script>

<style>
    .unit-container {
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

    .unit-content {
        flex: 1;
        min-width: 0; /* Allow content to shrink below its natural width if needed */
        padding: 30px;
    }

    .unit-header {
        text-align: left; /* Align text to the left */
        margin-bottom: 20px;
    }

    .unit-details {
        width: 100%;
    }

    .unit-details p {
        margin: 10px 0;
        font-size: 16px;
    }

    .unit-details h3 {
        margin-top: 20px;
        font-size: 18px;
        color: #333;
    }

    .unit-details ul {
        list-style-type: none;
        padding: 0;
    }

    .unit-details ul li {
        background-color: #fff;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
</style>

{#if unit}
    <div class="unit-container">
        <div class="house-graphic-container">
            <svg
                    width="220"
                    height={(unit.floor + 1) * 70 + 50}
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Schematic representation of the house"
                    aria-hidden="true"
            >
                {@html generateHouseGraphic(unit.floor + 1, [unit])}
            </svg>
        </div>
        <div class="unit-content">
            <div class="unit-header">
                <h2 class="text-2xl font-bold text-gray-800 mb-4">{unit.name || 'Unit'}</h2>
                <p>Floor: {unit.floor}</p>
            </div>
            <div class="unit-details">
                <h3>Meter Types</h3>
                <ul>
                    {#each unit.meters as meter}
                        <li>{meter.type}</li>
                    {/each}
                </ul>
                <h3>Rent Details</h3>
                <ul>
                    {#each unit.rent as rent}
                        <li>
                            <p>Amount: ${rent.amount}</p>
                            <p>Due Date: {new Date(rent.dueDate).toLocaleDateString()}</p>
                            <p>Status: {rent.status}</p>
                        </li>
                    {/each}
                </ul>
            </div>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading unit details...</p>
    </div>
{/if}