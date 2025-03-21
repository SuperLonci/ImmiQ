<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import type {Tenant} from '$lib/entities';

    let tenant: Tenant;
    $: tenantId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/tenants/${tenantId}`);
            if (response.ok) {
                tenant = await response.json();
            } else {
                console.error('Failed to fetch tenant details');
            }
        } catch (error) {
            console.error('Error fetching tenant details:', error);
        }
    });
</script>

<style>
    .tenant-container {
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

    .tenant-header {
        text-align: left;
        margin-bottom: 20px;
    }

    .tenant-details p {
        margin: 10px 0;
        font-size: 16px;
    }
</style>

{#if tenant}
    <div class="tenant-container">
        <div class="tenant-header">
            <h2 class="text-2xl font-bold text-gray-800 mb-4">Tenant Details</h2>
        </div>
        <div class="tenant-details">
            <p><strong>Name:</strong> {tenant.name}</p>
            <p><strong>Email:</strong> {tenant.email}</p>
            <p><strong>Phone Number:</strong> {tenant.phoneNumber}</p>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading tenant details...</p>
    </div>
{/if}