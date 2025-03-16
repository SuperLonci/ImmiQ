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

    function generateHouseGraphic(floors: number) {
        const floorHeight = 50;
        const floorWidth = 150;
        const roofHeight = 30;
        const totalHeight = floors * floorHeight + roofHeight;
        const totalWidth = floorWidth;

        let svgContent = `<polygon points="${totalWidth / 2},0 ${totalWidth},${roofHeight} 0,${roofHeight}" style="fill:gray;stroke:black;stroke-width:1" />`;

        for (let i = 0; i < floors; i++) {
            const y = roofHeight + i * floorHeight;
            svgContent += `<rect x="0" y="${y}" width="${floorWidth}" height="${floorHeight}" style="fill:white;stroke:black;stroke-width:1" />`;
        }

        return `<svg width="${totalWidth}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`;
    }
</script>

<style>
    .house-container {
        display: flex;
        align-items: flex-start;
        margin-top: 30px;
    }

    .house-graphic {
        margin-right: 50px;
        margin-left: 30px;
    }
</style>

{#if house}
    <div class="house-container">
        <div class="house-graphic">
            {@html generateHouseGraphic(house.floors)}
        </div>
        <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{house.name}</h2>
            <p>Address: {house.address}</p>
            <p>Floors: {house.floors}</p>
        </div>
    </div>
{/if}