<script lang="ts">
    import "../app.css";

    let menuItems = [
        {name: 'Buildings', path: '/buildings'},
        {name: 'Apartments', path: '/apartments'},
        {name: 'Meters', path: '/meters'},
        {name: 'Costs', path: '/costs'},
        {name: 'Leases', path: '/leases'},
        {name: 'Tenants', path: '/tenants'},
    ];

    let isSidebarCollapsed = false;

    function toggleSidebar() {
        isSidebarCollapsed = !isSidebarCollapsed;
    }
</script>

<style>
    .sidebar {
        width: 250px;
        transition: width 0.3s;
        background: #e8dac4;
    }

    .sidebar.collapsed {
        width: 50px;
        background: #b5a079;
        transition: 0.3s;
    }

    .sidebar.collapsed .menu-item-text,
    .sidebar.collapsed .header-text {
        display: none;
    }

    .main-content {
        transition: 0.3s;
    }

    .main-content.collapsed {
        margin-left: 50px;
    }
</style>

<div class="flex h-screen bg-primary">
    <!-- Sidebar -->
    <aside class="sidebar w-64 bg-secondary text-white p-4 shadow-lg rounded-r-2xl {isSidebarCollapsed ? 'collapsed' : ''}">
        <h2 class="header-text text-2xl font-bold text-gray-800 mb-6">ImmiQ</h2>
        <nav>
            {#each menuItems as item}
                <a href={item.path}
                   class="block p-3 rounded-lg text-black hover:bg-gray-200 hover:text-gray-800 transition">
                    <span class="menu-item-text">{item.name}</span>
                </a>
            {/each}
        </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
        <!-- Top Bar -->
        <header class="bg-secondary p-4 flex justify-between items-center shadow-md rounded-bl-2xl">
            <button class="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
                    on:click={toggleSidebar}>
                &#9776; <!-- Burger menu icon -->
            </button>
            <h1 class="text-xl font-bold text-gray-800">Dashboard</h1>
            <button class="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
                User
            </button>
        </header>

        <!-- Dynamic Content -->
        <main class="flex-1 p-6 overflow-y-auto main-content">
            <slot/>
        </main>
    </div>
</div>
