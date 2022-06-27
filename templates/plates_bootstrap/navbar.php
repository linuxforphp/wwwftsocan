<header>
    <nav class="navbar navbar-expand-md navbar-default fixed-top shadow-lg">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="<?=$view['links']['Home'] ?>"><img src="<?=$view['logo'] ?>" alt="Logo" style="max-width: 42px"><b><?=$view['title'] ?></b></a>
        </div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav mr-auto">
                <?php foreach($view['links'] as $key => $value): ?>
                    <li class="nav-item"><?php echo '<a class="nav-link" href="' . $value . '">' . $key . '</a>' ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    </nav>
</header>