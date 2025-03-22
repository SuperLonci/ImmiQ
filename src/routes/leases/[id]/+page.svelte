<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import type {Lease} from '$lib/entities';

    let lease: Lease;
    $: leaseId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/leases/${leaseId}`);
            if (response.ok) {
                lease = await response.json();
            } else {
                console.error('Failed to fetch lease details');
            }
        } catch (error) {
            console.error('Error fetching lease details:', error);
        }
    });
</script>

<style>
    .lease-container {
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

    .lease-header {
        text-align: left;
        margin-bottom: 20px;
    }

    .lease-details p {
        margin: 10px 0;
        font-size: 16px;
    }
</style>

{#if lease}
    <div class="lease-container">
        <div class="lease-header">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Lease Details</h2>
        </div>
        <div class="lease-details">
            <p><strong>Apartment:</strong> {lease.apartment?.name || 'N/A'}</p>
            <p><strong>Tenant:</strong> {lease.tenant?.name || 'N/A'}</p>
            <p><strong>Start Date:</strong> {new Date(lease.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Rent Amount:</strong> ${lease.rentAmount}</p>
            <p><strong>Currency:</strong> {lease.currency}</p>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading lease details...</p>
    </div>
{/if}