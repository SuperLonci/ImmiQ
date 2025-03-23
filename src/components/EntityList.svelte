<script lang="ts">
    import {goto} from '$app/navigation';
    import ListItem from './ListItem.svelte';
    import ListItemDetail from './ListItemDetail.svelte';

    export let title: string;
    export let items: any[] = [];
    export let loading: boolean = false;
    export let basePath: string = '';
    export let displayProperty: string = 'name';
    export let emptyMessage: string = 'No items available';
    export let showAddButton: boolean = true;
    export let addButtonPath: string = `${basePath}/new`;
    export let detailed: boolean = false;

    function viewDetails(id: string) {
        goto(`${basePath}/${id}`);
    }

    function handleAddNew() {
        goto(addButtonPath);
    }
</script>

<div class="entity-list-container">
    <div class="header">
        <h2 class="entity-list-title">{title}</h2>
        <div class="header-actions">
            <label class="toggle-switch">
                <span class="toggle-label">Details</span>
                <input type="checkbox" bind:checked={detailed}>
                <span class="slider"></span>
            </label>

            {#if showAddButton}
                <button on:click={handleAddNew} class="add-button" aria-label="Add new">
                    +
                    <!--                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"-->
                    <!--                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">-->
                    <!--                        <line x1="12" y1="5" x2="12" y2="19"></line>-->
                    <!--                        <line x1="5" y1="12" x2="19" y2="12"></line>-->
                    <!--                    </svg>-->
                </button>
            {/if}
        </div>
    </div>

    {#if loading}
        <div class="loading-container">
            <p>Loading...</p>
        </div>
    {:else if items.length === 0}
        <p class="empty-message">{emptyMessage}</p>
    {:else}
        <ul class="entity-list">
            {#each items as item (item.id)}
                {#if detailed}
                    <ListItemDetail {item} {displayProperty} on:click={() => viewDetails(item.id)}>
                        <slot name="item-content" {item}></slot>
                    </ListItemDetail>
                {:else}
                    <ListItem {item} {displayProperty} on:click={() => viewDetails(item.id)}>
                        <slot name="item-content" {item}></slot>
                    </ListItem>
                {/if}
            {/each}
        </ul>
    {/if}
</div>

<style>
    .entity-list-container {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .entity-list-title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin: 0;
        padding: 0;
        line-height: 1;
    }

    .add-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 30px;
        border-radius: 25%;
        background-color: white;
        border: 1px solid #e0e0e0;
        cursor: pointer;
        color: #333;
        transition: all 0.2s ease;
        padding: 15px;
        font-size: 1.5rem;
    }

    .add-button:hover {
        background-color: rgba(79, 70, 229, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .entity-list {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }

    .loading-container {
        display: flex;
        justify-content: center;
        padding: 2rem 0;
    }

    .empty-message {
        text-align: center;
        padding: 2rem 0;
        color: #666;
    }

    /* Toggle Switch Styles */
    .toggle-switch {
        position: relative;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        background-color: #ccc;
        border-radius: 34px;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        border-radius: 50%;
        transition: .4s;
    }

    input:checked + .slider {
        background-color: #4F46E5;
    }

    input:checked + .slider:before {
        transform: translateX(20px);
    }

    .toggle-label {
        margin-right: 8px;
        font-size: 0.85rem;
        color: #333;
    }
</style>