<script lang="ts">
    import {onMount} from 'svelte';
    import EntityList from '../../components/EntityList.svelte';
    import type {Tenant} from '$lib/entities';

    let tenants: Tenant[] = [];
    let loading: boolean = true;
    let showDetailed: boolean = false;

    onMount(async () => {
        try {
            const response = await fetch('/api/tenants');
            if (response.ok) {
                tenants = await response.json();
            } else {
                console.error('Failed to fetch tenants');
            }
        } catch (error) {
            console.error('Error fetching tenants:', error);
        } finally {
            loading = false;
        }
    });
</script>

<EntityList
        title="Tenants"
        items={tenants}
        loading={loading}
        basePath="/tenants"
        displayProperty="name"
        emptyMessage="No tenants available"
        bind:detailed={showDetailed}
>
    <svelte:fragment slot="item-content" let:item>
        <span></span>
    </svelte:fragment>
</EntityList>