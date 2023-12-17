<!DOCTYPE html>
<!--[if lt IE 7]> <html lang="en" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html lang="en" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html lang="en" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" class="no-js"> <!--<![endif]-->

<?php if (isset($view['headjs'])): ?>
    <?=$this->section('headjs', $this->fetch('headjs', ['view' => $view]))?>
<?php else: ?>
    <?=$this->section('head', $this->fetch('head', ['view' => $view]))?>
<?php endif ?>

<body>

<?php if ($view['dappActive'] === true): ?>
    <main class="mx-auto h-full max-w-7xl pt-24 md:pt-12 px-4 md:px-8" role="main">
        <?=$this->section('navbar_dapp', $this->fetch('navbar_dapp', ['view' => $view]))?>
            <div class="dapp-container">
                <?php if (isset($view['dappwrap'])): ?>
                    <?=$this->section('dappwrap', $this->fetch('dappwrap', ['view' => $view]))?>
                <?php endif ?>
                <?php if (isset($view['dappdelegate'])): ?>
                    <?=$this->section('dappdelegate', $this->fetch('dappdelegate', ['view' => $view]))?>
                <?php endif ?>
                <?php if (isset($view['dappclaim'])): ?>
                    <?=$this->section('dappclaim', $this->fetch('dappclaim', ['view' => $view]))?>
                <?php endif ?>
            </div>
    </main>
<?php else: ?>
    <?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

    <main class="site-content" role="main">
        <section class="main-section-padding">
            <div class="dapp-container whoops">
                <div class="row">
                    <div class="sec-title text-center">
                        <h1 class="h1 xl:text-blue-darker">404</h1>
                        <h2 class="h2 text-blue-darker">DApp Currently Inactive</h2>
                        <p class="pt-2 font-bold text-blue">Sorry, but the FTSO Can DApp is currently offline!</p>
                        <p class="pt-2 pb-10 text-lg-center">Let's go back <a class="dark-link" href="<?=$view['urlbaseaddr'] ?>index">HOME</a>!</p>
                    </div>
                </div>
            </div>
        </section>
    </main> <!-- /content -->

    <div class="container-footer">
        <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>
    </div>
<?php endif ?>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/flare-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/wnat-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/voter-whitelister-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ftso-reward-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/distribution-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/claim-setup-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/dapp.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/flareutils.bundle.js"></script>

<?php if (isset($view['dappwrap'])): ?>
    <script type="module" src="<?=$view['urlbaseaddr'] ?>js/dappwrap.bundle.js"></script>
<?php endif ?>
<?php if (isset($view['dappdelegate'])): ?>
    <script type="module" src="<?=$view['urlbaseaddr'] ?>js/dappdelegate.bundle.js"></script>
<?php endif ?>
<?php if (isset($view['dappclaim'])): ?>
    <script type="module" src="<?=$view['urlbaseaddr'] ?>js/dappclaim.bundle.js"></script>
<?php endif ?>
</body>
</html>