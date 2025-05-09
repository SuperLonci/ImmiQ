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
        const apartmentsOnFloor = apartments.filter(apartment => apartment.floor === floorNumber);

        if (apartmentsOnFloor.length > 0) {
            const apartmentWidth = floorWidth / apartmentsOnFloor.length;

            // Add apartments
            apartmentsOnFloor.forEach((apartment, index) => {
                const x = index * apartmentWidth;
                // Get color based on overall apartment index, not per floor
                const apartmentIndex = apartments.findIndex(u => u.id === apartment.id);
                const apartmentColor = getUnitColor(apartmentIndex);

                // Create apartment rectangle with thick border
                svgContent += `<g class="apartment-group" data-apartment-id="${apartment.id}">
                        <rect
                            x="${x}"
                            y="${y}"
                            width="${apartmentWidth}"
                            height="${floorHeight}"
                            style="fill:${apartmentColor};stroke:black;stroke-width:${strokeWidth};cursor:pointer" />`;

                // Format apartment name
                let apartmentName = apartment.name || 'Unit';

                // Calculate approximate max characters that can fit
                // Assuming each character takes about 10px width for a 16px font
                const maxCharsPerLine = Math.floor((apartmentWidth - 10) / 10);

                // Only split if name is longer than what can fit on a single line
                if (apartmentName.length > maxCharsPerLine) {
                    // Find a good splitting point - try to split at a space if possible
                    let splitPoint = maxCharsPerLine;

                    // Try to find a space to split at
                    const lastSpaceIndex = apartmentName.substring(0, maxCharsPerLine).lastIndexOf(' ');
                    if (lastSpaceIndex > 0) {
                        splitPoint = lastSpaceIndex;
                    }

                    const firstLine = apartmentName.substring(0, splitPoint);
                    const secondLine = apartmentName.substring(splitPoint).trim();

                    svgContent += `
                            <text
                                x="${x + apartmentWidth / 2}"
                                y="${y + floorHeight / 2 - 10}"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                font-size="16"
                                font-weight="bold"
                                style="pointer-events:none">${firstLine}</text>
                            <text
                                x="${x + apartmentWidth / 2}"
                                y="${y + floorHeight / 2 + 10}"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                font-size="16"
                                font-weight="bold"
                                style="pointer-events:none">${secondLine}</text>`;
                } else {
                    // If name fits on one line, just center it
                    svgContent += `
                            <text
                                x="${x + apartmentWidth / 2}"
                                y="${y + floorHeight / 2}"
                                alignment-baseline="middle"
                                text-anchor="middle"
                                font-size="16"
                                font-weight="bold"
                                style="pointer-events:none">${apartmentName}</text>`;
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