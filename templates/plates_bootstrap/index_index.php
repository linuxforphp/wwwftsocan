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

    <!--
    Jumbotron
    ==================================== -->
    <section id="home-jumbotron">
        <div class="jumbotron jumbotron-fluid jumbotron-padding bg-img bg-img-1">
            <div class="container">
                <div class="jumbotron-content float-left">
                    <img src="<?=$view['urlbaseaddr']?>img/logo-dark-2.svg"/>
                    <div class="h1">
                        FTSO Canada<br />
                    </div>
                    <span class="lead"><?=_("index_lead")?></span>
                    <br />
                    <button id="dappButton" style="background-color: rgba(253, 0, 15, 0.9);" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>dapp/index')" class="connect-wallet hero-btn">
                        <i class="connect-wallet-text" style="font-weight: 500; vertical-align: text-top; padding-left: 5px;">Open App 
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
                </div>
            </div>
        </div>
    </section>
    <!--
    End Home Jumbotron
    ==================================== -->

    <!-- About section -->
    <section id="about" class="main-section-padding parallax">
        <div class="overlay">
            <div class="container">
                <div class="row">
                    <div class="sec-title text-center white wow animated fadeInDown">
                        <h2><?=_("index_about")?></h2>
                    </div>
                    <div class="owl-carousel owl-theme wow animated fadeInUp">
                        <div class="item testimonial-item text-center">
                            <img src="<?=$view['urlbaseaddr'] ?>img/Logo-Corporate-Light.svg" alt="About FTSO Canada">
                            <div class="clearfix">
                                <span><?=_("author")?></span>
                                <p>
                                    <?=_("index_slide1_body")?>
                                </p>
                            </div>
                        </div>
                        <div class="item testimonial-item text-center">
                            <img src="<?=$view['urlbaseaddr'] ?>img/sgb-red.svg" alt="About Flare Networks">
                            <div class="clearfix">
                                <span><?=_("index_slide2_title")?></span>
                                <p>
                                    <?=_("index_slide2_body1")?> <a class="light-link" href="<?=$view['urlbaseaddr'] ?>delegate/index" target="_blank"><?=_("index_slide2_body2")?></a>!
                                </p>
                            </div>
                        </div>
                        <div class="item testimonial-item text-center">
                            <img src="<?=$view['urlbaseaddr'] ?>img/flare.svg" alt="About XRPL">
                            <div class="clearfix">
                                <span>Flare Networks</span>
                                <p>
                                    <?=_("index_slide3_body1")?> <a class="light-link" href="https://flare.xyz" target="_blank"><?=_("index_slide3_body2")?></a>.
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- end About section -->

    <!-- Social section -->
    <section id="social" class="main-section-padding parallax">
        <div class="overlay">
            <div class="container">
                <div class="row">

                    <div class="sec-title text-center dark wow animated fadeInDown">
                        <h2><?=_("index_followus")?></h2>
                        <p style="padding: 0 20px;"><?=_("index_invitation")?></p>
                    </div>

                    <ul class="social-button">
                        <li class="wow animated zoomIn"><a href="https://x.com/ftsocan" target="_blank"><i class="fa fa-brands fa-x-twitter fa-2x"></i></a></li>
                    </ul>

                </div>
            </div>
        </div>
    </section>
    <!-- end Social section -->

</main> <!-- /content -->

<div class="container-footer">
    <?=$this->section('footer', $this->fetch('footer', ['view' => $view]))?>
</div>

<?php if ($view['bodyjs'] === 1): ?>
    <?=$this->section('bodyjs', $this->fetch('bodyjs', ['view' => $view]))?>
<?php endif ?>

<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
<script src="<?=$view['urlbaseaddr'] ?>js/ie10-viewport-bug-workaround.js"></script>

</body>
</html>
