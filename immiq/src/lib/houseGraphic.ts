import type {Apartment} from '$lib/entities';

export function generateHouseGraphic(floors: number, apartments: Apartment[] = []): string {
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

        // Get apartments for this floor
        const apartmentsOnFloor = apartments.filter(unit => unit.floor === floorNumber);

        if (apartmentsOnFloor.length > 0) {
            const unitWidth = floorWidth / apartmentsOnFloor.length;

            // Add apartments
            apartmentsOnFloor.forEach((unit, index) => {
                const x = index * unitWidth;
                // Get color based on overall unit index, not per floor
                const unitIndex = apartments.findIndex(u => u.id === unit.id);
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

function getUnitColor(index: number): string {
    const colors = [
        '#FFEFD5', '#FFE4C4', '#FFDAB9', '#F5DEB3', '#FFE4B5',
        '#FFF0DB', '#FFEBCD', '#FAEBD7', '#FFF8DC', '#FAF0E6',
        '#E6E6FA', '#D8BFD8', '#DDA0DD', '#EE82EE', '#DA70D6',
        '#E0FFFF', '#AFEEEE', '#B0E0E6', '#B0C4DE', '#ADD8E6'
    ];
    return colors[index % colors.length];
}