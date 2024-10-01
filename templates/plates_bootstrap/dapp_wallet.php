<svg xmlns="http://www.w3.org/2000/svg" width="1px" height="1px">
    <filter id="shadow">
        <feDropShadow dx="-0.1" dy="-0.1" stdDeviation="0" flood-color="#adadad"></feDropShadow>
        <feDropShadow dx="0.1" dy="-0.1" stdDeviation="0" flood-color="#adadad"></feDropShadow>
        <feDropShadow dx="0.1" dy="0.1" stdDeviation="0" flood-color="#adadad"></feDropShadow>
        <feDropShadow dx="-0.1" dy="0.1" stdDeviation="0" flood-color="#adadad"></feDropShadow>
    </filter>
</svg>
<div class="top">
    <div class="wrap-box" style="white-space: normal; text-align: center !important; padding: 5% !important;">
        <div class="row">
            <div class="col-md-12">
                <span style="margin: auto; font-weight: bold; color: #383a3b; font-size: 23px;">How would you like to access your Wallet?</span>
            </div>
        </div>
    </div>
</div>
<div class="row" style="padding: 0 20px;">
    <div id="metamaskOption" class="col-sm-6 col-md-4" style="padding: 0 5px !important; margin: auto;">
        <button id="ContinueMetamask" class="continue-wallet" style="float: none; margin-left: auto; margin-right: auto;">
            <div id="injectedProviderIcon" class="wallet-icon">
                <svg width="155" height="118" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 25 25" stroke-width="1.1" stroke="white">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                </svg>
            </div>
            <i id="injectedProviderName" class="connect-wallet-text">Browser Wallet</i>
        </button>
        <input type="text" id="chosenProvider" class="addr-wrap">
    </div>
    <div id="ledgerOption" class="col-md-4" style="padding: 0 5px !important; margin: auto;">
        <button id="ContinueLedger" class="continue-wallet" style="float: none; margin-left: auto; margin-right: auto;">
            <div class="wallet-icon">
                <svg
                width="147"
                height="128"
                viewBox="0 0 204 192"
                style="width: 100%; height: 100%;"
                fill="none"
                version="1.1"
                id="svg1"
                sodipodi:docname="SVG_Ledger_Icon.svg"
                inkscape:version="1.3 (0e150ed, 2023-07-21)"
                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:svg="http://www.w3.org/2000/svg">
                <defs
                    id="defs1" />
                <sodipodi:namedview
                    id="namedview1"
                    pagecolor="#ffffff"
                    bordercolor="#666666"
                    borderopacity="1.0"
                    inkscape:showpageshadow="2"
                    inkscape:pageopacity="0.0"
                    inkscape:pagecheckerboard="0"
                    inkscape:deskcolor="#d1d1d1"
                    inkscape:zoom="1.1352191"
                    inkscape:cx="18.058189"
                    inkscape:cy="139.18019"
                    inkscape:window-width="1366"
                    inkscape:window-height="704"
                    inkscape:window-x="0"
                    inkscape:window-y="0"
                    inkscape:window-maximized="1"
                    inkscape:current-layer="svg1" />
                <path
                    d="M 28.5,123.6548 V 160 h 55.293 v -8.06 H 36.55631 v -28.2852 z m 138.944,0 V 151.94 h -47.237 v 8.058 H 175.5 V 123.6548 Z M 83.8733,68.3452 v 55.3077 h 36.3337 v -7.2687 H 91.9296 V 68.3452 Z M 28.5,32 v 36.3452 h 8.05631 V 40.05844 H 83.793 V 32 Z m 91.707,0 v 8.05844 h 47.237 V 68.3452 H 175.5 V 32 Z"
                    fill="#000000"
                    id="path1"
                    style="fill:#ffffff;fill-opacity:1" />
                </svg>
            </div>
            <i class="connect-wallet-text">Ledger</i>
        </button>
        <input type="text" id="chosenApp" class="addr-wrap" value="0">
    </div>
    <div id="walletConnectOption" class="col-sm-6 col-md-4" style="padding: 0 5px !important; margin: auto;">
        <button id="ContinueWalletConnect" class="continue-wallet" style="float: none; margin-left: auto; margin-right: auto;">
            <div class="wallet-icon">
                <svg
                width="155"
                height="118"
                xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:cc="http://creativecommons.org/ns#"
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
                xmlns:svg="http://www.w3.org/2000/svg"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
                xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
                viewBox="0 0 204 192"
                version="1.1"
                id="svg4"
                style="width: 100%; height: 100%; fill: none;">
                <metadata
                id="metadata10">
                </metadata>
                <defs
                id="defs8" />
                <path
                d="m 55.626723,67.925292 c 25.686212,-25.149002 67.331667,-25.149002 93.018287,0 l 3.0911,3.026628 c 1.28427,1.257607 1.28427,3.296196 0,4.553804 L 141.1613,85.859455 c -0.64234,0.628804 -1.68338,0.628804 -2.32571,0 l -4.25397,-4.164954 c -17.91948,-17.54474 -46.972437,-17.54474 -64.891919,0 l -4.555855,4.460283 c -0.641929,0.628804 -1.682964,0.628804 -2.325303,0 L 52.233724,75.801053 c -1.284679,-1.257609 -1.284679,-3.296197 0,-4.553805 z m 114.888197,21.412889 9.41195,9.21467 c 1.28428,1.257603 1.28428,3.296189 0,4.553789 l -42.43831,41.55153 c -1.28428,1.2572 -3.36675,1.2572 -4.65103,0 L 102.7173,115.16796 c -0.32117,-0.31461 -0.84169,-0.31461 -1.16286,0 l -30.119429,29.49021 c -1.284265,1.2572 -3.366746,1.2572 -4.651016,0 l -42.43943,-41.55193 c -1.28431,-1.25761 -1.28431,-3.296196 0,-4.553801 l 9.411797,-9.215078 c 1.284311,-1.257198 3.366623,-1.257198 4.650935,0 l 30.120778,29.490619 c 0.32076,0.31461 0.841275,0.31461 1.162449,0 L 99.809538,89.337361 c 1.284272,-1.257198 3.366752,-1.257198 4.651012,0 l 30.12066,29.490619 c 0.32117,0.31461 0.84169,0.31461 1.16285,0 L 165.8639,89.338181 c 1.28469,-1.257608 3.36675,-1.257608 4.65102,0 z"
                id="path2"
                inkscape:connector-curvature="0"
                style="fill:#ffffff;fill-opacity:1;stroke-width:1" />
                </svg>
            </div>
            <i class="connect-wallet-text">WalletConnect</i>
        </button>
    </div>
</div>
<div class="row">
    <div class="dummytext">
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>