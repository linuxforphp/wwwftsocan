<div class="top">
    <div class="row" style="margin-bottom: 5px;">
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="transfer selected-stake" type="button" id="Transfer" onclick="getDappPage(5)">
                <a class="stake-text">
                    <span id="Transfer">Transfer</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stake" type="button" id="Stake" onclick="getDappPage(6)">
                <a class="wrap-unwrap-text">
                    <span id="Stake">Stake</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stakeRewards" type="button" id="StakeRewards" onclick="getDappPage(7)">
                <a class="wrap-unwrap-text">
                    <span id="StakeRewards">Claim</span>
                </a>
            </button>
        </div>
    </div>
</div>
<div class="row">
    <div class="wrap-box">
        <span class="wrap-box-content">
            <div class="row">
                <span id="FromText" class="text-from">C</span>
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
                    <span>Balance:</span>
                    <span id="TokenBalance">0</span>
                </div>
            </div>
        </span>
    </div>
</div>
<div class="row">
    <div class="col-sm-6">
        <button id="ConnectPChain" class="connect-wallet" style="float: none; margin-left: auto; margin-right: auto;"><i class="connect-wallet-text" id="ConnectWalletText">Connect to P-Chain</i></button>
    </div>
    <div class="col-sm-6">
        <button id="WrapButton" class="connect-wallet wrap-button"><i class="wrap-button-text" id="WrapButtonText">Enter Amount</i></button>
    </div>
</div>
<div class="row">
    <div class="dummytext">
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>

