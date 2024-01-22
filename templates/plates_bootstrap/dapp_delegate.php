        <div class="top">
            <div class="row">
                <div class="col-sm-6">
                    <div class="delegate"><div class="delegate-text">Delegate</div></div>
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
        <div class="row" id="delegate-wrapbox">
            <div class="wrap-box" id="wrapbox-1">
                <span class="wrap-box-content">
                    <div class="row">
                        <img src="<?=$view['urlbaseaddr'] ?>img/FLR.svg" class="provider-icon" id="delegatedIcon1">
                        <select class="selected-ftso" id="ftso-1" required>
                            <option value="" data-ftso="0" disabled selected hidden>Select FTSO</option>
                        </select>
                        <input id="Amount1" class="amount-delegate"  type="text" inputmode="decimal" min="1" minlength="1" maxlength="4" max="79" placeholder="0%">
                    </div>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText">Connect Wallet</i></button>
            </div>
            <div class="col-sm-6">
                <button id="ClaimButton" class="delegate-button"><i class="delegate-button-text" id="ClaimButtonText">Enter Amount</i></button>
            </div>
        </div>
        <div class="row">
            <div class="dummytext">
                <div class="addr-wrap">
                    <span><?=$view['dappName'] ?></span>
                </div>
            </div>
        </div>
        