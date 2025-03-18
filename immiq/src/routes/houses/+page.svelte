<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {House} from '$lib/entities';

    let houses: House[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/houses');
            if (response.ok) {
                houses = await response.json();
            } else {
                console.error('Failed to fetch houses');
            }
        } catch (error) {
            console.error('Error fetching houses:', error);
        }
    });

    function viewHouseDetails(id: string) {
        goto(`/houses/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Houses</h2>
<ul class="space-y-2">
    {#each houses as house}
        <li>
            <button class="list-item-button" on:click={() => viewHouseDetails(house.id)}>
                {house.name}
            </button>
        </li>
    {/each}
</ul>