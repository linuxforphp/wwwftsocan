<!-- nav -->
<nav class="w-full px-6 bg-blue shadow-lg relative z-20">
    <div class="container mx-auto max-w-xl h-16 flex justify-between text-xs md:text-sm">


        <div class="h-full flex items-center">
            <?php foreach($view['links-left'] as $key => $value): ?>
                <?php echo '<a href="' . $value . '" class="text-white no-underline ml-4">' . $key . '</a>' ?>
            <?php endforeach; ?>
        </div>

        <div class="pt-4">
            <a href="#" class="block w-16 h-16 md:w-24 md:h-24 rounded-full border-2 overflow-hidden">
                <img src="<?php echo $view['lightmvc_logo'] ?>" class="w-full h-full" />
            </a>
        </div>

        <div class="h-full flex items-center">
            <?php foreach($view['links-right'] as $key => $value): ?>
                <?php echo '<a href="' . $value . '" class="text-white no-underline ml-4">' . $key . '</a>' ?>
            <?php endforeach; ?>
        </div>
    </div>
</nav>
<!-- /nav -->