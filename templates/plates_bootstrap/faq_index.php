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
            <h2 class="sec-title text-center"><strong><?=_("faq_title")?></strong></h2>

            <div id="FtsoCanada" class="faq-anchor"></div>

            <div class="faq">
                <button class="faq-accordion" id="FtsoCanadaButton">
                    <strong><?=_("faq_accordion1_title")?> </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p><?=_("faq_accordion1_body1")?> <a class="link" href="#" onclick="getDocsPageNewTab(2)"><?=_("faq_accordion1_body2")?></a></p>
                </div>
            </div>

            <div id="AddNetworks" class="faq-anchor"></div>

            <div class="faq">
                <button class="faq-accordion" id="AddNetworksButton">
                    <strong><?=_("faq_accordion2_title")?> </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p><?=_("faq_accordion2_body1")?></p>
                    <a href="#" class="shinyButton" onclick="getDocsPageNewTab(5)"><i class="shinyButtonText"><?=_("faq_metamask")?></i></a><br>
                    <p><?=_("faq_accordion2_body3")?><i class="footnote asterisk">*</i><br></p>
                    <div class="row">
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addFlr"><i class="shinyButtonText"><?=_("faq_accordion2_body4")?></i></button>
                        </div>
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addWflr"><i class="shinyButtonText"><?=_("faq_accordion2_body5")?></i></button>
                        </div>
                    </div>
                    <br />
                    <p><?=_("faq_accordion2_body6")?><i class="footnote asterisk">*</i></p>
                    <div class="row">
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addSgb"><i class="shinyButtonText"><?=_("faq_accordion2_body7")?></i></button>
                        </div>
                        <div class="col-sm-6">
                            <button class="shinyButton" id="addWsgb"><i class="shinyButtonText"><?=_("faq_accordion2_body8")?></i></button>
                        </div>
                    </div>
                    <br />
                    <p><i class="footnote">*<?=_("faq_accordion2_body9")?></i></p>
                </div>
            </div>

            <div id="LedgerConnect" class="faq-anchor"></div>

            <div class="faq">
                <button class="faq-accordion" id="LedgerConnectButton">
                    <strong><?=_("faq_accordion3_title")?> </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p><?=_("faq_accordion3_body1")?></p> 
                    <a href="#" class="shinyButton" onclick="getDocsPageNewTab(5)"><i class="shinyButtonText"><?=_("faq_metamask")?></i></a><br>
                    <p><?=_("faq_accordion3_body2")?></p>
                </div>
            </div>

            <div id="WrapTokens" class="faq-anchor"></div>
            <div id="ManageTokens" class="faq-anchor"></div>

            <div class="faq">
                <button class="faq-accordion" id="WrapTokensButton">
                    <strong><?=_("faq_accordion4_title")?> </strong><i class="fas fa-caret-down"></i>
                </button>
                <div class="faq-panel">
                    <p><?=_("faq_accordion4_body1")?> <a class="link" href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>dapp/index')"><?=_("faq_accordion4_body2")?></a>, <a class="link" href="#" onclick="getDocsPageNewTab(3)"><?=_("faq_accordion4_body3")?></a><?=_("faq_accordion4_body4")?> <a class="link" href="#" onclick="getDocsPageNewTab(4)"><?=_("faq_accordion4_body5")?></a>.</p>
                </div>
            </div>
        </div>    
    </section>
    <!-- End FAQ Section -->
</main> <!-- /content -->

<div class="container-footer">
    <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>
</div>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<script src="<?=$view['urlbaseaddr'] ?>js/faq.js"></script>

<script>
    var dappStrings = <?= $view['jstranslate']; ?>;
</script>

<!-- copyclip functions -->
<script src="<?=$view['urlbaseaddr'] ?>js/copyclip-wflr-wsgb.js"></script>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
