<!DOCTYPE html>
<html lang="en">

<?php if (isset($view['headjs'])): ?>
    <?=$this->section('headjs', $this->fetch('headjs', ['view' => $view]))?>
<?php else: ?>
    <?=$this->section('head', $this->fetch('head', ['view' => $view]))?>
<?php endif ?>

<body>
<?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

<div id="pageBodyProducts">

    <!-- hero -->
    <div class="w-full py-24 px-6 bg-grey-lighter relative z-10">

        <div class="container max-w-xl mx-auto text-left flex items-center flex-wrap">

            <div class="w-full md:w-2/3">
                <h1 class="text-2xl md:text-4xl text-grey-darkest mb-3">Oops! This ain't Kansas anymore!</h1>
                <p class="text-md md:text-lg text-grey-dark leading-normal">
                    Let's go back <a href="<?php echo $view['urlbaseaddr'] ?>index">HOME</a>!
                </p>
            </div>
        </div>

    </div>
    <!-- /hero -->
</div> <!-- END pageBody -->

<?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?php echo $view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>