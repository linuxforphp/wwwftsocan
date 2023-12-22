import { FlareAbis, Provider as provider, FlareLogos, GetContract, round, showAccountAddress, showTokenBalance, showRewards } from "./flare-utils";
import * as DappCommon from './dapp-common.js';
// dapp_claim.js
selectedNetwork;
var chainidhex;
var rpcUrl;
var networkValue;
var tokenIdentifier;
var wrappedTokenIdentifier;
var costonLogo = FlareLogos.costonLogo;
var flrLogo = FlareLogos.flrLogo;
var sgbLogo = FlareLogos.sgbLogo;
var ercAbi = FlareAbis.WNat;
var distributionAbiLocal = FlareAbis.DistributionToDelegators;
var voterWhitelisterAbiLocal = FlareAbis.VoterWhitelister;
var ftsoRewardAbiLocal = FlareAbis.FtsoRewardManager;
var delegatedFtsoElement = document.getElementById('after');
var checkBox = document.getElementById("RewardsCheck");
var claimBool = false;
var fdClaimBool = false;
document.getElementById('layer3').innerHTML = flrLogo;

window.onload = (event) => {
    // When the Connect Wallet button is clicked, we connect the wallet, and if it
    // has already been clicked, we copy the public address to the clipboard.
    if (metamaskInstalled === true) {
        document.getElementById("ConnectWallet").addEventListener("click", DappCommon.ConnectWalletClickClaim);
    }
}

// Show the current token identifiers.
function showTokenIdentifiers(wrappedToken) {
    document.getElementById('wrappedTokenIdentifier').innerText = wrappedToken;
}

// Function to remove by id or class name.
const remove = (sel) => document.querySelectorAll(sel).forEach(el => el.remove());

// Switch claim button to claimable.
function switchButtonColor() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    claimBool = true;
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

function switchButtonColorBack() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    claimBool = false;
    document.getElementById('ClaimButton').style.cursor = "auto";
}

function switchFdButtonColor() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    fdClaimBool = true;
    document.getElementById('ClaimFdButton').style.cursor = "pointer";
}

function switchFdButtonColorBack() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    fdClaimBool = false;
    document.getElementById('ClaimFdButton').style.cursor = "auto";
}

// Show current rewards.
function showFdRewards(Rewards) {
    document.getElementById('ClaimFdButtonText').innerText = Rewards;
}

// If network value is 1 or 4, FLR or C2FLR, else SGB or CFLR.
function isNetworkValue(networkValue) {
    if (networkValue === '1') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = 'W' + tokenIdentifier;
        document.getElementById('layer3').innerHTML = flrLogo;
        showTokenIdentifiers(wrappedTokenIdentifier);
    } else if (networkValue === '2') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = 'W' + tokenIdentifier;
        document.getElementById('layer3').innerHTML = sgbLogo;
        showTokenIdentifiers(wrappedTokenIdentifier);
    } else {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = 'W' + tokenIdentifier;
        document.getElementById('layer3').innerHTML = costonLogo;
        showTokenIdentifiers(wrappedTokenIdentifier);
    }
}

isNetworkValue(networkValue);
showTokenIdentifiers(wrappedTokenIdentifier);

selectedNetwork.onchange = async () => {
    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
    chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
    networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

    if (networkValue === '1') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = 'W' + tokenIdentifier;
        document.getElementById('layer3').innerHTML = flrLogo;
        showTokenIdentifiers(wrappedTokenIdentifier);
    } else if (networkValue === '2') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = 'W' + tokenIdentifier;
        document.getElementById('layer3').innerHTML = sgbLogo;
        showTokenIdentifiers(wrappedTokenIdentifier);
    } else {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = 'W' + tokenIdentifier;
        document.getElementById('layer3').innerHTML = costonLogo;
        showTokenIdentifiers(wrappedTokenIdentifier);
    }

    // Alert Metamask to switch.
    if (metamaskInstalled === true) {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: chainidhex}],
            })
        } catch (error) {
            // console.log(error);
        }
    }

    // If we have already logged in the account, show new results, else do nothing.
    if (connectWalletBool === false) {
        if (metamaskInstalled === true) {
            let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

            try {
                const isUnlocked = isConnected();
                if (await isUnlocked !== "false") {
                    document.getElementById("ConnectWallet").click();
                } else {
                    $.alert("You are not connected!");
                }
            } catch (error) {
                // console.log(error);
            }
        }
    }
};

if (typeof accounts !== 'undefined' && accounts !== []) {
    window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length !== 0) {
            let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

            try {
                const wrappedTokenAddr = await GetContract("WNat");
                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                const account = accounts[0];
                showAccountAddress(account);
                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } catch (error) {
                // console.log(error);
            }
        } else {
            document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
            showTokenBalance(0.0);
            showRewards(0.0);
            showFdRewards(0.0);
            switchButtonColorBack();
            switchFdButtonColorBack();
            connectWalletBool = false;
        }
    });
}

window.ethereum.on("chainChanged", async (chosenChainId) => {
    for (var i = 0; i < selectedNetwork?.options.length; i++) {
        if (selectedNetwork?.options[i].getAttribute('data-chainidhex') === String(chosenChainId)) {
            selectedNetwork.options.selectedIndex = i;
            selectedNetwork.dispatchEvent(new Event('change'));

            break;
        }
    }

    if (metamaskInstalled === true) {
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: chainidhex}],
            })
        } catch (error) {
            // console.log(error);
        }
    }
});

if (metamaskInstalled === true) {
    document.getElementById("ClaimButton").addEventListener("click", async () => {
        if (claimBool === true) {
            let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

            try {
                const accounts = await provider.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                const wrappedTokenAddr = await GetContract("WNat");
                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                const ftsoRewardAddr = await GetContract("FtsoRewardManager");
                let ftsoRewardContract = new web32.eth.Contract(ftsoRewardAbiLocal, ftsoRewardAddr);
                const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
                var transactionParameters;

                for (var p = 0; p < epochsUnclaimed.length; p++) {
                    if (checkBox.checked) {
                        transactionParameters = {
                            from: account,
                            to: ftsoRewardAddr,
                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[p]), true).encodeABI(),
                        };
                    } else {
                        transactionParameters = {
                            from: account,
                            to: ftsoRewardAddr,
                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[p]), false).encodeABI(),
                        };
                    }

                    showSpinner(async () => {
                        await provider.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters],
                        })
                            .then((txHash) => showConfirm(txHash))
                            .catch((error) => showFail());
                    });
                }

                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                showRewards(0.0);
                switchButtonColorBack();
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } catch (error) {
                showFail();
            }
        }
    })
}

if (metamaskInstalled === true) {
    document.getElementById("ClaimFdButton").addEventListener("click", async () => {
        if (fdClaimBool === true) {
            let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

            try {
                const accounts = await provider.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                const wrappedTokenAddr = await GetContract("WNat");
                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators");
                let DistributionDelegatorsContract = new web32.eth.Contract(distributionAbiLocal, DistributionDelegatorsAddr);
                const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

                var transactionParameters;

                for (const property in claimableMonths) {
                    if (!property.includes("_")) {
                        if (checkBox.checked) {
                            transactionParameters = {
                                from: account,
                                to: DistributionDelegatorsAddr,
                                data: DistributionDelegatorsContract.methods.claim(account, account, claimableMonths[property], true).encodeABI(),
                            };
                        } else {
                            transactionParameters = {
                                from: account,
                                to: DistributionDelegatorsAddr,
                                data: DistributionDelegatorsContract.methods.claim(account, account, claimableMonths[property], false).encodeABI(),
                            };
                        }
    
                        showSpinner(async () => {
                            await provider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                                .then((txHash) => showConfirm(txHash))
                                .catch((error) => showFail());
                        });
     
                        showFdRewards(0.0);
                        switchFdButtonColorBack();
                        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                    }
                }
            } catch (error) {
                // console.log(error);
            }
        }
    })
}
