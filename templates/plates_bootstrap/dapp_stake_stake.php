<div class="top">
    <div class="row" style="margin-bottom: 5px;">
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="transfer" type="button" id="Transfer" onclick="getDappPage(5)">
                <a class="wrap-unwrap-text">
                    <span id="Transfer">Transfer</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stake selected-stake" type="button" id="Stake" onclick="getDappPage(6)">
                <a class="stake-text">
                    <span id="Stake">Stake</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stakeRewards" type="button" id="StakeRewards" onclick="getDappPage(7)">
                <a class="wrap-unwrap-text">
                    <span id="StakeRewards">Rewards</span>
                </a>
            </button>
        </div>
    </div>
</div>
<div class="row">
    <div class="wrap-box" style="overflow: visible;">
        <span class="wrap-box-content">
            <div class="row">
                <img src="<?=$view['urlbaseaddr'] ?>img/FLR.svg" class="provider-icon" id="delegatedIcon1">
                <select id="select-validator" placeholder="Select Validator"></select>
                <div id="stakeAmount" class="stake-amount">
                    <input id="Amount1" class="amount-delegate" type="text" min="50" max="950" step="50" placeholder="50k" readOnly="true">
                </div>
            </div>
        </span>
    </div>
</div>
<div class="row">
    <div class="wrap-box" style="overflow: visible;">
        <span class="wrap-box-content">
            <div class="row">
                <div class="stake-calendar">
                    <input id="calendar" type="text" name="calendar" placeholder="2022/06/24 18:00" class="calendar" readOnly="true">
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

