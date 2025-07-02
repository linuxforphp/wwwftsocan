        <div class="top">
            <div class="row">
                <div class="col-sm-6">
                    <div class="delegate"><div class="delegate-text"><?=_("dapp_delegate")?></div></div>
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
                        <select id="select-ftso" placeholder="<?=_("dapp_selectftso")?>"></select>
                        <input id="Amount1" class="amount-delegate"  type="text" inputmode="decimal" min="1" minlength="1" maxlength="4" max="79" placeholder="0%">
                    </div>
                </span>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-6">
                <button id="ConnectWallet" class="connect-wallet"><i class="connect-wallet-text" id="ConnectWalletText"><?=_("dapp_connect")?></i></button>
            </div>
            <div class="col-sm-6">
                <button id="ClaimButton" class="connect-wallet delegate-button"><i class="delegate-button-text" id="ClaimButtonText"><?=_("dapp_enteramount")?></i></button>
            </div>
        </div>
        <div class="row">
            <div class="dummytext">
                <div class="addr-wrap">
                    <span><?=$view['dappName'] ?></span>
                </div>
            </div>
        </div>
        