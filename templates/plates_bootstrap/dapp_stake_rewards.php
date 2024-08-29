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
            <button class="stake" type="button" id="Stake" onclick="getDappPage(6)">
                <a class="wrap-unwrap-text">
                    <span id="Stake">Stake</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stakeRewards selected-stake" type="button" id="StakeRewards" onclick="getDappPage(7)">
                <a class="stake-text">
                    <span id="StakeRewards">Claim</span>
                </a>
            </button>
        </div>
    </div>
</div>
<div class="row">
    <div class="wrap-box" id='wrapBox'>
        <span class="wrap-box-content">
            <div class="row">
                <span id="ToText" class="text-to">P</span>
                <div class="wrapper">
                        <span id="TokenBalance" class="token-balance-claim">0.0</span>
                </div>
            </div>
            <div class="row">
                <div class="wrapper-claim">
                    <span>Account:</span>
                    <span id="AccountAddress" class="address-claim">0x0</span>
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
        <button id="ClaimButton" class="claim-button" name="ClaimButton" style="margin: 20px;"><label for="ClaimButton" style="margin-bottom: 0; font-size: 12px; font-weight: 400;">Claim Rewards</label><br /><i class="claim-button-text" id="ClaimButtonText">0</i></button>
    </div>
</div>
<div class="row">
    <div class="dummytext">                       
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>

