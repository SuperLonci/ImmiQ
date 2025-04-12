<script lang="ts">
    import { goto } from '$app/navigation';
    import ListItem from './ListItem.svelte';
    import ListItemDetail from './ListItemDetail.svelte';
    import EntityForm from './EntityForm.svelte';

    // Original EntityList props
    export let title: string;
    export let items: any[] = [];
    export let loading: boolean = false;
    export let basePath: string = '';
    export let displayProperty: string = 'name';
    export let emptyMessage: string = 'No items available';
    export let showAddButton: boolean = true;
    export let detailed: boolean = false;
    export let schema: Array<{
        name: string;
        type: 'text' | 'number' | 'select' | 'date' | 'boolean' | 'entity-select';
        label: string;
        required: boolean;
        options?: string[];
        defaultValue?: any;
        entityType?: string;        // Added for entity-select
        displayProperty?: string;   // Added for entity-select
        mutuallyExclusiveWith?: string[]; // Added for mutual exclusion
    }> = []; // Schema provided by the page component

    // Form state
    let showForm = false;
    let isEditing = false;
    let currentItem: any = {};

    // Delete confirmation state
    let showDeleteConfirm = false;
    let itemToDelete: any = null;

    // Get entity type from basePath
    $: entityType = basePath.split('/').filter(p => p).pop() || '';
    $: entityName = entityType.replace(/s$/, ''); // Remove trailing 's' for singular form

    function viewDetails(id: string) {
        goto(`${basePath}/${id}`);
    }

    function handleAddNew() {
        isEditing = false;
        currentItem = {};
        showForm = true;
    }

    function handleEditItem(item: any) {
        isEditing = true;
        currentItem = {
            ...item,
            occurredAt: item.occurredAt ? item.occurredAt.slice(0, 10) : ''
        };
        showForm = true;
    }

    function handleDeleteItem(item: any) {
        itemToDelete = item;
        showDeleteConfirm = true;
    }

    async function confirmDelete() {
        if (!itemToDelete) return;

        try {
            const response = await fetch(`/api${basePath}/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Refresh the data
                await fetchItems();
                // Close confirmation dialog
                showDeleteConfirm = false;
                itemToDelete = null;
            } else {
                // Error handling
                let errorMessage = 'Unknown error occurred';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage;
                }
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('An unexpected error occurred');
        }
    }

    function cancelDelete() {
        showDeleteConfirm = false;
        itemToDelete = null;
    }

    async function handleFormSubmit(event: CustomEvent) {
        const { data, isEditing } = event.detail;

        try {
            const endpoint = `/api${basePath}${isEditing ? `/${data.id}` : ''}`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Refresh the data
                await fetchItems();
                // Close form after successful submission
                showForm = false;
            } else {
                // More robust error handling
                let errorMessage = 'Unknown error occurred';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    // If response isn't valid JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An unexpected error occurred');
        }
    }

    function handleFormError(event: CustomEvent) {
        alert(event.detail.message);
    }

    // Fetch items function for refreshing after form submit
    async function fetchItems() {
        try {
            loading = true;
            const response = await fetch(`/api${basePath}`);
            if (response.ok) {
                items = await response.json();
            } else {
                console.error(`Failed to fetch ${entityType}`);
            }
        } catch (error) {
            console.error(`Error fetching ${entityType}:`, error);
        } finally {
            loading = false;
        }
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
                    <ListItemDetail
                        {item}
                        {displayProperty}
                        on:click={() => viewDetails(item.id)}
                        on:edit={() => handleEditItem(item)}
                        on:delete={() => handleDeleteItem(item)}
                    >
                        <slot name="item-content" {item}></slot>
                    </ListItemDetail>
                {:else}
                    <ListItem
                        {item}
                        {displayProperty}
                        on:click={() => viewDetails(item.id)}
                        on:edit={() => handleEditItem(item)}
                        on:delete={() => handleDeleteItem(item)}
                    >
                        <slot name="item-content" {item}></slot>
                    </ListItem>
                {/if}
            {/each}
        </ul>
    {/if}
</div>

<!-- Popup form component -->
<EntityForm
    entityType={entityName}
    {schema}
    initialData={currentItem}
    isOpen={showForm}
    isEditing={isEditing}
    on:close={() => showForm = false}
    on:submit={handleFormSubmit}
    on:error={handleFormError}
/>

<!-- Delete confirmation modal -->
{#if showDeleteConfirm}
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete {itemToDelete?.[displayProperty]}?</p>
            <p class="warning">This action cannot be undone.</p>
            <div class="modal-actions">
                <button class="cancel-button" on:click={cancelDelete}>Cancel</button>
                <button class="delete-button" on:click={confirmDelete}>Delete</button>
            </div>
        </div>
    </div>
{/if}

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

    /* Modal styles */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background-color: white;
        padding: 24px;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .modal-content h3 {
        margin-top: 0;
        font-size: 1.25rem;
        color: #333;
    }

    .warning {
        color: #E53E3E;
        font-weight: 500;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
    }

    .cancel-button {
        padding: 8px 16px;
        background-color: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }

    .cancel-button:hover {
        background-color: #e5e7eb;
    }

    .delete-button {
        padding: 8px 16px;
        background-color: #E53E3E;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }

    .delete-button:hover {
        background-color: #C53030;
    }
</style>