<script lang="ts">
    import {goto} from '$app/navigation';

    export let href: string = ''; // URL to navigate to when item is clicked
    export let clickable: boolean = false; // Whether this item should be clickable

    function handleClick() {
        if (clickable && href) {
            goto(href);
        }
    }
</script>

<button class="detail-item {clickable ? 'clickable' : ''}" on:click={handleClick} disabled={!clickable}>
    <slot></slot>
</button>

<style>
    .detail-item {
        background-color: #fff;
        padding: 10px;
        margin: 5px 0;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border: none;
        text-align: left;
        width: 100%;
    }

    .clickable {
        cursor: pointer;
        transition: background-color 0.2s, transform 0.1s;
    }

    .clickable:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
        color: black;
    }

    .clickable:active {
        transform: translateY(0);
    }
</style>