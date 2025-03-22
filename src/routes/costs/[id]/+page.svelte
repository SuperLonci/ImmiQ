<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import type {Cost} from '$lib/entities';

    let cost: Cost;
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
        }
    });
</script>

<style>
    .cost-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
    }

    .cost-header {
        text-align: left;
        margin-bottom: 20px;
    }

    .cost-details p {
        margin: 10px 0;
        font-size: 16px;
    }
</style>

{#if cost}
    <div class="cost-container">
        <div class="cost-header">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Cost Details</h2>
        </div>
        <div class="cost-details">
            <p><strong>Description:</strong> {cost.name}</p>
            <p><strong>Amount:</strong> {cost.amount} {cost.currency}</p>
            <p><strong>Interval:</strong> {cost.interval}</p>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading cost details...</p>
    </div>
{/if}