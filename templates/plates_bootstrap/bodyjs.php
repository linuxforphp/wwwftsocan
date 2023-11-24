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

<script src="https://cdn.jsdelivr.net/npm/glob@10.3.4/dist/mjs/glob.min.js"></script>
<script src="https://cdn.ethers.io/scripts/ethers-v4.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
<script src="https://c0f4f41c-2f55-4863-921b-sdk-docs.github.io/cdn/metamask-sdk.js"></script>

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
        } else {
            url = 'https://flare-explorer.flare.network/';

            window.open(url, '_blank').focus();
        }
    }
</script>

<?php foreach($view['jsscripts'] as $key => $value): ?>
    <?php echo $value ?>
<?php endforeach; ?>

<!-- Modernizer Script for old Browsers -->
<script src="<?=$view['urlbaseaddr'] ?>js/modernizr-2.6.2.min.js"></script>
