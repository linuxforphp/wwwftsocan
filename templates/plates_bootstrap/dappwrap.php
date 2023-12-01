        <div class="top">
            <div class="row">
                <div class="col-sm-6">
                    <button class="wrap-unwrap float-left" type="button" id="wrapUnwrap" value="false">
                        <a class="wrap-unwrap-text">
                            <span id="Wrap" class="wrap">Wrap</span> / <span id="Unwrap" class="unwrap">Unwrap</span>
                        </a>
                    </button>
                </div>
                <div class="col-sm-6">
                    <div class="select-container">
                        <div class="dapp-box">
                            <div class="select-box">
                                <?php if (isset($view['results']['nodata'])): ?>
                                    <?=$view['results']['nodata'] ?>
                                <?php else: ?>
                                    <select name="SelectedNetwork" id="SelectedNetwork" class="selected-network">
                                        <?php foreach($view['results'] as $key => $networks): ?>
                                            <option value="<?=$networks['id'] ?>" data-chainidhex="<?='0x' . dechex($networks['chainid']) ?>"data-rpcurl="<?=$networks['rpcurl'] ?>" data-registrycontract="<?=$networks['registrycontract'] ?>"><?=$networks['chainidentifier'] ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                <?php endif ?>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="wrap-box">
                <span class="wrap-box-content">
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
                    <input id="AmountFrom" class="amount" dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0.0">
                    <div class="wrapper">
                        <span>Balance:</span>
                        <span id="Balance">0.0</span>
                    </div>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="wrap-box">
                <span class="wrap-box-content">
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
                    <input readonly id="AmountTo" class="amount"  dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0.0">
                    <div class="wrapper">
                        <span>Balance:</span>
                        <span id="TokenBalance">0.0</span>
                    </div>
                </span>
            </div>
        </div>
        <div class="row">
                <div class="col-sm-6">
                    <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText">Connect Wallet</i></button>
                </div>
                <div class="col-sm-6">
                    <button id="WrapButton" class="wrap-button"><i class="wrap-button-text" id="WrapButtonText">Enter Amount</i></button>
                </div>
        </div>
        <div class="row">
            <div class="dummytext">
                <div class="addr-wrap">
                    <span><?=$view['dappName'] ?></span>
                </div>
            </div>
        </div>