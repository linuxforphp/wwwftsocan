<!DOCTYPE html>
<!--[if lt IE 7]> <html lang="en" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html lang="en" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html lang="en" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>

    <meta charset="utf-8">
    <!-- Always force latest IE rendering engine or request Chrome Frame -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!-- Mobile Specific Meta -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Meta Description -->
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="<?=$view['description'] ?>">
    <meta name="author" content="<?=$view['author'] ?>">
    <meta name="keywords" content="flare, flare networks, servers, node, unleashing value, linux, docker, asclinux, linux for php, lfphp">
    <link rel="icon" href="<?=$view['favicon'] ?>">

    <link rel="apple-touch-icon" href="<?=$view['urlbaseaddr'] ?>apple-touch-icon.png">

    <title><?=$view['title'] ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet" type='text/css'> 

    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/dappClaim.css">
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/font-awesome.min.css">
    <!-- bootstrap.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/jquery.fancybox.css">
    <!-- bootstrap.min -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/bootstrap.min.css">
    <!-- animate.css -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/animate.css">
    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/main.css">

</head>
<body>
<main class="mx-auto h-full max-w-7xl pt-24 md:pt-12 px-4 md:px-8" role="main">
    <?=$this->section('navbar-Dapp', $this->fetch('navbar-Dapp', ['view' => $view]))?>
    <div class="container">
        <div class="dappContainer">
        <div class="Top">
            <div class="Rewards">Rewards</div>
            <div class="selectContainer">
                <label for="SelectedNetwork" class="networkLabel">Choose Network:</label>
                <select name="SelectedNetwork" id="SelectedNetwork" class="SelectedNetwork"> 
                    <option value="1">Flare</option> 
                    <option value="2" selected="selected">Songbird</option> 
                </select>
            </div>
            <div class="wrapBox">
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

        <div class="Buttons">
                <button id="ConnectWallet" class="ConnectWallet">ConnectWallet</button>
                <button id="ClaimButton" class="ClaimButton">Enter Amount</button>
        </div>

        <div class="dummytext">
                <!-- <div class="AddrWrap">
                    <span>My address is</span>
                    <span id="address"></span>
                </div> -->
                            
                <div class="AddrWrap">
                    <span>My RPC is</span>
                    <span id="rpcAddress"></span>
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
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ftso_registry_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/ftso_reward_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/claim_setup_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/flare_abi.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/human_standard_token_abi.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_claim.js"></script>
</body>
</html>