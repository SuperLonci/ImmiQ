<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {Unit} from '$lib/entities';

    let units: Unit[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/units');
            if (response.ok) {
                units = await response.json();
            } else {
                console.error('Failed to fetch units');
            }
        } catch (error) {
            console.error('Error fetching units:', error);
        }
    });

    function viewUnitDetails(id: string) {
        goto(`/units/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Units</h2>
<ul class="space-y-2">
    {#each units as unit}
        <li>
            <button class="list-item-button" on:click={() => viewUnitDetails(unit.id)}>
                {unit.name}
            </button>
        </li>
    {/each}
</ul>