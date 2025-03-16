<script lang="ts">
    let houses = [
        { id: 1, name: 'Sunset Villa' },
        { id: 2, name: 'Modern Loft' },
        { id: 3, name: 'Downtown Apartment' }
    ];

</script>

<h2 class="text-2xl font-bold text-gray-800 mb-4">Houses</h2>
<ul class="space-y-2">
    {#each houses as house}
        <li class="p-4 bg-white shadow rounded-lg cursor-pointer">
            {house.name}
        </li>
    {/each}
</ul>
