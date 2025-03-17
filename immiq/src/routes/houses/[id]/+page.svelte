<script lang="ts">
    import {onMount} from 'svelte';
    import {page} from '$app/state';
    import {goto} from '$app/navigation';

    interface Unit {
        id: string;
        name: string;
        floor: number;
    }

    interface House {
        id: string;
        name: string;
        address: string;
        floors: number;
        units: Unit[];
    }

    let house: House;
    $: houseId = page.params.id;

    onMount(async () => {
        try {
            const response = await fetch(`/api/houses/${houseId}`);
            if (response.ok) {
                house = await response.json();
                if (!house.units) {
                    house.units = [];
                }
            } else {
                console.error('Failed to fetch house details');
            }
        } catch (error) {
            console.error('Error fetching house details:', error);
        }
    });

    function generateHouseGraphic(floors: number, units: Unit[] = []): string {
        const floorHeight = 70;
        const floorWidth = 220;
        const roofHeight = 50;
        const backgroundColor = "#FFF8E1";
        const strokeWidth = 2.5;

        // Start SVG content
        let svgContent = '';

        // Add roof with thicker stroke
        svgContent += `<polygon points="${floorWidth / 2},0 ${floorWidth},${roofHeight} 0,${roofHeight}" style="fill:#ca6031;stroke:black;stroke-width:${strokeWidth}" />`;

        // Process each floor from bottom to top
        for (let i = 0; i < floors; i++) {
            const floorNumber = i; // Start with 0
            const y = roofHeight + (floors - i - 1) * floorHeight; // Position from top to bottom visually

            // Add floor base with beige color
            svgContent += `<rect x="0" y="${y}" width="${floorWidth}" height="${floorHeight}" style="fill:${backgroundColor};stroke:black;stroke-width:${strokeWidth}" />`;

            // Get units for this floor
            const unitsOnFloor = units.filter(unit => unit.floor === floorNumber);

            if (unitsOnFloor.length > 0) {
                const unitWidth = floorWidth / unitsOnFloor.length;

                // Add units
                unitsOnFloor.forEach((unit, index) => {
                    const x = index * unitWidth;
                    // Get color based on overall unit index, not per floor
                    const unitIndex = units.findIndex(u => u.id === unit.id);
                    const unitColor = getUnitColor(unitIndex);

                    // Create unit rectangle with thick border
                    svgContent += `<g class="unit-group" data-unit-id="${unit.id}">
                        <rect
                            x="${x}"
                            y="${y}"
                            width="${unitWidth}"
                            height="${floorHeight}"
                            style="fill:${unitColor};stroke:black;stroke-width:${strokeWidth};cursor:pointer" />`;

                    // Format unit name to fit in two lines if needed
                    let unitName = unit.name || 'Unit';

                    // If the name is long, split it into two lines
                    if (unitName.length > 8) {
                        // Split approximately in half
                        const midpoint = Math.ceil(unitName.length / 2);
                        const firstLine = unitName.substring(0, midpoint);
                        const secondLine = unitName.substring(midpoint);

                        svgContent += `
                            <text
                                x="${x + unitWidth / 2}"
                                y="${y + floorHeight / 2 - 10}"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                font-size="16"
                                font-weight="bold"
                                style="pointer-events:none">${firstLine}</text>
                            <text
                                x="${x + unitWidth / 2}"
                                y="${y + floorHeight / 2 + 10}"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                font-size="16"
                                font-weight="bold"
                                style="pointer-events:none">${secondLine}</text>`;
                    } else {
                        // If name is short, just one line centered
                        svgContent += `
                            <text
                                x="${x + unitWidth / 2}"
                                y="${y + floorHeight / 2}"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                font-size="16"
                                font-weight="bold"
                                style="pointer-events:none">${unitName}</text>`;
                    }

                    svgContent += `</g>`;
                });
            }
        }

        return svgContent;
    }

    // Helper function to get different colors for units - beige-based palette
    function getUnitColor(index: number): string {
        const colors = [
            '#FFEFD5', '#FFE4C4', '#FFDAB9', '#F5DEB3', '#FFE4B5',
            '#FFF0DB', '#FFEBCD', '#FAEBD7', '#FFF8DC', '#FAF0E6',
            '#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE', '#DA70D6',
            '#E0FFFF', '#AFEEEE', '#B0E0E6', '#B0C4DE', '#ADD8E6'
        ];
        return colors[index % colors.length];
    }

    function handleUnitClick(event: MouseEvent) {
        const target = event.target as Element;
        const unitGroup = target.closest('.unit-group');
        if (unitGroup) {
            const unitId = unitGroup.getAttribute('data-unit-id');
            if (unitId) {
                goto(`/units/${unitId}`);
            }
        }
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
        filter: drop-shadow(3px 5px 2px rgba(0, 0, 0, 0.2));
    }

    :global(.unit-group) {
        cursor: pointer;
    }

    :global(.unit-group:hover rect) {
        stroke-width: 4;
        stroke: #663300;
    }
</style>

{#if house}
    <div class="house-container">
        <div class="house-graphic">
            <svg
                    width="220"
                    height={(house.floors || 1) * 70 + 50}
                    xmlns="http://www.w3.org/2000/svg"
                    on:click={handleUnitClick}
                    role="img"
                    aria-label="Schematic representation of the house"
                    aria-hidden="true"
            >
                {@html generateHouseGraphic(house.floors || 1, house.units || [])}
            </svg>
        </div>
        <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-4">{house.name || 'House'}</h2>
            <p>Address: {house.address || 'No address'}</p>
            <p>Floors: {house.floors || 1}</p>
            <p>Units: {(house.units && house.units.length) || 0}</p>
        </div>
    </div>
{:else}
    <div class="flex justify-center items-center h-64">
        <p>Loading house details...</p>
    </div>
{/if}