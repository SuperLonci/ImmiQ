<script lang="ts">
    import {onMount} from 'svelte';

    interface House {
        id: number;
        name: string;
    }

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
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Houses</h2>
<ul class="space-y-2">
    {#each houses as house}
        <li class="p-4 bg-white shadow rounded-lg cursor-pointer">
            {house.name}
        </li>
    {/each}
</ul>