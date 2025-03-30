<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    export let item: any;
    export let displayProperty: string = 'name';

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('click');
    }

    function handleEdit(event: MouseEvent) {
        event.stopPropagation(); // Prevent triggering the row click
        dispatch('edit');
    }

    function handleDelete(event: MouseEvent) {
        event.stopPropagation(); // Prevent triggering the row click
        dispatch('delete');
    }
</script>

<li class="list-item" on:click={handleClick}>
    <div class="item-content">
        <span class="item-name">{item[displayProperty]}</span>
        <slot {item}></slot>
    </div>
    <div class="item-actions">
        <button class="edit-button" on:click={handleEdit} aria-label="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        </button>
        <button class="delete-button" on:click={handleDelete} aria-label="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
        </button>
    </div>
</li>

<style>
    .list-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
        transition: background-color 0.2s;
        margin-bottom: 0.5rem;
    }

    .list-item:last-child {
        border-bottom: none;
    }

    .list-item:hover {
        background-color: rgba(79, 70, 229, 0.05);
    }

    .item-content {
        display: flex;
        align-items: center;
    }

    .item-name {
        font-weight: 500;
        color: #333;
    }

    .item-actions {
        display: flex;
        gap: 8px;
    }

    .edit-button, .delete-button {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        visibility: hidden;
        opacity: 0;
        transition: all 0.2s;
    }

    .list-item:hover .edit-button,
    .list-item:hover .delete-button {
        visibility: visible;
        opacity: 1;
    }

    .edit-button:hover {
        color: #4F46E5;
        background-color: rgba(79, 70, 229, 0.1);
    }

    .delete-button:hover {
        color: #E53E3E;
        background-color: rgba(229, 62, 62, 0.1);
    }
</style>