<script lang="ts">
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {name: 'About', path: 'https://github.com/SuperLonci/ImmiQ'},
        {name: 'Contact', path: 'https://github.com/SuperLonci/ImmiQ'},
        {name: 'Contribute', path: 'https://github.com/SuperLonci/ImmiQ'},
    ];
</script>

<footer class="bg-secondary py-3 px-5 shadow-inner rounded-t-2xl mt-auto">
    <div class="container mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center">
            <div class="mb-2 md:mb-0">
                <p class="text-gray-800 font-bold text-lg">ImmiQ</p>
                <p class="text-gray-600 text-sm">Property Management Simplified</p>
            </div>

            <nav class="mb-4 md:mb-0">
                <ul class="flex flex-wrap gap-4">
                    {#each footerLinks as link}
                        <li>
                            <a
                                    href={link.path}
                                    class="text-gray-700 hover:text-gray-900 transition"
                            >
                                {link.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            </nav>

            <div class="text-gray-600 text-xs">
                <div class="flex flex-col items-center md:items-end">
                    <p>
                        <a
                                property="dct:title"
                                rel="cc:attributionURL"
                                href="https://github.com/SuperLonci/ImmiQ"
                        >
                            ImmiQ
                        </a>
                        is licensed under
                        <a
                                href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
                                target="_blank"
                                rel="license noopener noreferrer"
                        >
                            CC BY-NC-SA 4.0
                        </a>
                    </p>
                    <div class="flex mt-1">
                        <img
                                class="h-4 mx-0.5"
                                src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                                alt="CC"
                        >
                        <img
                                class="h-4 mx-0.5"
                                src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                                alt="BY"
                        >
                        <img
                                class="h-4 mx-0.5"
                                src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
                                alt="NC"
                        >
                        <img
                                class="h-4 mx-0.5"
                                src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"
                                alt="SA"
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>