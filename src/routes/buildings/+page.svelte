<script lang="ts">
    import {onMount} from 'svelte';
    import {goto} from '$app/navigation';
    import type {Building} from '$lib/entities';

    let buildings: Building[] = [];

    onMount(async () => {
        try {
            const response = await fetch('/api/buildings');
            if (response.ok) {
                buildings = await response.json();
            } else {
                console.error('Failed to fetch buildings');
            }
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
    });

    function viewHouseDetails(id: string) {
        goto(`/buildings/${id}`);
    }
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Houses</h2>
<ul class="space-y-2">
    {#each buildings as house}
        <li>
            <button class="list-item-button" on:click={() => viewHouseDetails(house.id)}>
                {house.name}
            </button>
        </li>
    {/each}
</ul>