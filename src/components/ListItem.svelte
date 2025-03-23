<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    export let item: any;
    export let displayProperty: string = 'name';

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('click');
    }
</script>

<li>
    <button class="list-item-button" on:click={handleClick}>
        <span class="item-name">{item[displayProperty]}</span>
        <slot {item}></slot>
    </button>
</li>

<style>
    li {
        margin-bottom: 0.5rem;
    }

    .list-item-button {
        display: flex;
        align-items: center;
        width: 100%;
        text-align: left;
        padding: 0.75rem 1rem;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .list-item-button:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .list-item-button:active {
        transform: translateY(0);
    }

    .item-name {
        font-weight: 500;
    }
</style>