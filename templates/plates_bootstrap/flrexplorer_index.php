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
                    <h2 class="wow animated bounceInLeft">You can delegate to <strong>FTSO Canada</strong>,<br />using the Flare Explorer!</h2>
                    <h3 class="wow animated bounceInRight">Please follow these steps:</h3>
                    <ul class="text-md delegation">
                        <li class="wow animated bounceInLeft">Using Firefox, go to the Flare Explorer : <br /><a class="dark-link" href="https://flare-explorer.flare.network/address/0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d/write-contract" target="_blank">https://flare-explorer.flare.network/address/0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d/write-contract</a></li>
                        <li class="wow animated bounceInRight">Connect your wallet, and wrap your $FLR by using "<strong>#8 - deposit"</strong><br />(please do not wrap all of your $FLR, because you will need some to pay for fees!)</li>
                        <li class="wow animated bounceInLeft">Copy the <strong>FTSO Canada</strong> Flare Address :</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-2"></div>
                <div class="col-sm-8">
                    <pre><code class="pre-code-custom">0x9e55a49D251324B1623dc2A81894D1AfBfB8bbdC</code></pre>
                </div>
                <div class="col-sm-2">
                    <button id="myCopyCommand1Button"><span data-feather="copy" /></button>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated bounceInRight">And, delegate!</h2>
                    <ul class="text-md delegation">
                        <li class="wow animated bounceInLeft">Then, use "<strong>#6 - delegate</strong>", to delegate to our address (copied above),<br />and enter the percentage of the delegation in BIPS (ex. "100%" would become "10000")</li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated bounceInRight">Claim your rewards every week!</h2>
                    <ul class="text-md delegation">
                        <li class="wow animated bounceInLeft">Using Firefox, go to the Flare Explorer : <br /><a class="dark-link" href="https://flare-explorer.flare.network/address/0x85627d71921AE25769f5370E482AdA5E1e418d37/write-contract" target="_blank">https://flare-explorer.flare.network/address/0x85627d71921AE25769f5370E482AdA5E1e418d37/write-contract</a></li>
                        <li class="wow animated bounceInRight">Connect your wallet, and claim your rewards by using "<strong>#7 - claimReward"</strong><br />(please enter your wallet address, and the <a class="dark-link" href="https://flaremetrics.io/" target="_blank">epoch number</a> in the appropriate fields)</li>
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

<script>
    var dappStrings = <?= $view['jstranslate']; ?>;
</script>

<!-- copyclip functions -->
<script src="<?=$view['urlbaseaddr'] ?>js/copyclip-flr.js"></script>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
