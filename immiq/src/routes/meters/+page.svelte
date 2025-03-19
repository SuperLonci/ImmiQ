<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {Meter} from '$lib/entities';

    let meters: Meter[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/meters');
            if (response.ok) {
                meters = await response.json();
            } else {
                console.error('Failed to fetch meters');
            }
        } catch (error) {
            console.error('Error fetching meters:', error);
        }
    });

    function viewMeterDetails(id: string) {
        goto(`/meters/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Meters</h2>
<ul class="space-y-2">
    {#each meters as meter}
        <li>
            <button class="list-item-button" on:click={() => viewMeterDetails(meter.id)}>
                {meter.type} - {meter.building?.name || meter.apartment?.name || 'N/A'}
            </button>
        </li>
    {/each}
</ul>