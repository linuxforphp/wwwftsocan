import { FlareAbis, Provider as provider, FlareLogos, GetContract, round, showAccountAddress, showTokenBalance} from "./flare-utils";
import * as DappCommon from './dapp-common.js';
// dapp_claim.js
var costonLogo = FlareLogos.costonLogo;
var flrLogo = FlareLogos.flrLogo;
var sgbLogo = FlareLogos.sgbLogo;
var ercAbi = FlareAbis.WNat;
var distributionAbiLocal = FlareAbis.DistributionToDelegators;
var voterWhitelisterAbiLocal = FlareAbis.VoterWhitelister;
var ftsoRewardAbiLocal = FlareAbis.FtsoRewardManager;
var claimBool = false;
var fdClaimBool = false;
var metamaskInstalled;

window.onload = async (event) => {
    var selectedNetwork;
    var chainidhex;
    var rpcUrl;
    var networkValue;
    var tokenIdentifier;
    var wrappedTokenIdentifier;
    var delegatedFtsoElement = document.getElementById('after');
    var checkBox = document.getElementById("RewardsCheck");
    document.getElementById('layer3').innerHTML = flrLogo;

    // When the Connect Wallet button is clicked, we connect the wallet, and if it
    // has already been clicked, we copy the public address to the clipboard.
    if (metamaskInstalled === true) {
        document.getElementById("ConnectWallet").addEventListener("click", DappCommon.ConnectWalletClickClaim(claimBool, rpcUrl));
    }

    await DappCommon.createSelectedNetwork(metamaskInstalled).then( DappCommon.getSelectedNetwork(selectedNetwork, rpcUrl, chainidhex, networkValue));

    if (networkValue === '1') {
        document.getElementById('layer3').innerHTML = flrLogo;
    } else if (networkValue === '2') {

        document.getElementById('layer3').innerHTML = sgbLogo;
    } else {
        document.getElementById('layer3').innerHTML = costonLogo;
    }
    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
    tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
    wrappedTokenIdentifier = 'W' + tokenIdentifier;
    DappCommon.showTokenIdentifiers(wrappedTokenIdentifier);

    selectedNetwork.onchange = async () => {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
        networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

        if (networkValue === '1') {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = flrLogo;
            DappCommon.showTokenIdentifiers(wrappedTokenIdentifier);
        } else if (networkValue === '2') {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = sgbLogo;
            DappCommon.showTokenIdentifiers(wrappedTokenIdentifier);
        } else {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = costonLogo;
            DappCommon.showTokenIdentifiers(wrappedTokenIdentifier);
        }
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
                if (await isUnlocked !== false) {
                    document.getElementById("ConnectWallet").click();
                } else {
                    $.alert("You are not connected!");
                }
            } catch (error) {
                // console.log(error);
            }
        }
    }


    if (typeof accounts !== 'undefined' && accounts !== []) {
        window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length !== 0) {
                let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

                try {
                    const wrappedTokenAddr = await GetContract("WNat", rpcUrl);
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
                DappCommon.showClaimRewards(0.0);
                DappCommon.showFdRewards(0.0);
                DappCommon.switchClaimButtonColorBack(claimBool);
                DappCommon.switchClaimFdButtonColorBack(claimBool);
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
                    const wrappedTokenAddr = await GetContract("WNat", rpcUrl);
                    let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                    const ftsoRewardAddr = await GetContract("FtsoRewardManager", rpcUrl);
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
                    DappCommon.showClaimRewards(0.0);
                    DappCommon.switchClaimButtonColorBack(claimBool);
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
                    const wrappedTokenAddr = await GetContract("WNat", rpcUrl);
                    let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                    const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", rpcUrl);
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

                            DappCommon.showFdRewards(0.0);
                            DappCommon.switchClaimFdButtonColorBack();
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
}