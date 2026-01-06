        <div class="top">
            <div class="row">
                <div class="col-sm-6">
                    <div class="rewards">
                        <div class="rewards-text">
                            <input type="checkbox" id="RewardsCheck" class="rewards-check" name="RewardsCheck" checked="checked" />
                            <span class="rewards-check-label"><?=_("dapp_claim_autowrap")?></span>
                        </div>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="select-container">
                        <div class="dapp-box">
                            <div class="select-box">
                            <?php if (isset($view['results']['nodata'])): ?>
                                <?=$view['results']['nodata'] ?>
                            <?php else: ?>
                                <select name="SelectedNetwork" id="SelectedNetwork" class="selected-network"></select>
                            <?php endif ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="wrap-box" id='wrapBox'>
                <span class="wrap-box-content">
                    <div class="row">
                        <svg id="Icon" class="logo" xmlns="http://www.w3.org/2000/svg" viewbox="0 0 383.66 538.51" fill="currentColor">
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
                        <div class="wrapper">
                                <span id="TokenBalance" class="token-balance-claim odometer">0.0</span>
                        </div>
                    </div>
                    <div class="row">
                        <div class="wrapper-claim">
                            <span><?=_("dapp_account")?>:</span>
                            <span id="AccountAddress" class="address-claim">0x0</span>
                        </div>
                    </div>
                </span>
            </div>
        </div>
        <div class="row">
            <div id="delegate-wrapbox"></div>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <button id="ConnectWallet" class="connect-wallet connect-wallet-claim"><i class="connect-wallet-text" id="ConnectWalletText"><?=_("dapp_connect")?></i></button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <button id="ClaimButton" class="connect-wallet claim-button" name="ClaimButton"><label for="ClaimButton" style="margin-bottom: 0; font-size: 12px; font-weight: 400;"><?=_("dapp_claim_claimrewards")?></label><br /><i class="claim-button-text" id="ClaimButtonText">0</i></button>
            </div>
            <div class="col-sm-6">
                <button id="ClaimFdButton" class="connect-wallet claim-button" name="ClaimFdButton"><label for="ClaimFdButton" style="margin-bottom: 0; font-size: 12px; font-weight: 400;"><?=_("dapp_claim_claimfd")?></label><br /><i class="claim-button-text" id="ClaimFdButtonText">0</i></button>
            </div>
        </div>
        <div class="row">
            <div class="dummytext">                       
                <div class="addr-wrap">
                    <span><?=$view['dappName'] ?></span>
                </div>
            </div>
        </div>
        
