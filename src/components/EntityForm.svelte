<script lang="ts">
    import {createEventDispatcher} from 'svelte';

    // Event dispatcher for form actions
    const dispatch = createEventDispatcher();

    // Props for the form
    export let entityType: string; // Name of the entity type (e.g., "Building")
    export let schema: Array<{
        name: string;
        type: 'text' | 'number' | 'select' | 'date' | 'boolean';
        label: string;
        required: boolean;
        options?: string[]; // For select fields
        defaultValue?: any;
    }> = []; // Schema definition passed from parent
    export let initialData: any = {}; // Optional initial data for editing
    export let isOpen: boolean = false; // Control visibility of popup
    export let isEditing: boolean = false; // Whether we're editing or creating
    export let errorMessage: string | null = null; // Error message from form submission

    // Dynamic form data
    let formData: any = {...initialData};
    let validationErrors: { [key: string]: string } = {};

    // Reset form when initialData changes
    $: if (initialData) {
        formData = {...initialData};
    }

    // Close popup and reset data
    function closePopup() {
        formData = {...initialData};
        validationErrors = {};
        dispatch('close');
    }

    // Validate a single field
    function validateField(fieldName: string, field: any): string | null {
        const value = formData[fieldName];

        if (field.required && (value === undefined || value === '' || value === null)) {
            return `${field.label} is required`;
        }

        if (field.type === 'number' && value !== '' && value !== null && isNaN(Number(value))) {
            return `${field.label} must be a number`;
        }

        return null;
    }

    // Validate all fields
    function validateForm(): boolean {
        validationErrors = {};
        let isValid = true;

        schema.forEach(field => {
            const error = validateField(field.name, field);
            if (error) {
                validationErrors[field.name] = error;
                isValid = false;
            }
        });

        return isValid;
    }

    // Handle form submission
    async function handleSubmit() {
        try {
            // Validate form
            if (!validateForm()) {
                return;
            }

            // Dispatch submit event with form data
            dispatch('submit', {data: formData, isEditing});
        } catch (error) {
            console.error(`Error in form submission:`, error);
            dispatch('error', {message: 'An unexpected error occurred'});
        }
    }

    // Modal click outside detection
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === event.currentTarget) {
            closePopup();
        }
    }

    // Initialize empty values for new fields
    $: {
        if (schema) {
            schema.forEach(field => {
                if (formData[field.name] === undefined) {
                    if (field.defaultValue !== undefined) {
                        formData[field.name] = field.defaultValue;
                    } else {
                        formData[field.name] = field.type === 'boolean' ? false : '';
                    }
                }
            });
        }
    }
</script>

{#if isOpen}
    <div class="popup-backdrop" on:click={handleBackdropClick}>
        <div class="popup-container" on:click|stopPropagation>
            <div class="popup-header">
                <h2 class="popup-title">
                    {isEditing ? `Edit ${entityType}` : `New ${entityType}`}
                </h2>
                <button class="close-button" on:click={closePopup}>×</button>
            </div>

            {#if errorMessage}
                <div class="error-message">
                    {errorMessage}
                </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="entity-form">
                {#each schema as field}
                    <div class="form-field">
                        <label for={field.name} class="form-label">
                            {field.label}
                            {#if field.required}
                                <span class="required-asterisk">*</span>
                            {/if}
                        </label>

                        {#if field.type === 'select' && field.options}
                            <select
                                    id={field.name}
                                    bind:value={formData[field.name]}
                                    required={field.required}
                                    class="form-input {validationErrors[field.name] ? 'input-error' : ''}"
                            >
                                <option value="">Select {field.label}</option>
                                {#each field.options as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        {:else if field.type === 'date'}
                            <input
                                    type="date"
                                    id={field.name}
                                    bind:value={formData[field.name]}
                                    required={field.required}
                                    class="form-input {validationErrors[field.name] ? 'input-error' : ''}"
                            />
                        {:else if field.type === 'boolean'}
                            <div class="checkbox-container">
                                <input
                                        type="checkbox"
                                        id={field.name}
                                        bind:checked={formData[field.name]}
                                        class="form-checkbox"
                                />
                            </div>
                        {:else}
                            <input
                                    type={field.type}
                                    id={field.name}
                                    bind:value={formData[field.name]}
                                    required={field.required}
                                    class="form-input {validationErrors[field.name] ? 'input-error' : ''}"
                            />
                        {/if}

                        {#if validationErrors[field.name]}
                            <div class="field-error">{validationErrors[field.name]}</div>
                        {/if}
                    </div>
                {/each}

                <div class="form-actions">
                    <button type="button" class="cancel-button" on:click={closePopup}>
                        Cancel
                    </button>
                    <button type="submit" class="submit-button">
                        {isEditing ? 'Update' : 'Create'} {entityType}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}

<style>
    .popup-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .popup-container {
        background-color: white;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        animation: slide-in 0.3s ease-out;
    }

    .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #f8f8f8;
        border-radius: 8px 8px 0 0;
    }

    .popup-title {
        margin: 0;
        font-size: 1.25rem;
        color: #333;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: color 0.2s;
    }

    .close-button:hover {
        color: #333;
    }

    .entity-form {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .form-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .form-label {
        font-weight: 500;
        color: #333;
        font-size: 0.95rem;
    }

    .required-asterisk {
        color: red;
        margin-left: 4px;
    }

    .form-input {
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 0.95rem;
        background-color: #f9f9f9;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-input:focus {
        border-color: #4F46E5;
        outline: none;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
    }

    .checkbox-container {
        height: 36px;
        display: flex;
        align-items: center;
    }

    .form-checkbox {
        width: 18px;
        height: 18px;
        cursor: pointer;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 10px;
    }

    .cancel-button, .submit-button {
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s ease;
    }

    .cancel-button {
        background-color: #f3f4f6;
        color: #374151;
        border: 1px solid #d1d5db;
    }

    .submit-button {
        background-color: #4F46E5;
        color: white;
        border: none;
    }

    .cancel-button:hover {
        background-color: #e5e7eb;
    }

    .submit-button:hover {
        background-color: #4338ca;
    }

    @keyframes slide-in {
        0% {
            transform: translateY(-20px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>