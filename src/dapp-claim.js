import { FlareAbis, Provider as provider, FlareLogos, GetContract, downloadMetamask, round, showAccountAddress, showTokenBalance, showRewards } from "./flare-utils";
// dapp_claim.js
selectedNetwork = document.getElementById("SelectedNetwork");
var flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
var chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
var networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
var costonLogo = FlareLogos.costonLogo;
var flrLogo = FlareLogos.flrLogo;
var sgbLogo = FlareLogos.sgbLogo;
var ercAbi = FlareAbis.WNat;
var distributionAbiLocal = FlareAbis.DistributionToDelegators;
var voterWhitelisterAbiLocal = FlareAbis.VoterWhitelister;
var ftsoRewardAbiLocal = FlareAbis.FtsoRewardManager;
var delegatedFtsoElement = document.getElementById('after');
var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
var wrappedTokenIdentifier = "W" + tokenIdentifier;
var checkBox = document.getElementById("RewardsCheck");
var claimBool = false;
var fdClaimBool = false;
document.getElementById('layer3').innerHTML = flrLogo;

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
    if (!provider && downloadMetamaskFlag === false) {
        downloadMetamaskFlag = true;
        downloadMetamask();
    } else {
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
        if (!provider && downloadMetamaskFlag === false) {
            downloadMetamaskFlag = true;
            downloadMetamask();
        } else {
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

// When the Connect Wallet button is clicked, we connect the wallet, and if it
// has already been clicked, we copy the public address to the clipboard.
if (!provider && downloadMetamaskFlag === false) {
    downloadMetamaskFlag = true;
    downloadMetamask();
} else {
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
        let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

        try {
            const wrappedTokenAddr = await GetContract("WNat");
            const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators");
            const ftsoRewardAddr = await GetContract("FtsoRewardManager");
            const voterWhitelistAddr = await GetContract("VoterWhitelister");
            let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);
            let DistributionDelegatorsContract = new web32.eth.Contract(distributionAbiLocal, DistributionDelegatorsAddr);
            let ftsoRewardContract = new web32.eth.Contract(ftsoRewardAbiLocal, ftsoRewardAddr);
            let voterWhitelistContract = new web32.eth.Contract(voterWhitelisterAbiLocal, voterWhitelistAddr);
            const accounts = await provider.request({method: 'eth_requestAccounts'});
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            showFdRewards(0.0);
            showRewards(0.0);

            // Changing the color of Claim button.
            if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
                switchButtonColor();
            } else {
                switchButtonColorBack();
            }

            if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1) {
                switchButtonColor();
            } else {
                switchButtonColorBack();
            }

            remove(".wrapBoxFTSO");

            // Getting which FTSO(s) the user has delegated to, the percentage of wnat he has
            // delegated,and the logo of said FTSO(s).
            const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();
            const ftsoJsonList = JSON.stringify(ftsoList);
            const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();
            const delegatedFtsos = delegatesOfUser[0];
            const BipsJson = delegatesOfUser[1];
            const Bips = BipsJson[0] / 100n;
            let insert = '';

            fetch('https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json')
                .then(res => res.json())
                .then(FtsoInfo => {
                    for (var i = 0; i < delegatedFtsos.length; i++) {

                        let indexNumber;

                        if (ftsoJsonList.includes(delegatedFtsos[i]) || delegatedFtsos.length === 0) {
                            for (var f = 0; f < FtsoInfo.providers.length; f++) {
                                if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                                    indexNumber = f;

                                    insert += `<div class="wrap-box-ftso"><div class="wrap-box-content"><img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegated-icon" id="delegatedIcon"/><div class="ftso-identifier"><span id="delegated-name">${FtsoInfo.providers[indexNumber].name}</span></div><div class="wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
                                    delegatedFtsoElement.innerHTML = insert;
                                }
                            }
                        } else {
                            $.alert('The FTSO you have delegated to is invalid!');
                        }
                    }
                })

            // Getting the unclaimed Rewards and affecting the Claim button.
            const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
            let unclaimedAmount = 0;
            let l;

            for (var k = 0; k < epochsUnclaimed.length; k++) {
                l = await ftsoRewardContract.methods.getStateOfRewards(account, Number(epochsUnclaimed[k])).call();
                unclaimedAmount += Number(l[1]);
            }

            const convertedRewards = web32.utils.fromWei(unclaimedAmount, "ether");
            var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

            //Changing the color of Claim buttons.
            if (Number(round(convertedRewards)) >= 1 && Number(round(convertedRewards)) < bucketTotal) {
                showRewards(round(convertedRewards));
                switchButtonColor();
            } else {
                switchButtonColorBack();
            }

            var unconvertedAmount = 0;
            var claimableAmountFd = 0;

            try {
                const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

                for (const property in claimableMonths) {
                    if (!property.includes("_")) {
                        try {
                            unconvertedAmount = await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, claimableMonths[property]).call();
    
                            if (typeof Number(unconvertedAmount) !== 'undefined' && Number(unconvertedAmount) > 0) {
                                claimableAmountFd += Number(web32.utils.fromWei(unconvertedAmount, "ether"));
                            }
                        } catch (error) {
                            throw(error);
                        }
                    }
                }

                var fdBucketTotal = await web32.eth.getBalance(DistributionDelegatorsAddr);

                if (Number(round(claimableAmountFd)) >= 1 && Number(round(claimableAmountFd)) < fdBucketTotal) {
                    showFdRewards(String(round(claimableAmountFd)));
                    switchFdButtonColor();
                } else {
                    switchFdButtonColorBack();
                }
            } catch (error) {
                throw(error);
            }
        } catch (error) {
            // console.log(error);
        }
    });
}

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

    if (!provider && downloadMetamaskFlag === false) {
        downloadMetamaskFlag = true;
        downloadMetamask();
    } else {
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

if (!provider && downloadMetamaskFlag === false) {
    downloadMetamaskFlag = true;
    downloadMetamask();
} else {
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

if (!provider && downloadMetamaskFlag === false) {
    downloadMetamaskFlag = true;
    downloadMetamask();
} else {
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
