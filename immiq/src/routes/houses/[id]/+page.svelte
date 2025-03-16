<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/stores';

    interface House {
        id: string;
        name: string;
        address: string;
        floors: number;
    }

    let house: House | null = null;
    let houseId: string;

    $: houseId = $page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/houses/${houseId}`);
            if (response.ok) {
                house = await response.json();
            } else {
                console.error('Failed to fetch house details');
            }
        } catch (error) {
            console.error('Error fetching house details:', error);
        }
    });
</script>

{#if house}
    <h2 class="text-2xl font-bold text-gray-800 mb-4">{house.name}</h2>
    <p>Address: {house.address}</p>
    <p>Floors: {house.floors}</p>
{/if}