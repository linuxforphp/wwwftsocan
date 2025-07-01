<div id="ledgerContent">
    <div class="top">
        <div class="wrap-box" style="white-space: normal; height: auto !important; text-align: center !important; padding: 20px !important;">
            <div class="row">
                <div class="col-md-12">
                    <span style="color: #383a3b; font-size: 25px; font-weight: bold;"><span class="fa fa-warning"></span>
                        <?=_("dapp_wallet_warning")?>
                    </span>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <span style="font-size: 12px;"><?=_("dapp_ledger_title1")?> <i style="font-style: italic;">FTSOCAN DApp</i> <?=_("dapp_ledger_title2")?> </br> <i id="appName" style="font-style: italic;">Flare Network App</i> <?=_("dapp_ledger_title3")?></span>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-6">
            <button id="GoBack" class="connect-wallet" style="float: none; margin-left: auto; margin-right: auto;"><i class="connect-wallet-text"><?=_("dapp_wallet_back")?></i></button>
        </div>
        <div class="col-sm-6">
            <button id="ContinueAnyway" class="connect-wallet claim-button" style="float: none; margin-left: auto; margin-right: auto; padding: 20px;"><i class="connect-wallet-text"><?=_("dapp_wallet_continue")?></i></button>
        </div>
    </div>
</div>
<div class="row">
    <div class="dummytext" style="margin-top: 20px">
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>