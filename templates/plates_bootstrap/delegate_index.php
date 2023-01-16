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
                        <li class="wow animated fadeInDown">Instead of using to Flare Portal to delegate your tokens, you might prefer to use the Flare or the Songbird Explorer:</li>
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
<script src="<?=$view['urlbaseaddr'] ?>js/copyclip-wflr-wsgb.js"></script>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
