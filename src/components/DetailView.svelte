<script lang="ts">
    import {goto} from '$app/navigation';

    // Props
    export let title: string;
    export let backUrl: string = '/apartments';
    export let loading: boolean = false;

    function goBack() {
        goto(backUrl);
    }
</script>

<div class="detail-container">
    <div class="header">
        <button on:click={goBack} class="back-button">&#8592;</button>
        {#if title}
            <h2 class="title">{title}</h2>
        {/if}
    </div>

    {#if loading}
        <div class="flex justify-center items-center h-64">
            <p>Loading details...</p>
        </div>
    {:else}
        <div class="detail-content">
            <slot name="graphic"></slot>
            <div class="content-main">
                <slot></slot>
            </div>
        </div>
    {/if}
</div>

<style>
    .detail-container {
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
    }

    .header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;
    }

    .back-button {
        margin-right: 15px;
        font-size: 20px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        display: flex;
        align-items: center;
    }

    .title {
        font-size: 1.5rem;
        font-weight: bold;
        color: #333;
        margin: 0;
        padding: 0;
        line-height: 1;
    }

    .detail-content {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 20px;
    }

    .content-main {
        flex: 1;
        min-width: 0;
        padding: 30px;
    }
</style>