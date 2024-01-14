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
    <main id="MainSection" class="mx-auto h-full max-w-7xl pt-24 md:pt-12 px-4 md:px-8" role="main" data-urlbaseaddr="<?=$view['urlbaseaddr'] ?>">
        <?=$this->section('navbar_dapp', $this->fetch('navbar_dapp', ['view' => $view]))?>
        <div id="Accounts" data-address=""></div>
        <div class="dapp-container" id="dapp-root"></div>
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

<script>
    var dappNetworks = <?= json_encode($view['results']); ?>;
</script>

<script>
    var dappUrlBaseAddr = <?= json_encode($view['urlbaseaddr']); ?>;
</script>

<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/flare-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/wnat-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/voter-whitelister-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ftso-reward-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/distribution-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/claim-setup-abi.js"></script>

<script>
    var uriPath = <?= json_encode($view['path']); ?>;

    window.onload = () => {
        if ((typeof uriPath[2] === 'undefined') || uriPath[2] === '' || uriPath[2] === 'index' || uriPath[2] === 'wrap') {
            $.get("wrap", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(1);
            });
        } else if (uriPath[2] === 'delegate') {
            $.get("delegate", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(2);
            });
        } else if (uriPath[2] === 'claim') {
            $.get("claim", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(3);
            });
        }
    }
</script>

<script type="module" src="<?=$view['urlbaseaddr'] ?>js/dappcommon.bundle.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/flareutils.bundle.js"></script>
</body>
</html>