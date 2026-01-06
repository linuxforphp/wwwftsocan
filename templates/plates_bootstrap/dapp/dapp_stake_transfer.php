<div class="top">
    <div class="row" style="margin-bottom: 5px;">
        <button class="transfer selected-stake" type="button" id="Transfer" onclick="getDappPage(5)">
            <a class="stake-text">
                <span id="Transfer"><?=_("dapp_transfer")?></span>
            </a>
        </button>
        <button class="stake" type="button" id="Stake" onclick="getDappPage(6)">
            <a class="wrap-unwrap-text">
                <span id="Stake"><?=_("stake")?></span>
            </a>
        </button>
        <button class="stakeRewards" type="button" id="StakeRewards" onclick="getDappPage(7)">
            <a class="wrap-unwrap-text">
                <span id="StakeRewards"><?=_("dapp_claim")?></span>
            </a>
        </button>
    </div>
</div>
<div class="row">
    <div class="wrap-box">
        <span class="wrap-box-content">
            <div class="row">
                <span id="FromText" class="text-from">C</span>
                <input id="AmountFrom" class="amount" dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="<?=_("dapp_enteramount")?>">
            </div>
            <div class="row">
                <div class="wrapper-wrap">
                    <span><?=_("dapp_balance")?>:</span>
                    <span id="Balance" class="odometer">0</span>
                </div>
            </div>
        </span>
    </div>
</div>
<div class="row">
    <div class="arrow-box" id="TransferIcon">
        <i class="fa fa-solid fa-arrow-down-long" style="font-size: 17px; margin-top: 5px;"></i>
    </div>
</div>
<div class="row">
    <div class="wrap-box">
        <span class="wrap-box-content">
            <div class="row">
                <span id="ToText" class="text-to">P</span>
                <input id="AmountTo" class="amount" dir="rtl" type="text" inputmode="decimal" min="1" minlength="1" max="79" placeholder="0">
            </div>
            <div class="row">
                <div class="wrapper-wrap">
                    <span><?=_("dapp_balance")?>:</span>
                    <span id="TokenBalance" class="odometer">0</span>
                </div>
            </div>
        </span>
    </div>
</div>
<div class="row">
    <div class="col-sm-6">
        <button id="ConnectPChain" class="connect-wallet" style="float: none; margin-left: auto; margin-right: auto;"><i class="connect-wallet-text" id="ConnectWalletText"><?=_("dapp_connectstake")?></i></button>
    </div>
    <div class="col-sm-6">
        <button id="WrapButton" class="connect-wallet wrap-button"><i class="wrap-button-text" id="WrapButtonText"><?=_("dapp_enteramount")?></i></button>
    </div>
</div>
<div class="row">
    <div class="dummytext">
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>

