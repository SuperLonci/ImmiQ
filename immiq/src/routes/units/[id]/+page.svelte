<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';

    interface Unit {
        id: string;
        name: string;
        floor: number;
    }

    let unit: Unit;
    $: unitId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/units/${unitId}`);
            if (response.ok) {
                unit = await response.json();
            } else {
                console.error('Failed to fetch unit details');
            }
        } catch (error) {
            console.error('Error fetching unit details:', error);
        }
    });
</script>

{#if unit}
    <div>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{unit.name || 'Unit'}</h2>
        <p>Floor: {unit.floor}</p>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading unit details...</p>
    </div>
{/if}