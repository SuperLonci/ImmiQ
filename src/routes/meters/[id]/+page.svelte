<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import type {Meter} from '$lib/entities';

    let meter: Meter;
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
        }
    });
</script>

<style>
    .meter-container {
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

    .meter-header {
        text-align: left;
        margin-bottom: 20px;
    }

    .meter-details p {
        margin: 10px 0;
        font-size: 16px;
    }
</style>

{#if meter}
    <div class="meter-container">
        <div class="meter-header">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Meter Details</h2>
        </div>
        <div class="meter-details">
            <p><strong>Type:</strong> {meter.type}</p>
            <p><strong>House ID:</strong> {meter.buildingId || 'N/A'}</p>
            <p><strong>Unit ID:</strong> {meter.apartmentId || 'N/A'}</p>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading meter details...</p>
    </div>
{/if}