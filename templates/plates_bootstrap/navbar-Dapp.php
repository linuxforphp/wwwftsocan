<!-- preloader -->
<div id="preloader">
    <div class="loader-box">
        <div id="se-pre-con"></div>
    </div>
</div>
<!-- end preloader -->

<!--
Fixed Navigation
==================================== -->
<header id="navigation" class="navbar-inverse navbar-fixed-top animated-header">
    <div class="container">
        <div class="navbar-header">
            <!-- responsive nav button -->
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <!-- /responsive nav button -->

            <!-- logo -->
            <h1 class="navbar-brand">
                <span>
                    <img src="<?=$view['urlbaseaddr']?>img/logo-dark-2.svg" style="max-height: 50px;"/>
                    <a href="https://ftsocan.com">FTSOCAN</a>
                </span>
            </h1>
            <!-- /logo -->
        </div>

        <!-- main nav -->
        <nav class="collapse navbar-collapse navbar-right" role="navigation">
            <ul id="nav" class="nav navbar-nav">
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>Dapp_Wrap/index')">Wrap</a></li>
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>Dapp_Delegate/index')">Delegate</a></li>
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>Dapp_Claim/index')">Rewards</a></li>
            </ul>
        </nav>
        <!-- /main nav -->
    </div>
</header>
<!--
End Fixed Navigation
==================================== -->