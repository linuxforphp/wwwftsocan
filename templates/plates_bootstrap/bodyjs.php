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
        } else if (option === 6) {
            url = 'https://portal.flare.network/staking';

            window.open(url, '_blank').focus();
        }
    }

    function getDappPage(option, reconnect = true) {
        if (window.dappTranslatedOption && (window.dappTranslatedOption.toLowerCase() == option.toLowerCase())) {
            return;
        }

        let filteredOption = option.toLowerCase();

        if (window.innerWidth <= 480) {
            document.getElementById("dappContainer").style.setProperty('--animate-duration', '0.15s');

            document.getElementById("dappContainer").classList.add("slideOutLeft");

            document.getElementById("dappContainer").addEventListener('animationend', () => {
                openDappPage(option, reconnect);
            }, { once: true });
        } else {
            openDappPage(filteredOption, reconnect);
        }
    }

    function openDappPage(option, reconnect) {
        window.dappTranslatedOption = option;

        if (option === "wallet") {
                $.get( "wallet", function( data ) {
                    $( "#dapp-root" ).html( data );

                    if (reconnect === true) {
                        window.dappInit(4);
                    }
                });
            }
        if (DappObject.isAccountConnected === true) {
            if (option === "wrap") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "wrap", function( data ) {
                        $( "#dapp-root" ).html( data );
                        
                        if (reconnect === true) {
                            window.dappInit(1);
                        }
                    });
                }
            } else if (option === "delegate") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "delegate", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(2);
                        }
                    });
                }
            } else if (option === "claim") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "claim", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(3);
                        }
                    });
                } 
            } else if (option === "staketransfer") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "stakeTransfer", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(4, 1);
                        }
                    });
                }
            } else if (option === "stakestake") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "stakeStake", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(4, 2);
                        }
                    });
                }
            } else if (option === "stakerewards") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "stakeRewards", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(4, 3);
                        }
                    });
                }
            } else if (option === "walletmetamask") {
                $.get( "walletMetamask", function( data ) {
                    $( "#dapp-root" ).html( data );

                    if (reconnect === true) {
                        window.dappInit(4, 4);
                    }
                });
            } else if (option === "walletledger") {
                $.get( "walletLedger", function( data ) {
                    $( "#dapp-root" ).html( data );

                    if (reconnect === true) {
                        window.dappInit(4, 5);
                    }
                });
            } else if (option === "fassetsmint") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "fassetsMint", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(5, 1);
                        }
                    });
                }
            // FASSETS MINT MINT
            } else if (option === "fassetsmintmint") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "fassetsMintMint", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(5, 2);
                        }
                    });
                }
            // FASSETS POOLS HOME
            } else if (option === "fassetspools") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "fassetsPools", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(5, 3);
                        }
                    });
                }
            // FASSETS POOLS LIST
            } else if (option === "fassetspoolslist") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "fassetsPoolsList", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(5, 4);
                        }
                    });
                }
            // FASSETS POOLS DEPOSIT
            } else if (option === "fassetspoolsdeposit") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "fassetsPoolsDeposit", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(5, 5);
                        }
                    });
                }
            // FASSETS REWARDS
            } else if (option === "fassetsrewards") {
                if (DappObject.walletIndex !== -1) {
                    $.get( "fassetsRewards", function( data ) {
                        $( "#dapp-root" ).html( data );

                        if (reconnect === true) {
                            window.dappInit(5, 6);
                        }
                    });
                }
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
<script src="<?=$view['urlbaseaddr'] ?>js/jquery-ui-timepicker-fr.js"></script>

<!-- Custom counter -->
<script src="<?=$view['urlbaseaddr'] ?>js/odometer.min.js"></script>

<!-- Custom alert box -->
<script src="<?=$view['urlbaseaddr'] ?>js/jquery-confirm.min.js"></script>

<!-- Custom select box -->
<script src="<?=$view['urlbaseaddr'] ?>js/selectize.js"></script>
<script src="<?=$view['urlbaseaddr'] ?>js/selectize.min.js"></script>

<!-- Haptics -->
<script src="<?=$view['urlbaseaddr'] ?>js/ios-haptics.js"></script>

<!-- Modernizer Script for old Browsers -->
<script src="<?=$view['urlbaseaddr'] ?>js/modernizr-2.6.2.min.js"></script>
