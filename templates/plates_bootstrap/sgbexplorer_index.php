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

<body id="body">
<?=$this->section('navbar', $this->fetch('navbar', ['view' => $view]))?>

<main class="site-content" role="main">

    <!-- Howto section -->
    <section id="howto" class="main-section-padding">
        <div class="container">
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated bounceInLeft">You can delegate to <strong>FTSO Canada</strong>,<br />using the Songbird Explorer!</h2>
                    <h3 class="wow animated bounceInRight">Please follow these steps:</h3>
                    <ul class="text-md delegation">
                        <li class="wow animated bounceInLeft">Using Firefox, go to the Songbird Explorer : <br /><a class="dark-link" href="https://songbird-explorer.flare.network/address/0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED/write-contract" target="_blank">https://songbird-explorer.flare.network/address/0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED/write-contract</a></li>
                        <li class="wow animated bounceInRight">Connect your wallet, and wrap your $SGB by using "<strong>#7 - deposit"</strong><br />(please do not wrap all of your $SGB, because you will need some to pay for fees!)</li>
                        <li class="wow animated bounceInLeft">Copy the <strong>FTSO Canada</strong> Songbird Address :</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <pre><code class="pre-code-custom">0x7C255e428e95bEbc76e944D49D4F460C84b3A3c3</code></pre>
                </div>
                <div class="col-sm-2">
                    <button id="myCopyCommand1Button"><span data-feather="copy" /></button>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated bounceInRight">And, delegate!</h2>
                    <ul class="text-md delegation">
                        <li class="wow animated bounceInLeft">Then, use "<strong>#5 - delegate</strong>", to delegate to our address (copied above),<br />and enter the percentage of the delegation in BIPS (ex. "100%" would become "10000")</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated bounceInRight">Claim your rewards every week!</h2>
                    <ul class="text-md delegation">
                        <li class="wow animated bounceInLeft">Using Firefox, go to the Songbird Explorer : <br /><a class="dark-link" href="https://songbird-explorer.flare.network/address/0xc5738334b972745067fFa666040fdeADc66Cb925/write-contract" target="_blank">https://songbird-explorer.flare.network/address/0xc5738334b972745067fFa666040fdeADc66Cb925/write-contract</a></li>
                        <li class="wow animated bounceInRight">Connect your wallet, and claim your rewards by using "<strong>#3 - claimReward"</strong><br />(please enter your wallet address, and the <a class="dark-link" href="https://flaremetrics.io/" target="_blank">epoch number</a> in the appropriate fields)</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated bounceInLeft">Enjoy your passive income!</h2>
                    <img src="<?=$view['urlbaseaddr'] ?>img/logo-signal.png" style="max-height: 250px;"/>
                </div>
            </div>
        </div>
    </section>
    <!-- end Howto section -->

</main> <!-- /content -->

<div class="container-footer">
    <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>
</div>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<!-- copyclip functions -->
<script src="<?=$view['urlbaseaddr'] ?>js/copyclip-sgb.js"></script>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
