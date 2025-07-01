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
                    <h2 class="h2 text-blue-darker"><?=_("notallowed")?></h2>
                    <p class="pt-2 font-bold text-blue"><?=_("notallowed_lead1")?></p>
                    <p class="pt-4"><?=_("notallowed_lead2")?></p>
                    <?php foreach($view['vars'] as $key => $value): ?>
                        <div class="row justify-content-center"><?=$value ?></div>
                    <?php endforeach; ?>
                    <p class="pt-5 pb-10 text-lg-center"><?=_("notfound_backlink")?> <a class="dark-link" href="<?=$view['urlbaseaddr'] ?>index"><?=strtoupper(_("home"))?></a>!</p>
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
