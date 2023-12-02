<!DOCTYPE html>
<!--[if lt IE 7]> <html lang="en" class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]> <html lang="en" class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]> <html lang="en" class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" class="no-js"> <!--<![endif]-->

<?php if (isset($view['headjs'])): ?>
    <?=$this->section('headjs', $this->fetch('headjs', ['view' => $view]))?>
<?php endif ?>
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="<?php echo $view['description'] ?>">
    <meta name="author" content="<?php echo $view['author'] ?>">
    <link rel="icon" href="<?php echo $view['favicon'] ?>">

    <link rel="apple-touch-icon" href="<?php echo $view['urlbaseaddr'] ?>apple-touch-icon.png">
    <link rel="shortcut icon" href="<?php echo $view['urlbaseaddr'] ?>apple-touch-icon.png">
    <title><?php echo $view['title'] ?></title>

    <!-- Core CSS -->
    <?php foreach($view['css'] as $key => $value): ?>
        <link href="<?php echo $value ?>" rel="stylesheet">
    <?php endforeach; ?>

    <link rel="stylesheet" href="<?=$view['urlbaseaddr'] ?>css/faq.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="<?php echo $view['urlbaseaddr'] ?>js/html5shiv.min.js"></script>
      <script src="<?php echo $view['urlbaseaddr'] ?>js/respond.min.js"></script>
    <![endif]-->

</head>

<body id="body">
<?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

<main class="site-content" role="main">
    <!-- FAQ Section -->
    <section id="FAQ" class="main-section-padding">
        <div class="container">
            <h2 class="sec-title text-center"><strong>Frequently Asked Questions</strong></h2>

            <div class="faq">
                <button class="faq-accordion">
                    <strong>What is FTSO Canada? </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p><strong>FTSO Canada</strong> is one of the <strong>Flare</strong> Network's many FTSOs (Flare Time Series Oracle). <br> 
                    It provides applications on the <strong>Flare</strong> Network with highly accurate and decentralized data, such as cryptocurrency prices, and transaction validation. To learn more about FTSOs, you can visit 
                    <a class="link" href="#" onclick="getDocsPageNewTab(2)">Flare's official post about FTSOs</a></p>
                </div>
            </div>

            <div class="faq">
                <button class="faq-accordion">
                    <strong>How Do I get "Flare" or "Songbird" installed in my browser? </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p>To be able to interact with Ethereum chains such as <strong>Flare</strong> , <strong>Songbird</strong> , <strong>Coston</strong> or <strong>Coston2</strong> , you must first download Metamask on your respective browser , such as Chrome , Firefox , Edge or Opera.<br></p>
                    <a href="https://metamask.io/download/" class="shinyButton"><i class="shinyButtonText">Download Metamask</i></a><br>
                    <p>Then, once your account has been created, you need to add the <strong>Flare</strong> and <strong>Songbird</strong> ETH chains.<br></p>
                    <div class="row">
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addFlr"><i class="shinyButtonText">Add Flare</i></button>
                        </div>
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addSgb"><i class="shinyButtonText">Add Songbird</i></button>
                        </div>
                    </div>
                    <br />
                    <p>To make sure that you can see your Wrapped tokens, you can also add the "WFLR" and "WSGB" tokens to the <strong>Flare</strong> and <strong>Songbird</strong> networks respectfully.<i class="footnote asterisk">*</i></p>
                    <div class="row">
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addWflr"><i class="shinyButtonText">Add WFLR</i></button>
                        </div>
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addWsgb"><i class="shinyButtonText">Add WSGB</i></button>
                        </div>
                    </div>
                    <br />
                    <p><i class="footnote">*Please note that adding the tokens will only permit you to view them. To actually own WSGB or WFLR, you will need to buy some SGB or FLR from an exchange, and wrap them.</i></p>
                </div>
            </div>

            <div class="faq">
                <button class="faq-accordion">
                    <strong>How can I wrap my Flare or Songbird tokens into WFLR or WSGB? </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p>There are multiple options for wrapping, delegating, or even claiming your <strong>Flare</strong> or <strong>Songbird</strong> tokens. You can use our official <br> 
                    <a class="link" href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>dappwrap/index')">FTSO Canada Dapp</a> , the <a class="link" href="#" onclick="getDocsPageNewTab(3)">
                    Flare Portal</a> , which is Flare Networks's official Dapp, the <a class="link" href="#" onclick="getDocsPageNewTab(4)">Flare Explorer</a> , Flare's official Block Explorer, or any other trusted DApp made by the Flare community.</p>
                </div>
            </div>

            <div class="faq">
                <button class="faq-accordion">
                    <strong>How can I delegate my Flare or Songbird tokens in order to earn rewards? </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p>There are multiple options for wrapping, delegating, or even claiming your <strong>Flare</strong> or <strong>Songbird</strong> tokens. You can use our official <br> 
                    <a class="link" href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>dappwrap/index')">FTSO Canada Dapp</a> , the <a class="link" href="#" onclick="getDocsPageNewTab(3)">
                    Flare Portal</a> , which is Flare Networks's official Dapp, the <a class="link" href="#" onclick="getDocsPageNewTab(4)">Flare Explorer</a> , Flare's official Block Explorer, or any other trusted DApp made by the Flare community.</p>
                </div>
            </div>
        </div>    
    </section>
    <!-- End FAQ Section -->

    <!-- Howto section
    <section id="howto" class="main-section-padding">
        <div class="container">
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="sec-title text-center wow animated fadeInDown">You can delegate to <strong>FTSOCAN</strong>,<br />by using the Flare Portal!</h2>
                    <img src="<?=$view['urlbaseaddr']?>/img/flare-black.svg" style="max-height: 300px;" />
                    <a href="https://portal.flare.network" target="_blank" type="button" class="btn btn-red" >Launch Flare Portal</a>
                    <hr />
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated fadeInDown">Don't forget to claim your rewards every week!</h2>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated fadeInDown">Delegate the classic way with the Explorer!</h2>
                    <ul class="text-md delegation">
                        <li class="wow animated fadeInDown">Instead of using the Flare Portal to delegate your tokens, you might prefer to use the Flare or the Songbird Explorer:</li>
                    </ul>
                </div>
            </div>
            <div class="row align-items-md-center text-center">
                <div class="col-lg-2">
                </div>
                <div class="col-lg-4">
                    <a href="<?=$view['urlbaseaddr']?>flrexplorer/index">
                        <img src="<?=$view['urlbaseaddr']?>/img/FLR.svg" style="max-height: 100px;" /><br />
                    </a>
                    <div class="text-center">Flare Explorer</div>
                </div>
                <div class="col-lg-4">
                    <a href="<?=$view['urlbaseaddr']?>sgbexplorer/index">
                        <img src="<?=$view['urlbaseaddr']?>/img/SGB.svg" style="max-height: 100px;" /><br />
                    </a>
                    <div class="text-center">Songbird Explorer</div>
                </div>
                <div class="col-lg-2">
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="sec-title text-center mt-2">
                    <h2 class="sec-title text-center wow animated fadeInDown">Add the WFLR and WSGB tokens to your wallet!</h2>
                    <ul class="text-md delegation">
                        <li class="wow animated fadeInDown">Import your favorite tokens by pasting these addresses in the "Import tokens" section of your wallet:</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-1">
                </div>
                <div class="col-sm-1">
                    <img src="<?=$view['urlbaseaddr']?>/img/WFLR.svg" style="height: 40px" />
                    <div class="text-lg-center">WFLR</div>
                </div>
                <div class="col-sm-8">
                    <pre><code class="pre-code-custom">0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d</code></pre>
                </div>
                <div class="col-sm-2">
                    <button id="myCopyCommandWFLRButton"><span data-feather="copy" /></button>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="col-sm-1">
                </div>
                <div class="col-sm-1">
                    <img src="<?=$view['urlbaseaddr']?>/img/WSGB.svg" style="max-height: 40px;" />
                    <div class="text-lg-center">WSGB</div>
                </div>
                <div class="col-sm-8">
                    <pre><code class="pre-code-custom">0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED</code></pre>
                </div>
                <div class="col-sm-2">
                    <button id="myCopyCommandWSGBButton"><span data-feather="copy" /></button>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated fadeInDown">Enjoy your passive income!</h2>
                    <img src="<?=$view['urlbaseaddr'] ?>img/logo-signal.png" style="max-height: 250px;"/>
                </div>
            </div>
        </div>
    </section> -->
    <!-- end Howto section -->

</main> <!-- /content -->

<div class="container-footer">
    <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>
</div>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<script src="<?=$view['urlbaseaddr'] ?>js/faq.js"></script>

<!-- copyclip functions -->
<script src="<?=$view['urlbaseaddr'] ?>js/copyclip-wflr-wsgb.js"></script>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
