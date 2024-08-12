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
        <div id="currentWallet" class="current-wallet">
            <div class="current-wallet-icon">
                <div class="current-wallet-icon-border"></div>
            </div>
            <svg
            class="btn-bell"
            viewBox="0 0 1503 1504"
            fill="none"
            version="1.1"
            id="svg1"
            sodipodi:docname="avalanche-avax-logo.svg"
            inkscape:version="1.3 (0e150ed, 2023-07-21)"
            xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
            xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg">
            <defs
                id="defs1" />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M 538.688,1050.86 H 392.94 c -30.626,0 -45.754,0 -54.978,-5.9 -9.963,-6.46 -16.051,-17.16 -16.789,-28.97 -0.554,-10.88 7.011,-24.168 22.139,-50.735 l 359.87,-634.32 c 15.313,-26.936 23.061,-40.404 32.839,-45.385 10.516,-5.35 23.062,-5.35 33.578,0 9.778,4.981 17.527,18.449 32.839,45.385 l 73.982,129.144 0.377,0.659 c 16.539,28.897 24.926,43.551 28.588,58.931 4.058,16.789 4.058,34.5 0,51.289 -3.69,15.497 -11.992,30.257 -28.781,59.591 l -189.031,334.153 -0.489,0.856 c -16.648,29.135 -25.085,43.902 -36.778,55.042 -12.73,12.18 -28.043,21.03 -44.832,26.02 -15.313,4.24 -32.47,4.24 -66.786,4.24 z m 368.062,0 h 208.84 c 30.81,0 46.31,0 55.54,-6.08 9.96,-6.46 16.23,-17.35 16.79,-29.15 0.53,-10.53 -6.87,-23.3 -21.37,-48.323 -0.5,-0.852 -1,-1.719 -1.51,-2.601 l -104.61,-178.956 -1.19,-2.015 c -14.7,-24.858 -22.12,-37.411 -31.65,-42.263 -10.51,-5.351 -22.88,-5.351 -33.391,0 -9.594,4.981 -17.342,18.08 -32.655,44.462 l -104.238,178.957 -0.357,0.616 c -15.259,26.34 -22.885,39.503 -22.335,50.303 0.738,11.81 6.826,22.69 16.788,29.15 9.041,5.9 24.538,5.9 55.348,5.9 z"
                fill="#FFFFFF"
                id="path1"
                sodipodi:nodetypes="ssccccccccsccccsccsssccccccscccsccs" />
            </svg>
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
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/reward-manager-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/distribution-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/claim-setup-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/address-binder-abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/validator-reward-abi.js"></script>

<script>
    var uriPath = <?= json_encode($view['path']); ?>;

    window.onload = () => {
        if ((typeof uriPath[2] === 'undefined') || uriPath[2] === '' || uriPath[2] === 'index' || uriPath[2] === 'stake') {
            $.get("stake", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(4);
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
        } else if (uriPath[2] === 'wrap') {
            $.get("wrap", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(1);
            });
        } else if (uriPath[2] === 'stakeTransfer') {
            $.get("stakeTransfer", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(4, 1);
            });
        } else if (uriPath[2] === 'stakeStake') {
            $.get("stakeStake", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(4, 2);
            });
        } else if (uriPath[2] === 'stakeRewards') {
            $.get("stakeRewards", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(4, 3);
            });
        } else if (uriPath[2] === 'stakeMetamask') {
            $.get("stakeMetamask", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(4, 4);
            });
        } else if (uriPath[2] === 'stakeLedger') {
            $.get("stakeLedger", function(data) {
                $("#dapp-root").html(data);
                window.dappInit(4, 5);
            });
        }
    }
</script>
<script src="<?=$view['urlbaseaddr'] ?>js/buffer.min.js"></script>
<script>
    window.Buffer = buffer.Buffer;
</script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/main.bundle.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/dappcommon.bundle.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/flareutils.bundle.js"></script>

</body>
</html>