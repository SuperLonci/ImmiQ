<script lang="ts">
    import "../app.css";

    let menuItems = [
        { name: 'Houses', path: '/houses' },
        { name: 'Units', path: '/units' },
        { name: 'Meters', path: '/meters' },
        { name: 'Fixed Costs', path: '/fixed-costs' },
    ];
</script>

<div class="flex h-screen bg-primary">
    <!-- Sidebar -->
    <aside class="w-64 bg-secondary text-white p-4 shadow-lg rounded-r-2xl">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">ImmiQ</h2>
        <nav>
            {#each menuItems as item}
                <a href={item.path} class="block p-3 rounded-lg text-black hover:bg-gray-200 hover:text-gray-800 transition">
                    {item.name}
                </a>
            {/each}
        </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="bg-secondary p-4 flex justify-between items-center shadow-md rounded-bl-2xl">
            <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
            <button class="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
                User
            </button>
        </header>

        <!-- Dynamic Content -->
        <main class="flex-1 p-6 overflow-y-auto">
            <slot />
        </main>
    </div>
</div>
