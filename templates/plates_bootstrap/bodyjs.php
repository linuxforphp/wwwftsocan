<!-- Core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<?php foreach($view['js'] as $key => $value): ?>
    <script src="<?php echo $value ?>"></script>
<?php endforeach; ?>

<!-- Essential jQuery Plugins
        ================================================== -->
<!-- Main jQuery -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery-1.11.1.min.js"></script>

<!-- feather.min.js -->
<script src="<?=$view['urlbaseaddr'] ?>js/feather.min.js"></script>
<!-- Twitter Bootstrap -->
<script src="<?=$view['urlbaseaddr'] ?>js/bootstrap.min.js"></script>
<!-- Single Page Nav -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery.singlePageNav.min.js"></script>
<!-- jquery.fancybox.pack -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery.fancybox.pack.js"></script>
<!-- Owl Carousel -->
<script src="<?=$view['urlbaseaddr'] ?>js/owl.carousel.min.js"></script>
<!-- jquery easing -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery.easing.min.js"></script>
<!-- Fullscreen slider -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery.slitslider.js"></script>
<script src="<?=$view['urlbaseaddr'] ?>js/jquery.ba-cond.min.js"></script>
<!-- onscroll animation -->
<script src="<?=$view['urlbaseaddr'] ?>js/wow.min.js"></script>
<!-- Custom functions -->
<script src="<?=$view['urlbaseaddr'] ?>js/main.js"></script>

<script>
    feather.replace()
</script>

<script>
    $(document).ready(function(){
        $('.owl-carousel').owlCarousel({
            loop:true,
            nav:true,
            autoplay:true,
            autoplayTimeout:4000,
            autoplayHoverPause:true,
            margin:1,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:1
                },
                1000:{
                    items:1
                }
            }
        })
    });
</script>

<script>
    function getDocsPageNewTab(option, delegationurl = null) {
        let url = '';

        if (option === 1) {
            url = delegationurl;

            location.href = url;
        } else if (option === 2) {
            url = 'https://flare.xyz/ftso-a-breakdown/';

            window.open(url, '_blank').focus();
        } else if (option === 3) {
            url = 'https://portal.flare.network/';

            window.open(url, '_blank').focus();
        } else if (option === 4) {
            url = 'https://flare-explorer.flare.network/';

            window.open(url, '_blank').focus();
        } else if (option === 5) {
            url = 'https://metamask.io/download/';

            window.open(url, '_blank').focus();
        }
    }

    function getDappPage(option, reconnect = true) {
        if (DappObject.isAccountConnected === true) {
            if (option === 1) {
                if (DappObject.walletIndex !== -1) {
                    $.get( "wrap", function( data ) {
                        $( "#dapp-root" ).html( data );
                        
                        if (reconnect === true) {
                            window.dappInit(1);
                        }
                    });
                }
            } else if (option === 2) {
                if (DappObject.walletIndex !== -1) {
                    $.get( "delegate", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(2);
                        }
                    });
                }
            } else if (option === 3) {
                if (DappObject.walletIndex !== -1) {
                    $.get( "claim", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(3);
                        }
                    });
                } 
            } else if (option === 4) {
                $.get( "stake", function( data ) {
                    $( "#dapp-root" ).html( data );

                    if (reconnect === true) {
                        window.dappInit(4);
                    }
                });
            } else if (option === 5) {
                if (DappObject.walletIndex !== -1) {
                    $.get( "stakeTransfer", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(4, 1);
                        }
                    });
                }
            } else if (option === 6) {
                if (DappObject.walletIndex !== -1) {
                    $.get( "stakeStake", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(4, 2);
                        }
                    });
                }
            } else if (option === 7) {
                if (DappObject.walletIndex !== -1) {
                    $.get( "stakeRewards", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(4, 3);
                        }
                    });
                }
            } else if (option === 8) {
                $.get( "stakeMetamask", function( data ) {
                    $( "#dapp-root" ).html( data );

                    if (reconnect === true) {
                        window.dappInit(4, 4);
                    }
                });
            } else if (option === 9) {
                $.get( "stakeLedger", function( data ) {
                    $( "#dapp-root" ).html( data );

                    if (reconnect === true) {
                        window.dappInit(4, 5);
                    }
                });
            }
        }
    }
</script>

<?php foreach($view['jsscripts'] as $key => $value): ?>
    <?php echo $value ?>
<?php endforeach; ?>

<script src="<?=$view['urlbaseaddr'] ?>js/jquery-ui.min.js"></script>

<!-- Custom calendar -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery-ui-timepicker-addon.min.js"></script>

<!-- Custom alert box -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery-confirm.min.js"></script>

<!-- Custom select box -->
<script src="<?=$view['urlbaseaddr'] ?>js/selectize.js"></script>
<script src="<?=$view['urlbaseaddr'] ?>js/selectize.min.js"></script>

<!-- Modernizer Script for old Browsers -->
<script src="<?=$view['urlbaseaddr'] ?>js/modernizr-2.6.2.min.js"></script>
