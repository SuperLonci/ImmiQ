<script lang="ts">
    import { page } from '$app/state';

    export let user: App.PageData['user'];

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST'
            });

            // Refresh the page to clear the user state
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
</script>

<div class="user-session-links">
    <ul class="user-links">
        {#if user}
            <li><a href="/profile" class:active={page.url.pathname === '/profile'}>Profile</a></li>
            <li><a href="#" on:click|preventDefault={handleLogout}>Logout ({user.name})</a></li>
        {:else}
            <li><a href="/login" class:active={page.url.pathname === '/login'}>Login</a></li>
            <li><a href="/register" class:active={page.url.pathname === '/register'}>Register</a></li>
        {/if}
    </ul>
</div>

<style>
    .user-session-links {
        padding: 0.5rem;
    }

    .user-links {
        display: flex;
        flex-direction: row;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .user-links li {
        margin-inline: 0.5rem;
    }

    .user-links a {
        text-decoration: none;
        cursor: pointer;
        padding: 0.4rem 1rem;
        border-radius: 0.75rem;
        transition: box-shadow 0.2s ease, transform 0.2s ease;
        background-color: #f1e1af;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .user-links a:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }

    .user-links a.active {
        color: #bf4a12;
    }

</style>