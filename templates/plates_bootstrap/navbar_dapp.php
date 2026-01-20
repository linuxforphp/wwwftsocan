<!-- preloader -->
<div id="preloader">
    <div class="loader-box">
        <img src="<?=$view['urlbaseaddr']?>img/Logo-Corporate-Red.svg" style="max-height: 37px; position: absolute; top: 22%; left: 28%;">
        <div id="se-pre-con"></div>
    </div>
</div>
<!-- end preloader -->

<!--
Fixed Navigation
==================================== -->
<header id="navigation" class="navbar-inverse navbar-fixed-top animated-header" style="text-align: left;">
    <div class="container" style="margin-bottom: 0.5em;">
        <div class="navbar-header">
            <!-- responsive nav button -->
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only"><?=_("toggle")?></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <!-- /responsive nav button -->

            <button class="connect-wallet select-wallet-nav" onclick="getDappPage('Wallet')"><i class="connect-wallet-text"><?=_("select_wallet")?></i></button>

            <!-- logo -->
            <h1 class="navbar-brand">
                <span>
                    <img src="<?=$view['urlbaseaddr']?>img/logo-dark-2.svg" style="max-height: 50px;"/>
                    <a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>')">FTSOCAN</a>
                </span>
            </h1>
            <!-- /logo -->
        </div>

        <!-- main nav -->
        <nav class="collapse navbar-collapse navbar-right" role="navigation">
            <ul id="nav" class="nav navbar-nav">
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>index')"><?=_("home")?></a></li>
                <li id="delegate-dropdown">
                    <a href="#" class="delegate-dropdown"><?=_("delegation_tools")?> <i class="fas fa-caret-down"></i></a>
                    <div class="dd-menu" style="top: 37px; left: 15px;">
                        <div class="dropdown-menu-dapp" style="left: 0px;">
                            <ul>
                                <li><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>dapp/index')"><?=_("dapp")?><sup><strong> <?=_("new")?></strong></sup></a></li>
                                <li><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>delegate/index')">Flare Portal</a></li>
                                <li><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>stake/index')">FlareStake Tool</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>faq/index')"><?=_("faq")?></a></li>
                <li><a href="#" onclick="getDocsPageNewTab(2)"><?=_("about")?></a></li>
                <li id="language-dropdown">
                    <a href="#" class="delegate-dropdown"><i class="fas fa fa-solid fa-globe"></i> <?= explode('_', $view['language'])[0]?> <i class="fas fa-caret-down"></i></a>
                    <div class="dd-menu" style="top: 37px; left: 10px;">
                        <div class="dropdown-menu-dapp" style="left: 0px;">
                            <ul>
                                <li style="text-align: left; width: 70px !important;"><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>en')">EN <?php if ($view['language'] === "en_US"): ?> <i class="fas fa fa-solid fa-check"></i> <?php endif ?></a></li>
                                <li style="text-align: left; width: 70px !important;"><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>fr')">FR <?php if ($view['language'] === "fr_FR"): ?> <i class="fas fa fa-solid fa-check"></i> <?php endif ?></a></li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
        <!-- /main nav -->
    </div>
    <!-- secondary nav -->
    <nav class="navbar-dapp-actions navbar-expand">
        <div class="container">
            <div class="collapse navbar-collapse static-top navbar-right" role="navigation" style="border: none; box-shadow: none; -webkit-box-shadow: none; margin-top: 0px;">
                <ul class="nav navbar-nav navbar-nav-dapp nav-item">
                    <li><a href="#" class="nav-link nav-link-dapp" onclick="getDappPage('Wallet')"><?=_("select_wallet")?></a></li>
                    <li><a href="#" class="nav-link nav-link-dapp" onclick="getDappPage('Wrap')"><?=_("wrap")?></a></li>
                    <li><a href="#" class="nav-link nav-link-dapp" onclick="getDappPage('Delegate')"><?=_("delegate")?></a></li>
                    <li><a href="#" class="nav-link nav-link-dapp" onclick="getDappPage('Claim')"><?=_("rewards")?></a></li>
                    <li><a href="#" id="navbar-stake-item" class="nav-link nav-link-dapp" onclick="getDappPage('stakeTransfer')"><?=_("stake")?></a></li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- /secondary nav -->
</header>
<!--
End Fixed Navigation
==================================== -->
