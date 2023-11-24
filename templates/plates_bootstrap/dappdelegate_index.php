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
    <div class="container">
        <div class="dapp-container">
        <div class="Top">
            <div class="delegate"><div class="delegate-text">Delegate</div></div>
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
                <div class="wrap-box-ftso" id="wrapbox-1">
                    <div class="wrap-box-content">
                        <img src="<?=$view['urlbaseaddr'] ?>img/FLR.svg" class="delegated-icon" id="delegatedIcon1">
                        <select class="selected-ftso" id="ftso-1" required>
                            <option value="" disabled selected hidden>Select FTSO</option>
                        </select>
                        <input id="Amount1" class="amount"  type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0%">
                    </div>
                </div>
            <!-- <div class="wrapBox" id='wrapBox'>
                <div class="wrapBoxContent">
                    <svg id="Icon" class="logo" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 383.66 538.51" fill="currentColor">
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
                    <div class="tokenIdentifier">
                        <span id="wrappedTokenIdentifier"></span>
                    </div>
                    <div class="Wrapper">
                            <span id="TokenBalance">0.0</span>
                    </div>
                </div>
            </div> -->
            <div class="wrap-box-ftso" id="wrapbox-2">
                <div class="wrap-box-content">
                    <img src='<?=$view['urlbaseaddr'] ?>img/FLR.svg' class="delegated-icon" id="delegatedIcon2">
                    <select class="selected-ftso" id="ftso-2" required>
                        <option value="" disabled selected hidden data-ftso="0">Select FTSO</option>
                    </select>
                    <input id="Amount2" class="amount" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0%">
                </div>
            </div>

            <div class="dapp-buttons">
            <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText">Connect Wallet</i></button>
                <button id="ClaimButton" class="claim-button"><i class="claim-button-text" id="ClaimButtonText">Enter Amount</i></button>
            </div>

            <div class="dummytext">
                <!-- <div class="AddrWrap">
                    <span>My address is</span>
                    <span id="address"></span>
                </div> -->
                            
                <div class="addr-wrap">
                    <span>FTSOCAN Dapp Version 0.9.0</span>
                </div>
            </div>

        </div>
    </div>
</main>
<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>
<script src="https://cdn.ethers.io/scripts/ethers-v4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ExpandSelect.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/voter_whitelister_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/wnat_flare_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ftso_reward_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/claim_setup_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/flare_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/human_standard_token_abi.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_delegateBundle.js"></script>
</body>
</html>