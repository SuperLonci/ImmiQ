<script lang="ts">
    import { goto } from '$app/navigation';
    import EntityForm from './EntityForm.svelte';

    // Properties
    export let title: string = 'Detail View';
    export let loading: boolean = false;
    export let entityType: string = '';
    export let schema: any[] = [];
    export let entity: any = null;

    let showForm = false;
    let formErrorMessage: string | null = null;

    function onEdit() {
        showForm = true;
    }

    // Refresh the page after successful form submission
    async function handleFormSubmit(event: CustomEvent) {
        const { data } = event.detail;

        try {
            const endpoint = `/api/${entityType}/${data.id}`;
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Refresh the page to show updated data
                window.location.reload();
            } else {
                // Handle error
                let errorMessage = 'Unknown error occurred';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    errorMessage = response.statusText || errorMessage;
                }
                formErrorMessage = errorMessage;
            }
        } catch (error) {
            console.error('Error updating entity:', error);
            formErrorMessage = 'An unexpected error occurred';
        }
    }

    function handleFormError(event: CustomEvent) {
        formErrorMessage = event.detail.message;
    }

    function goBack() {
        goto('/' + entityType);
    }
</script>

<div class="detail-container">
    <div class="header">
        <button on:click={goBack} class="back-button">&#8592;</button>
        <h2 class="title">{title}</h2>
        <button class="edit-button" on:click={onEdit} aria-label="Edit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
        </button>
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

<!-- Entity Form for editing -->
{#if entity}
    <EntityForm
        {entityType}
        {schema}
        initialData={entity}
        isOpen={showForm}
        isEditing={true}
        errorMessage={formErrorMessage}
        on:close={() => {
            showForm = false;
            formErrorMessage = null;
        }}
        on:submit={handleFormSubmit}
        on:error={handleFormError}
    />
{/if}

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

    .edit-button {
        margin-left: auto;
        font-size: 1.2rem;
        background-color: white;
        border: 1px solid #e0e0e0;
        border-radius: 25%;
        cursor: pointer;
        padding: 10px;
        transition: all 0.2s ease;
        margin-right: 30px;
    }

    .edit-button:hover {
        background-color: rgba(79, 70, 229, 0.1);
        transform: translateY(-2px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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