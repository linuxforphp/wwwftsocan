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
                        <span class="lead">Start building passive income today!</span>
                    </div>
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
                        <h2>About FTSO Canada</h2>
                    </div>
                    <div class="owl-carousel owl-theme wow animated fadeInUp">
                        <div class="item testimonial-item text-center">
                            <img src="<?=$view['urlbaseaddr'] ?>img/Logo-Corporate-Light.svg" alt="About FTSO Canada">
                            <div class="clearfix">
                                <span>Flare Time Series Oracle Canada</span>
                                <p>FTSO Canada is your partner to help you build your passive income on the Flare Network,<br />
                                    by providing the Flare Network with a fast and efficient price provider.
                                </p>
                            </div>
                        </div>
                        <div class="item testimonial-item text-center">
                            <img src="<?=$view['urlbaseaddr'] ?>img/sgb-red.svg" alt="About Flare Networks">
                            <div class="clearfix">
                                <span>Earn SGB and FLR</span>
                                <p>Passive income is at hand!<br />
                                    You can earn $SGB and $FLR, without the risk of losing your tokens.<br />
                                    Make your money work for you, and start claiming your tokens every week!<br /><br />
                                    <a class="light-link" href="<?=$view['urlbaseaddr'] ?>delegate/index" target="_blank">Delegate now</a>!
                                </p>
                            </div>
                        </div>
                        <div class="item testimonial-item text-center">
                            <img src="<?=$view['urlbaseaddr'] ?>img/flare.svg" alt="About XRPL">
                            <div class="clearfix">
                                <span>Flare Networks</span>
                                <p>Unleashing Value.<br />
                                    Around 65% of the value of Blockchain Tokens is inaccessible to decentralised applications.<br />
                                    That changes now.<br /><br />
                                    Please visit the <a class="light-link" href="https://flare.xyz" target="_blank">Flare website</a>.</p>

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
                        <h2>FOLLOW US</h2>
                        <p>Stay up to date with the latest information about FTSO Canada!</p>
                    </div>

                    <ul class="social-button">
                        <li class="wow animated zoomIn"><a href="https://twitter.com/ftsocan" target="_blank"><i class="fa fa-twitter fa-2x"></i></a></li>
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
