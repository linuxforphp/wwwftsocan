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
        <div id="currentWallet" class="current-wallet paused">
            <div id="currentWalletPopup" class="current-wallet-popup">
                <p id="current-wallet-popup-text">This is an example of a CSS bubble dialog box with an arrow pointing to the bottom.</p>
            </div>
            <div id="currentWalletIcon" class="current-wallet-icon">
                <div class="current-wallet-icon-border"></div>
            </div>
            <div id="appLogo">
                <svg class="btn-bell" fill="none" version="1.1" viewBox="0 0 185 185" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(0 26.5)"><g transform="matrix(.93 0 0 .93 6.12 8.72)" fill="#fff" style="mix-blend-mode:normal"><path d="m98.8-11.9s-3.45 6.65-7.58 14.8c-4.13 8.13-7.68 15-7.91 15.3-0.451 0.61-1.04 0.959-1.73 1.12-0.963 0.175-1.82-0.222-2.54-0.6-1.1-0.572-3.01-1.68-6.75-3.83-4.21-2.43-7.67-4.41-7.68-4.39-0.0179 0.0185 2.08 10.9 4.67 24.3 2.23 11.5 3.4 17.6 4 20.9 0.297 1.64 0.449 2.58 0.516 3.15 0.179 1.28-0.51 2.31-1.53 2.9-0.982 0.423-2.09 0.351-2.99-0.172-0.28-0.201-4.75-4.92-9.93-10.5-5.18-5.57-9.53-10.2-9.67-10.4-0.0305-0.0319-0.059-0.0553-0.0907-0.0614-0.0316-0.0061-0.0663 0.0056-0.108 0.0442-0.0841 0.0772-0.198 0.263-0.379 0.632-0.362 0.738-0.993 2.21-2.19 5.02-1.14 2.67-1.78 4.16-2.2 5.03-0.334 0.806-0.813 1.4-1.53 1.78-1.07 0.517-2.26 0.169-3.2-0.0083-1.75-0.331-4.89-0.996-10.8-2.25-6.88-1.47-12.5-2.64-12.6-2.61-0.0307 0.0287 1.86 5.95 4.21 13.2 1.64 5.04 2.7 8.36 3.36 10.5 0.328 1.07 0.554 1.84 0.698 2.38 0.202 0.555 0.221 1.13 0.131 1.66-0.148 0.665-0.517 1.19-1 1.6-0.267 0.199-2.68 1.38-5.35 2.63l-4.87 2.27 16.9 13.7c13.1 10.6 19.6 15.9 22.9 18.6 1.67 1.37 2.54 2.09 3.02 2.51 0.465 0.366 0.828 0.823 1.03 1.31 0.198 1.02-0.039 2.04-0.325 2.94-0.352 1.1-1.02 2.94-2.26 6.35-1.46 4-2.63 7.29-2.6 7.31 0.0281 0.0215 2.8-0.448 6.16-1.04 5.31-0.942 10.1-1.83 14.2-2.63 4.13-0.804 7.66-1.52 10.5-2.13 5.75-1.21 8.91-1.97 9.15-2.04 1.08-0.296 2.33-0.65 3.69-1.03-0.267 0.0511-0.536 0.0933-0.806 0.127-6.73-0.0855-12.2-5.57-12.2-12.1 0.0784-7.9 7.71-13.6 15.1-11.8 0.0336 0.0101 0.0672 0.0204 0.101 0.0308l0.0625-21-16.5 0.0199c-0.464-4.28 0.776-8.53 2.83-12.3 2.85-5.36 8.17-8.32 13.8-9.84l0.0697-23.4-15.5 0.0863c-0.395-3.38 0.337-6.77 1.63-9.93 2.4-6.28 7.68-10.4 14-12.1z"/><path d="m108 15.2c-2.81 0.0422-5.16 0.0931-6.84 0.154-5.82 0.575-11.6 3.81-14.4 8.92-0.36 0.659-0.685 1.35-0.981 2.04-1.35 2.79-1.61 5.46-1.45 8.53l68.8-0.368c5.31-0.324 10.2-3.26 13.5-7.33 2.61-3.51 3.31-7.8 3.67-12.1-20.8 0.0319-40.5-0.158-62.3 0.165z"/><path d="m113 60.5c-4.57 0.0229-8.92 0.0842-12.4 0.207-5.15 0.55-10.5 2.94-13.7 7.04-2.81 3.73-4 7.85-3.74 12.5 13.8-0.0159 27.6-0.0324 41.4-0.0487 4.96-0.312 9.85-2.74 13.1-6.4 3.31-3.57 4.21-8.3 4.62-13.1-10.4-0.142-18.9-0.257-29.3-0.207z"/><path d="m95.4 104c-5.85 0.0737-10.6 4.83-10.6 10.5 0.0819 5.88 4.95 10.5 10.6 10.5 5.8-0.157 10.6-4.77 10.6-10.5-0.0157-5.82-4.92-10.5-10.6-10.5z"/></g></g></svg>
            </div>
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