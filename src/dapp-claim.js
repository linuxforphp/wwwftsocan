import { FlareAbis, Provider as provider, FlareLogos, GetContract, round, showAccountAddress, showTokenBalance} from "./flare-utils";
import * as DappCommon from './dapp-common.js';
// dapp_claim.js

function __init__(object) {
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
        DappCommon.ConnectWalletClickClaim(object.rpcUrl, object.flrAddr, DappCommon.DappObject);
    });

    document.getElementById("ClaimButton").addEventListener("click", async () => {
        console.log(DappCommon.DappObject.claimBool);
        if (DappCommon.DappObject.claimBool === true) {
            let web32 = new Web3(object.rpcUrl);
            var checkBox = document.getElementById("RewardsCheck");

            try {
                const accounts = await provider.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                let tokenContract = new web32.eth.Contract(DappCommon.DappObject.ercAbi, wrappedTokenAddr);
                const ftsoRewardAddr = await GetContract("FtsoRewardManager", object.rpcUrl, object.flrAddr);
                let ftsoRewardContract = new web32.eth.Contract(DappCommon.DappObject.ftsoRewardAbiLocal, ftsoRewardAddr);
                const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
                var transactionParameters;

                if (checkBox.checked) {
                    transactionParameters = {
                        from: account,
                        to: ftsoRewardAddr,
                        data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[epochsUnclaimed.length - 1]), true).encodeABI(),
                    };
                } else {
                    transactionParameters = {
                        from: account,
                        to: ftsoRewardAddr,
                        data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[epochsUnclaimed.length - 1]), false).encodeABI(),
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

                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                DappCommon.showClaimRewards(0.0);
                DappCommon.switchClaimButtonColorBack(DappCommon.DappObject.claimBool);
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } catch (error) {
                showFail();
            }
        }
    });

    document.getElementById("ClaimFdButton").addEventListener("click", async () => {
        if (DappCommon.DappObject.fdClaimBool === true) {
            let web32 = new Web3(object.rpcUrl);
            var checkBox = document.getElementById("RewardsCheck");

            try {
                const accounts = await provider.request({method: 'eth_requestAccounts'});
                const account = accounts[0];
                const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                let tokenContract = new web32.eth.Contract(DappCommon.DappObject.ercAbi, wrappedTokenAddr);
                const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", object.rpcUrl, object.flrAddr);
                let DistributionDelegatorsContract = new web32.eth.Contract(DappCommon.DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
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
                        DappCommon.switchClaimFdButtonColorBack(DappCommon.DappObject.fdClaimBool);
                        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                    }
                }
            } catch (error) {
                // console.log(error);
            }
        }
    });
}

window.onload = async (event) => {
    let selectedNetwork = document.getElementById("SelectedNetwork");
    let chainidhex;
    let rpcUrl;
    let networkValue;
    let tokenIdentifier;
    let wrappedTokenIdentifier;
    document.getElementById('layer3').innerHTML = DappCommon.DappObject.flrLogo;

    await DappCommon.createSelectedNetwork(DappCommon.DappObject).then( async () => {
        DappCommon.getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

            DappCommon.showTokenIdentifiers(null, object.wrappedTokenIdentifier);

            __init__(object);

            console.log("token identifier: " + object.wrappedTokenIdentifier);

            document.getElementById("ConnectWallet").click();

            selectedNetwork.onchange = async () => {
                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                // Alert Metamask to switch.
                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{chainId: chainidhex}],
                    });
                    
                    document.getElementById("ConnectWallet").click();
                } catch (error) {
                    // console.log(error);
                }
            };

            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length !== 0) {
                    document.getElementById("ConnectWallet").click();
                } else {
                    document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
                    showBalance(0.0);
                    showTokenBalance(0.0);
                    connectWalletBool = false;
                }
            });

            window.ethereum.on("chainChanged", async (chosenChainId) => {
                for (var i = 0; i < selectedNetwork?.options.length; i++) {
                    if (selectedNetwork?.options[i].getAttribute('data-chainidhex') === String(chosenChainId)) {
                        selectedNetwork.options.selectedIndex = i;
                        selectedNetwork.dispatchEvent(new Event('change'));

                        break;
                    }
                }

                if (DappCommon.DappObject.metamaskInstalled === true) {
                    try {
                        await provider.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{chainId: object.chainIdHex}],
                        })
                    } catch (error) {
                        // console.log(error);
                    }
                }
            });
        });
    });
}