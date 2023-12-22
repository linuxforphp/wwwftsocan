// ALL MODULES.

export function getSelectedNetwork(selectedNetwork, rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier) {
    if (typeof tokenIdentifier === 'undefined' || typeof wrappedTokenIdentifier === 'undefined') {
        selectedNetwork = document.getElementById("SelectedNetwork");
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
        networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
    } else {
        selectedNetwork = document.getElementById("SelectedNetwork");
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
        networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
    }
}


export async function isWalletConnected(ProviderObject) {
    if (ProviderObject instanceof MetaMaskSDK) {
        const accounts = await ProviderObject.request({method: 'eth_accounts'});

        if (accounts.length) {
            // console.log(`You're connected to: ${accounts[0]}`);
            return true;
        } else {
            // console.log("Metamask is not connected");
            return false;
        }
    }
}

// Show the current token identifiers.
export function showTokenIdentifiers(token, wrappedToken) {
    if (typeof token !== 'undefined') {
        document.getElementById("tokenIdentifier").innerText = token;
    }

    document.getElementById("wrappedTokenIdentifier").innerText = wrappedToken;
}

// If network value is 1 or 4, FLR or C2FLR, else SGB or CFLR.
export function updateNetworkValue(networkValue, tokenIdentifier, wrappedTokenIdentifier) {

}

// WRAP MODULE

export async function ConnectWalletClickWrap() {
    var selectedNetwork = document.getElementById("SelectedNetwork");
    let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

    try {
        var contractName = "WNat"
        const wrappedTokenAddr = await GetContract(contractName);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
        showAccountAddress(account);
        const balance = await web32.eth.getBalance(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();

        if (wrapBool) {
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
        } else {
            showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
        }
    } catch (error) {
        // console.log(error);
    }
}

export async function toggleWrapButton(currentValue) {
    // Switching wrap/unwrap.
    if (currentValue === "false") {
        wrapBool = false;
        document.getElementById("wrapUnwrap").value = "true";
        fromIcon.style.color = "#000";
        toIcon.style.color = "#fd000f";
        document.getElementById("Wrap").style.color = "#383a3b";
        document.getElementById("Unwrap").style.color = "#fd000f";
        showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
        isInput();
    } else {
        wrapBool = true;
        document.getElementById("wrapUnwrap").value = "false";
        fromIcon.style.color = "#fd000f";
        toIcon.style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        isInput();
    }

    if (connectWalletBool === true) {
        if (!provider && downloadMetamaskFlag === false) {
            downloadMetamaskFlag = true;
            downloadMetamask();
        } else {
            var selectedNetwork = document.getElementById("SelectedNetwork");
            let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));
            let flareContract = new web32.eth.Contract(flrAbi, flrAddr);

            try {
                const isUnlocked = isWalletUnlocked();

                if (await isUnlocked !== "false") {
                    const SmartContracts = await flareContract.methods.getAllContracts().call();
                    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

                    let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

                    const accounts = (await provider.send("eth_requestAccounts")).result;
                    const account = accounts[0];
                    showAccountAddress(account);
                    const balance = await web32.eth.getBalance(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                    if (wrapBool === false) {
                        showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
                        showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                    } else {
                        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                        showBalance(round(web32.utils.fromWei(balance, "ether")));
                    }
                } else {
                    $.alert("You are not connected!");
                }
            } catch (error) {
                // console.log(error);
            }
        }
    }
}

// Is there a valid input?
export function isWrapInput() {
    if (Number(document.getElementById("AmountFrom").value.replace(/[^0-9]/g, '')) < 1) {
        document.getElementById("WrapButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        document.getElementById("WrapButton").style.cursor = "auto";
        document.getElementById("WrapButtonText").innerText = "Enter Amount";
        isRealValue = false;
    } else {
        document.getElementById("WrapButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        document.getElementById("WrapButton").style.cursor = "pointer";
        isRealValue = true;

        if (wrapBool === true) {
            document.getElementById("WrapButtonText").innerText = "Wrap";
        } else {
            document.getElementById("WrapButtonText").innerText = "Unwrap";
        }
    }
}

// Copy the input.
export function copyWrapInput() {

    let amountFrom = document.getElementById("AmountFrom");
    let amountTo = document.getElementById("AmountTo");
    let newValue = ''
    
    if (isNumber(amountFrom.value)) {
        newValue = amountFrom.value;
    }

    amountTo.value = newValue;
}

// DELEGATE MODULE

export async function ConnectWalletClickDelegate() {
    var selectedNetwork = document.getElementById("SelectedNetwork");
    let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

    try {
        const wrappedTokenAddr = await GetContract("WNat");
        let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
        showAccountAddress(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
    } catch (error) {
        // console.log(error);
    }
};

// Switch claim button to claimable.
export function switchDelegateButtonColor() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    claimBool = true;
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

export function switchDelegateButtonColorBack() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    claimBool = false;
    document.getElementById('ClaimButton').style.cursor = "auto";
}

export function isDelegateInput1() {
    if (Number(amount1.value.replace(/[^0-9]/g, '')) < 1 || Number(Amount1.value.replace(/^0-9]/g, '')) > 100) {
        document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        document.getElementById("ClaimButton").style.cursor = "auto";
        document.getElementById("ClaimButtonText").innerText = "Enter Amount";
        isRealValue = false;
    } else {
        if (Number(amount1.value.replace(/[^0-9]/g, '')) === 50 || Number(Amount1.value.replace(/[^0-9]/g, '')) === 100) {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "pointer";
            isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
            isDelegateInput3();
        } else {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            isRealValue = false;
        }
    }
}

export function isDelegateInput2() {
    if (Number(amount2.value.replace(/[^0-9]/g, '')) < 1 || Number(Amount2.value.replace(/[^0-9]/g, '')) > 100) {
        document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        document.getElementById("ClaimButton").style.cursor = "auto";
        document.getElementById("ClaimButtonText").innerText = "Enter Amount";
        isRealValue = false;
        isAmount2Active = false;
    } else {
        if (Number(amount2.value.replace(/[^0-9]/g, '')) === 50 || Number(Amount2.value.replace(/[^0-9]/g, '')) === 100) {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "pointer";
            isRealValue = true;
            isAmount2Active = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
            isDelegateInput3();
        } else {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            isRealValue = false;
            isAmount2Active = false;
        }
    }
}

export function isDelegateInput3() {
    if (Number(amount1.value.replace(/[^0-9]/g, '')) + Number(amount2.value.replace(/[^0-9]/g, '')) > 100 || Number(ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-ftso')) === 0) {
        document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        document.getElementById("ClaimButton").style.cursor = "auto";
        document.getElementById("ClaimButtonText").innerText = "Enter Amount";
        isRealValue = false;
        isAmount2Active = false;
    } else {
        if (Number(amount2.value.replace(/[^0-9]/g, '')) !== 0 && amount2.value.replace(/[^0-9]/g, '') !== '') {
            if (ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-ftso') === "0") {
                document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
                document.getElementById("ClaimButton").style.cursor = "auto";
                document.getElementById("ClaimButtonText").innerText = "Enter Amount";
                isRealValue = false;
                isAmount2Active = false;
            } else {
                document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
                document.getElementById("ClaimButton").style.cursor = "pointer";
                isRealValue = true;
                isAmount2Active = true;
                document.getElementById("ClaimButtonText").innerText = "Delegate";
            }
        } else {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "pointer";
            isRealValue = true;
            isAmount2Active = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
        }
    }
}

// Populate select elements.
export async function populateFtsos(ftso1, ftso2) {
    var insert = '<option value="" data-ftso="0" disabled selected hidden>Select FTSO</option>';
    var insert1 = '';
    var insert2 = '';
    var selectedNetwork = document.getElementById("SelectedNetwork");
    let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));
    let flareContract = new web32.eth.Contract(flrAbi, flrAddr);

    try {
        const SmartContracts = await flareContract.methods.getAllContracts().call();
        const voterWhitelistIndex = getKeyByValue(Object.values(SmartContracts)[0], "VoterWhitelister");
        const voterWhitelistAddr = SmartContracts[1][voterWhitelistIndex];
        let voterWhitelistContract = new web32.eth.Contract(voterWhitelisterAbiLocal, voterWhitelistAddr);

        const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();

        const ftsoJsonList = JSON.stringify(ftsoList);

        // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json
        fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
            .then(res => res.json())
            .then(FtsoInfo => {
                FtsoInfo.providers.sort((a, b) => a.name > b.name ? 1 : -1);

                let indexNumber;

                for (var f = 0; f < FtsoInfo.providers.length; f++) {
                    for (var i = 0; i < ftsoList.length; i++) {
                        if (FtsoInfo.providers[f].address === ftsoList[i]) {
                            indexNumber = f;
                            //<img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" class="delegatedIcon" id="delegatedIcon"/>

                            if (ftsoJsonList.includes(ftsoList[i])) {
                                if (FtsoInfo.providers[indexNumber].name === "FTSOCAN") {
                                    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                    insert1 += `<option value="${i}" data-img="${dappUrlBaseAddr}assets/${ftsoList[i]}.png" data-addr="${ftsoList[i]}" data-ftso="1">${FtsoInfo.providers[indexNumber].name}</option>`;
                                } else {
                                    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                    insert2 += `<option value="${i}" data-img="${dappUrlBaseAddr}assets/${ftsoList[i]}.png" data-addr="${ftsoList[i]}" data-ftso="1">${FtsoInfo.providers[indexNumber].name}</option>`;
                                }

                                ftso1.innerHTML = insert + insert1 + insert2;
                                ftso2.innerHTML = insert + insert1 + insert2;
                            } else {
                                alert('The FTSO you have delegated to is invalid!');
                                break;
                            }
                        }
                    }
                }
            });
    } catch (error) {
        // console.log(error)
    }
}

// CLAIM MODULE

export async function ConnectWalletClickClaim() {
    var selectedNetwork = document.getElementById("SelectedNetwork");
    let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

    try {
        const SmartContracts = await flareContract.methods.getAllContracts().call();
        const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
        const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
        const DistributionDelegatorsIndex = getKeyByValue(Object.values(SmartContracts)[0], "DistributionToDelegators");
        const DistributionDelegatorsAddr = SmartContracts[1][DistributionDelegatorsIndex];
        const ftsoRewardIndex = getKeyByValue(Object.values(SmartContracts)[0], "FtsoRewardManager");
        const ftsoRewardAddr = SmartContracts[1][ftsoRewardIndex];
        const voterWhitelistIndex = getKeyByValue(Object.values(SmartContracts)[0], "VoterWhitelister");
        const voterWhitelistAddr = SmartContracts[1][voterWhitelistIndex];
        let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);
        let DistributionDelegatorsContract = new web32.eth.Contract(distributionAbiLocal, DistributionDelegatorsAddr);
        let ftsoRewardContract = new web32.eth.Contract(ftsoRewardAbiLocal, ftsoRewardAddr);
        let voterWhitelistContract = new web32.eth.Contract(voterWhitelisterAbi, voterWhitelistAddr);
        const accounts = (await provider.send("eth_requestAccounts")).result;
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
        let insert1 = '';
        let insert2 = '';

        // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json
        fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
            .then(res => res.json())
            .then(FtsoInfo => {
                FtsoInfo.providers.sort((a, b) => a.name > b.name ? 1 : -1);

                var indexNumber;

                for (var f = 0; f < FtsoInfo.providers.length; f++) {
                    indexNumber = f;

                    for (var i = 0; i < delegatedFtsos.length; i++) {
                        if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                            if (ftsoJsonList.includes(delegatedFtsos[i])) {
                                if (FtsoInfo.providers[indexNumber].name === "FTSOCAN") {
                                    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                    insert1 = `<div class="wrapBoxFTSO" data-addr="${delegatedFtsos[i]}"><div class="wrapBoxContent"><img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegatedIcon" id="delegatedIcon"/><div class="ftsoIdentifier"><span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span></div><div class="Wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
                                } else {
                                    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                    insert2 += `<div class="wrapBoxFTSO" data-addr="${delegatedFtsos[i]}"><div class="wrapBoxContent"><img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegatedIcon" id="delegatedIcon"/><div class="ftsoIdentifier"><span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span></div><div class="Wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
                                }

                                delegatedFtsoElement.innerHTML = insert1 + insert2;
                            } else {
                                $.alert('The FTSO you have delegated to is invalid!');
                            }
                        }
                    }
                }
            });

        // Getting the unclaimed Rewards and affecting the Claim button.
        const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
        let unclaimedAmount = 0;
        let l;

        for (var k = 0; k < epochsUnclaimed.length; k++) {
            l = await ftsoRewardContract.methods.getStateOfRewards(account, epochsUnclaimed[k]).call();
            unclaimedAmount += Number(l[1]);
        }

        const convertedRewards = web32.utils.fromWei(unclaimedAmount, "ether");

        let claimableAmountFd;
        const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

        for (var m = 0; m < claimableMonths.length; m++) {
            claimableAmountFd += await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, Number(claimableMonths[m])).call();
        }

        var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

        // Changing the color of Claim buttons.
        if (Number(round(convertedRewards)) >= 1 && Number(round(convertedRewards)) < bucketTotal) {
            showRewards(round(convertedRewards));
            switchButtonColor();
        } else {
            switchButtonColorBack();
        }

        var fdBucketTotal = await web32.eth.getBalance(DistributionDelegatorsAddr);

        if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1 && Number(document.getElementById('ClaimFdButtonText').innerText) < fdBucketTotal) {
            showFdRewards(String(round(web32.utils.fromWei(claimableAmountFd, "ether"))));
            switchFdButtonColor();
        } else {
            switchFdButtonColorBack();
        }
    } catch (error) {
        // console.log(error);
    }
}