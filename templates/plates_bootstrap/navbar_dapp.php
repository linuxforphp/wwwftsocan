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
    <div class="container" style="margin-bottom: 0.5em;">
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
                    <a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>')">FTSOCAN</a>
                </span>
            </h1>
            <!-- /logo -->
        </div>

        <!-- main nav -->
        <nav class="collapse navbar-collapse navbar-right" role="navigation">
            <ul id="nav" class="nav navbar-nav">
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>index')">Home</a></li>
                <li id="delegate-dropdown">
                    <a href="#" class="delegate-dropdown">Delegation Tools <i class="fas fa-caret-down"></i></a>
                    <div class="dd-menu">
                        <div class="dropdown-menu-dapp" style="left: 0px;">
                            <ul>
                                <li><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>dapp/index')">DApp<sup><strong> NEW!</strong></sup></a></li>
                                <li><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>delegate/index')">Flare Portal</a></li>
                                <li><a href="#" class="navbar-list-item" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>stake/index')">FlareStake Tool</a></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li><a href="#" onclick="getDocsPageNewTab(1, '<?=$view['urlbaseaddr']?>faq/index')">FAQ</a></li>
                <li><a href="#" onclick="getDocsPageNewTab(2)">About</a></li>
            </ul>
        </nav>
        <!-- /main nav -->
    </div>
    <!-- secondary nav -->
    <nav class="navbar-dapp-actions navbar-expand">
        <div class="container">
            <div class="collapse navbar-collapse static-top navbar-right" role="navigation" style="border: none; box-shadow: none; -webkit-box-shadow: none;">
                <ul class="nav navbar-nav navbar-nav-dapp nav-item">
                    <li><a href="#" class="nav-link" onclick="getDappPage(4)">Select Wallet</a></li>
                    <li><a href="#" class="nav-link" onclick="getDappPage(1)">Wrap</a></li>
                    <li><a href="#" class="nav-link" onclick="getDappPage(2)">Delegate</a></li>
                    <li><a href="#" class="nav-link" onclick="getDappPage(3)">Rewards</a></li>
                    <li><a href="#" class="nav-link" onclick="getDappPage(5)">Stake</a></li>
                </ul>
            </div>
        </div>
    </nav>
    <!-- /secondary nav -->
</header>
<!--
End Fixed Navigation
==================================== -->
