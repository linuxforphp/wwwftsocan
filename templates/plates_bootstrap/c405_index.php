<!DOCTYPE html>
<html lang="en">

<?php if (isset($view['headjs'])): ?>
    <?=$this->section('headjs', $this->fetch('headjs', ['view' => $view]))?>
<?php else: ?>
    <?=$this->section('head', $this->fetch('head', ['view' => $view]))?>
<?php endif ?>

<body id="body">
<?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

<main class="site-content" role="main">
    <section class="main-section-padding">
        <div class="container">
            <div class="row">
                <div class="sec-title text-center">
                    <h1 class="h1 xl:text-blue-darker">405</h1>
                    <h2 class="h2 text-blue-darker">Method Not Allowed</h2>
                    <p class="pt-2 font-bold text-blue">Sorry, but this method is not allowed on this page!</p>
                    <p class="pt-4">Allowed method(s):</p>
                    <?php foreach($view['vars'] as $key => $value): ?>
                        <div class="row justify-content-center"><?=$value ?></div>
                    <?php endforeach; ?>
                    <p class="pt-5 pb-10 text-lg-center">Let's go back <a href="<?=$view['urlbaseaddr'] ?>index">HOME</a>!</p>
                </div>
            </div>
        </div>
    </section>
</main> <!-- /content --><body>
<?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

<div class="container-footer">
    <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>
</div>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
