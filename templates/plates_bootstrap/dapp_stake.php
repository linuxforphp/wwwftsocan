<div class="top">
    <div class="row" style="margin-bottom: 5px;">
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="transfer" type="button" id="Transfer" onclick="getDappPage(4)">
                <a class="wrap-unwrap-text">
                    <span id="Transfer">Transfer</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stake" type="button" id="Stake" onclick="getDappPage(4)">
                <a class="wrap-unwrap-text">
                    <span id="Stake">Stake</span>
                </a>
            </button>
        </div>
        <div class="col-sm-4" style="padding-left: 0; padding-right: 0;">
            <button class="stakeRewards" type="button" id="StakeRewards" onclick="getDappPage(4)">
                <a class="wrap-unwrap-text">
                    <span id="StakeRewards">Rewards</span>
                </a>
            </button>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-sm-12">
        <button id="ConnectPChain" class="connect-wallet" style="float: none; margin-left: auto; margin-right: auto;"><i class="connect-wallet-text" id="ConnectWalletText">Connect to P-Chain</i></button>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <span><strong>WARNING:</strong></span>
        <span> To use the staking functionality of the <strong>FTSOCAN DApp</strong>, You must enable <strong>"eth_sign"</strong> on your Metamask. <br> We <strong>highly</strong> recommend you turn it off IMMEDIATELY after you have finished using the staking features of the FTSOCAN DApp.<br></span>
        <span><strong>CONTINUE AT YOUR OWN RISK!</strong></span>
    </div>
</div>
<div class="row">
    <div class="dummytext">
        <div class="addr-wrap">
            <span><?=$view['dappName'] ?></span>
        </div>
    </div>
</div>

