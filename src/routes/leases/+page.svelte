<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {Lease} from '$lib/entities';

    let leases: Lease[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/leases');
            if (response.ok) {
                leases = await response.json();
            } else {
                console.error('Failed to fetch leases');
            }
        } catch (error) {
            console.error('Error fetching leases:', error);
        }
    });

    function viewLeaseDetails(id: string) {
        goto(`/leases/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Leases</h2>
<ul class="space-y-2">
    {#each leases as lease}
        <li>
            <button class="list-item-button" on:click={() => viewLeaseDetails(lease.id)}>
                {lease.apartment?.name || 'N/A'} - {lease.tenant?.name || 'N/A'}
            </button>
        </li>
    {/each}
</ul>