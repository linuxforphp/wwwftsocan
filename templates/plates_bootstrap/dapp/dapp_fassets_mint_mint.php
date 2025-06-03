<div class="top">
    <div class="row" style="margin-bottom: 5px;">
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="transfer selected-stake" type="button" onclick="getDappPage(10)">
                <a class="stake-text" style="font-size: 18px;">
                    <span>Mint</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stake" type="button" onclick="getDappPage(12)">
                <a class="fasset-text">
                    <span>Asset Pools</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stakeRewards" type="button" onclick="getDappPage(15)">
                <a class="fasset-text">
                    <span>Rewards</span>
                </a>
            </button>
        </div>
    </div>
</div>
<div style="padding: 5px 5px;">
    <div class="row" style="margin-bottom: 5px">
        <div class="col-sm-12">
            <button class="wrap-unwrap" type="button" id="wrapUnwrap" value="true" style="width: 100%;">
                <a class="fasset-text">
                    <span id="Wrap" class="wrap">Wrap</span> / <span id="Unwrap" class="unwrap">Unwrap</span>
                </a>
            </button>
        </div>
    </div>
    <div class="row">
        <div class="wrap-box">
            <span class="wrap-box-content">
                <div class="row">
                    <svg id="FromIcon" class="logo-from" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 383.66 538.51" fill="currentColor">
                        <g id="layer2">
                            <g id="layer1-2" class="AssetLogo">
                                <polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon>
                                <polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon>
                                <polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon>
                                <polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon>
                                <polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon>
                                <polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon>
                            </g>
                        </g>
                    </svg>
                    <div class="token-identifier">
                        <span id="tokenIdentifier"></span>
                    </div>
                    <input id="AmountFrom" class="amount" dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0">
                </div>
                <div class="row">
                    <div class="wrapper-wrap">
                        <span>Balance:</span>
                        <span id="Balance">0</span>
                    </div>
                </div>
            </span>
        </div>
    </div>
    <div class="row">
        <div class="arrow-box">
            <i class="fa fa-solid fa-arrow-down-long" style="font-size: 17px; margin-top: 5px;"></i>
        </div>
    </div>
    <div class="row">
        <div class="wrap-box">
            <span class="wrap-box-content">
                <div class="row">
                    <svg id="ToIcon" class="logo-to" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 383.66 538.51" fill="currentColor">
                        <g id="layer3">
                            <g id="layer1-3">
                                <polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon>
                                <polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon>
                                <polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon>
                                <polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon>
                                <polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon>
                                <polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon>
                            </g>
                        </g>
                    </svg>
                    <div class="token-identifier">
                            <span id="wrappedTokenIdentifier"></span>
                    </div>
                    <input readonly id="AmountTo" class="amount"  dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0">
                </div>
                <div class="row">
                    <div class="wrapper-wrap">
                        <span>Balance:</span>
                        <span id="TokenBalance">0</span>
                    </div>
                </div>
            </span>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText">Connect Wallet</i></button>
        </div>
        <div class="col-sm-6">
            <button id="WrapButton" class="connect-wallet wrap-button"><i class="wrap-button-text" id="WrapButtonText">Enter Amount</i></button>
        </div>
    </div>
</div>
<div class="row">
    <div class="dummytext">
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>

