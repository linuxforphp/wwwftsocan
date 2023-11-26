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
            <div class="wrap-box-ftso" id="wrapbox-1">
                <div class="wrap-box-content">
                    <img src="<?=$view['urlbaseaddr'] ?>img/FLR.svg" class="delegated-icon" id="delegatedIcon1">
                    <select class="selected-ftso" id="ftso-1" required>
                        <option value="" disabled selected hidden>Select FTSO</option>
                    </select>
                    <input id="Amount1" class="amount"  type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0%">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="wrap-box-ftso" id="wrapbox-2">
                <div class="wrap-box-content">
                    <img src='<?=$view['urlbaseaddr'] ?>img/FLR.svg' class="delegated-icon" id="delegatedIcon2">
                    <select class="selected-ftso" id="ftso-2" required>
                        <option value="" disabled selected hidden data-ftso="0">Select FTSO</option>
                    </select>
                    <input id="Amount2" class="amount" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0%">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="dapp-buttons">
                <div class="col-sm-6">
                    <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText">Connect Wallet</i></button>
                </div>
                <div class="col-sm-6">
                    <button id="ClaimButton" class="claim-button"><i class="claim-button-text" id="ClaimButtonText">Enter Amount</i></button>
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