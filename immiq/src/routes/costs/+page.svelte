<script lang="ts">
    import {onMount} from 'svelte';
    import type {Cost} from '$lib/entities';
    import {goto} from "$app/navigation";

    let costs: Cost[] = [];

    onMount(async () => {
        try {
            const response = await fetch(`/api/costs`);
            if (response.ok) {
                costs = await response.json();
            } else {
                console.error('Failed to fetch cost details');
            }
        } catch (error) {
            console.error('Error fetching cost details:', error);
        }
    });

    function viewCostDetails(id: string) {
        goto(`/costs/${id}`);
    }
</script>

<style>
    .cost-item {
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
    }

    .cost-title {
        font-size: 1.3rem;
        font-weight: bold;
        margin-bottom: 10px;
        border-bottom: 2px solid #ccc;
        padding-bottom: 5px;
        display: block;
    }

    .cost-details span {
        margin: 5px 0;
        display: block;
    }
</style>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Costs</h2>
<ul class="space-y-2">
    {#each costs as cost}
        <li class="cost-item">
            <button class="list-item-button" on:click={() => viewCostDetails(cost.id)}>
                <span class="cost-title">
                    {cost.name}
                </span>
                <span class="cost-details">
                    <span><strong>Amount:</strong> {cost.amount} {cost.currency}</span>
                    <span><strong>Interval:</strong> {cost.interval}</span>
                    <span><strong>Occurred At:</strong> {cost.interval}</span>
                </span>
            </button>
        </li>
    {/each}
</ul>