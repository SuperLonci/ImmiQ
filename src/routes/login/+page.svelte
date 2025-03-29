<script lang="ts">
    import {goto} from '$app/navigation';

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    async function handleSubmit() {
        loading = true;
        errorMessage = '';

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Redirect to dashboard after successful login
                goto('/buildings');
            } else {
                errorMessage = data.message || 'Login failed. Please try again.';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage = 'An unexpected error occurred. Please try again.';
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-container">
    <h1>Login</h1>

    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}

    <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
            <label for="email">Email</label>
            <input
                    type="email"
                    id="email"
                    bind:value={email}
                    required
                    disabled={loading}
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                    disabled={loading}
            />
        </div>

        <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
        </button>
    </form>
</div>

<style>
    .login-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 0.75rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    .error-message {
        color: red;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background-color: #ffebee;
        border-radius: 4px;
    }
</style>