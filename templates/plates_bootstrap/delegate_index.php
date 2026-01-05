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
                    <h2 class="sec-title text-center wow animated fadeInDown"><?=_("delegate_title1")?> <strong>FTSOCAN</strong><?=_("delegate_title2")?></h2>
                    <img src="<?=$view['urlbaseaddr']?>/img/flare-black.svg" style="max-height: 300px;" />
                    <button id="dappButton" style="background-color: rgba(253, 0, 15, 0.9); max-width: none; width:275px; float: none;" onclick="getDocsPageNewTab(3)" class="connect-wallet">
                        <i class="connect-wallet-text" style="font-weight: 500; vertical-align: text-top; padding-left: 5px;"><?=_("delegate_launch")?> 
                        </i>
                        <lord-icon
                                src="<?=$view['urlbaseaddr']?>img/icons/arrow.json"
                                colors="primary:#ffffff"
                                trigger="hover"
                                target="#dappButton"
                                state="hover-slide"
                                style="width:22px;height:22px;top:5px;left:2px;">
                        </lord-icon>
                    </button>
                    <hr />
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated fadeInDown"><?=_("delegate_featurette1_title")?></h2>
                </div>
            </div>
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated fadeInDown"><?=_("delegate_featurette2_title")?></h2>
                    <ul class="text-md delegation">
                        <li class="wow animated fadeInDown"><?=_("delegate_featurette2_body")?></li>
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
                    <div class="text-center"><?=_("delegate_flr_explorer")?></div>
                </div>
                <div class="col-lg-4">
                    <a href="<?=$view['urlbaseaddr']?>sgbexplorer/index">
                        <img src="<?=$view['urlbaseaddr']?>/img/SGB.svg" style="max-height: 100px;" /><br />
                    </a>
                    <div class="text-center"><?=_("delegate_sgb_explorer")?></div>
                </div>
                <div class="col-lg-2">
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="sec-title text-center mt-2">
                    <h2 class="sec-title text-center wow animated fadeInDown"><?=_("delegate_featurette3_title")?></h2>
                    <ul class="text-md delegation">
                        <li class="wow animated fadeInDown"><?=_("delegate_featurette3_body")?></li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-1">
                </div>
                <div class="col-sm-1">
                    <div class="flr-icon">
                        <img src="<?=$view['urlbaseaddr']?>/img/WFLR.svg" style="height: 40px" />
                        <div class="text-lg-center">WFLR</div>
                    </div>
                </div>
                <div class="col-sm-8">
                    <pre><code class="pre-code-custom">0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d</code></pre>
                </div>
                <div class="col-sm-2">
                    <button class="copy-btn" id="myCopyCommandWFLRButton"><span data-feather="copy" /></button>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="col-sm-1">
                </div>
                <div class="col-sm-1">
                    <div class="flr-icon">
                        <img src="<?=$view['urlbaseaddr']?>/img/WSGB.svg" style="max-height: 40px;" />
                        <div class="text-lg-center">WSGB</div>
                    </div>
                </div>
                <div class="col-sm-8">
                    <pre><code class="pre-code-custom">0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED</code></pre>
                </div>
                <div class="col-sm-2">
                    <button class="copy-btn" id="myCopyCommandWSGBButton"><span data-feather="copy" /></button>
                </div>
            </div>
            <hr />
            <div class="row">
                <div class="sec-title text-center">
                    <h2 class="wow animated fadeInDown"><?=_("delegate_outro")?></h2>
                    <img src="<?=$view['urlbaseaddr'] ?>img/Logo-Corporate-Red.svg" style="max-height: 250px;"/>
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
<script src="<?=$view['urlbaseaddr'] ?>js/copyclip-wflr-wsgb.js"></script>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
