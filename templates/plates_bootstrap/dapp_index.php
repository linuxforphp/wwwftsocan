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
<main class="mx-auto h-full max-w-7xl pt-24 md:pt-12 px-4 md:px-8" role="main">
    <?=$this->section('navbar_dapp', $this->fetch('navbar_dapp', ['view' => $view]))?>
        <div class="dapp-container p-2">
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

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/flare_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/human_standard_token_abi.js"></script>

<?php if (isset($view['dappwrap'])): ?>
    <script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_wrapBundle.js"></script>
<?php endif ?>
<?php if (isset($view['dappdelegate'])): ?>
    <script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/claim_setup_abi.js"></script>
    <script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_delegateBundle.js"></script>
<?php endif ?>
<?php if (isset($view['dappclaim'])): ?>
    <script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ftso_reward_abi.js"></script>
    <script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/distribution_abi.js"></script>
    <script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_claimBundle.js"></script>
<?php endif ?>
</body>
</html>