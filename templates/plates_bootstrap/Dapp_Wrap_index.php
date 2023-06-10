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

    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/dappWrap.css">
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
            <select id="SelectedNetwork" class="SelectedNetwork"> 
                <option value="1">Flare</option> 
                <option value="2" selected="selected">Songbird</option> 
            </select>
            <div class="h">FTSO Can dApp Example</div>

            <div class="Wrap">
                <span>My address is</span>
                <span id="address"></span>
            </div>
            <div class="Wrap">
                <span>My RPC is</span>
                <span id="rpcAddress"></span>
            </div>
            <div class="Wrap">
                <span>My balance is</span>
                <span id="Balance"></span>
            </div>

            <div class="Wrap">
                <span>My token balance is</span>
                <span id="TokenBalance"></span>
            </div>

            <button id="ConnectWallet" class="ConnectWallet">ConnectWallet</button>
        </div>
    </div>
</main>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>
<!-- <script href="../../Dapp/index.js"></script> -->
<script src="https://cdn.ethers.io/scripts/ethers-v4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
<script type="text/javascript" src="<?=$view['urlbaseaddr'] ?>js/human_standard_token_abi.js"></script>
<script type="module" src="<?=$view['urlbaseaddr'] ?>js/dapp_wrap.js"></script>
</body>
</html>