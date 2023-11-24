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
            <div class="top">
                <div class="row">
                    <div class="col-sm-6">
                        <button class="wrap-unwrap float-left" type="button" id="wrapUnwrap" value="false">
                            <a class="wrap-unwrap-text">
                                <span id="Wrap" class="wrap">Wrap</span> / <span id="Unwrap" class="unwrap">Unwrap</span>
                            </a>
                        </button>
                    </div>
                    <div class="col-sm-6">
                        <div class="select-container">
                            <div class="dapp-box">
                                <div class="select-box">
                                    <?php if (isset($view['results']['nodata'])): ?>
                                        <?=$view['results']['nodata'] ?>
                                    <?php else: ?>
                                        <select name="SelectedNetwork" id="SelectedNetwork" class="selected-network">
                                            <?php foreach($view['results'] as $key => $networks): ?>
                                                <option value="<?=$networks['id'] ?>" data-chainidhex="<?='0x' . dechex($networks['chainid']) ?>"data-rpcurl="<?=$networks['rpcurl'] ?>" data-registrycontract="<?=$networks['registrycontract'] ?>"><?=$networks['chainidentifier'] ?></option>
                                            <?php endforeach; ?>
                                            <!-- <option value="1">FLR</option>
                                            <option value="2" selected="selected">SGB</option>  -->
                                        </select>
                                    <?php endif ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="wrap-box">
                <span class="wrap-box-content">
                    <svg id="FromIcon" class="logo-from" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 383.66 538.51" fill="currentColor">
                        <g id="layer2">
                            <g id="layer1-2" class="AssetLogo">
                                <polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon>
                                <polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon>
                                <polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon>
                                <polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon>
                                <polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon>
                                <polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon>
                            </g>
                        </g>
                    </svg>
                    <div class="token-identifier">
                        <span id="tokenIdentifier"></span>
                    </div>
                    <input id="AmountFrom" class="amount" dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0.0">
                    <div class="wrapper">
                        <span>Balance:</span>
                        <span id="Balance">0.0</span>
                    </div>
                </div>
                </span>
            </div>
            <div class="row">
                <div class="wrap-box">
                    <span class="wrap-box-content">
                        <svg id="ToIcon" class="logo-to" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 383.66 538.51" fill="currentColor">
                            <g id="layer3">
                                <g id="layer1-3">
                                    <polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon>
                                    <polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon>
                                    <polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon>
                                    <polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon>
                                    <polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon>
                                    <polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon>
                                </g>
                            </g>
                        </svg>
                        <div class="token-identifier">
                                <span id="wrappedTokenIdentifier"></span>
                        </div>
                        <input readonly id="AmountTo" class="amount"  dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0.0">
                        <div class="wrapper">
                            <span>Balance:</span>
                            <span id="TokenBalance">0.0</span>
                        </div>
                    </span>
                </div>
            </div>
            <div class="row">
                    <div class="col-sm-6">
                        <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText">Connect Wallet</i></button>
                    </div>
                    <div class="col-sm-6">
                        <button id="WrapButton" class="wrap-button"><i class="wrap-button-text" id="WrapButtonText">Enter Amount</i></button>
                    </div>
            </div>
            <div class="row">
                <div class="dummytext">
                    <!-- <div class="AddrWrap">
                        <span>My address is</span>
                        <span id="address"></span>
                    </div> -->

                    <div class="addr-wrap">
                        <span>FTSOCAN DApp, version 0.9.0.</span>
                    </div>
                </div>
            </div>
        </div>

</main>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>
<!-- <script href="../../Dapp/index.js"></script> -->
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/wnat_flare_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/flare_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/human_standard_token_abi.js"></script>

<script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_wrapBundle.js"></script>
</body>
</html>