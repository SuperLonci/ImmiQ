<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    export let item: any;
    export let displayProperty: string = 'name';
    export let secondaryProperties: string[] = [];

    // If secondaryProperties aren't provided, try to get some common ones from the item
    $: actualSecondaryProps = secondaryProperties.length > 0
        ? secondaryProperties
        : Object.keys(item).filter(key =>
            key !== 'id' &&
            key !== displayProperty &&
            typeof item[key] !== 'object' &&
            item[key] !== null &&
            key !== 'createdAt' &&
            key !== 'updatedAt');

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('click');
    }

    function formatValue(value: any): string {
        if (value === null || value === undefined) return '';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (value instanceof Date) return value.toLocaleDateString();
        return String(value);
    }
</script>

<li>
    <button class="detailed-item-button" on:click={handleClick}>
        <div class="detailed-item-main">
            <span class="item-name">{item[displayProperty]}</span>
            <slot {item}></slot>
        </div>

        <div class="detailed-item-secondary">
            {#each actualSecondaryProps.slice(0, 3) as prop}
                <div class="property-row">
                    <span class="property-label">{prop}:</span>
                    <span class="property-value">{formatValue(item[prop])}</span>
                </div>
            {/each}
        </div>
    </button>
</li>

<style>
    li {
        margin-bottom: 0.75rem;
    }

    .detailed-item-button {
        display: flex;
        flex-direction: column;
        width: 100%;
        text-align: left;
        padding: 0.75rem 1rem;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .detailed-item-button:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .detailed-item-button:active {
        transform: translateY(0);
    }

    .detailed-item-main {
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .item-name {
        font-weight: 600;
        font-size: 1.1rem;
    }

    .detailed-item-secondary {
        padding-left: 0.5rem;
        border-left: 2px solid #e0e0e0;
        margin-left: 0.25rem;
    }

    .property-row {
        display: flex;
        font-size: 0.9rem;
        margin-bottom: 0.25rem;
    }

    .property-label {
        color: #666;
        margin-right: 0.5rem;
        min-width: 100px;
    }

    .property-value {
        color: #333;
    }
</style>