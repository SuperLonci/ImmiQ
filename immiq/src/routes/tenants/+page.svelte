<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {Tenant} from '$lib/entities';

    let tenants: Tenant[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/tenants');
            if (response.ok) {
                tenants = await response.json();
            } else {
                console.error('Failed to fetch tenants');
            }
        } catch (error) {
            console.error('Error fetching tenants:', error);
        }
    });

    function viewTenantDetails(id: string) {
        goto(`/tenants/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Tenants</h2>
<ul class="space-y-2">
    {#each tenants as tenant}
        <li>
            <button class="list-item-button" on:click={() => viewTenantDetails(tenant.id)}>
                {tenant.name}
            </button>
        </li>
    {/each}
</ul>