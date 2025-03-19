<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {Apartment} from '$lib/entities';

    let apartments: Apartment[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/apartments');
            if (response.ok) {
                apartments = await response.json();
            } else {
                console.error('Failed to fetch apartments');
            }
        } catch (error) {
            console.error('Error fetching apartments:', error);
        }
    });

    function viewUnitDetails(id: string) {
        goto(`/apartments/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Units</h2>
<ul class="space-y-2">
    {#each apartments as unit}
        <li>
            <button class="list-item-button" on:click={() => viewUnitDetails(unit.id)}>
                {unit.name}
            </button>
        </li>
    {/each}
</ul>