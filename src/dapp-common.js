// ALL MODULES.

import {GetContract, Provider as provider, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";

export var DappObject = {
    costonLogo: FlareLogos.costonLogo,
    flrLogo: FlareLogos.flrLogo,
    sgbLogo: FlareLogos.sgbLogo,
    ercAbi: FlareAbis.WNat,
    voterWhitelisterAbi: FlareAbis.VoterWhitelister,
    distributionAbiLocal: FlareAbis.DistributionToDelegators,
    ftsoRewardAbiLocal: FlareAbis.FtsoRewardManager,
    wrapBool: true,
    claimBool: false,
    fdClaimBool: false,
    isRealValue: false,
    isAmount2Active: false,
    metamaskInstalled: false,
}

export async function getAccount(operation) {
    var accountAddr = document.getElementById("Accounts").getAttribute('data-address');

    if (operation === 'GET') {
        if (accountAddr.trim().length === 0 || accountAddr.trim() === null) {
            const accounts = await provider.request({method: 'eth_accounts'});
            const account = accounts[0].trim();

            document.getElementById("Accounts").setAttribute('data-address', account);

            return account;
        } else {
            return accountAddr;
        }
    } else if (operation === 'SET') {
        const accounts = await provider.request({method: 'eth_accounts'});
        const account = accounts[0].trim();

        document.getElementById("Accounts").setAttribute('data-address', account);

        return account;
    }
}

async function isConnected() {
    const accounts = await provider.request({method: 'eth_accounts'});

    if (accounts.length) {
        // console.log(`You're connected to: ${accounts[0]}`);
        return true;
    } else {
        // console.log("Metamask is not connected");
        return false;
    }
}

function checkConnection() {
    if (!navigator.onLine) {
        $.alert('Your Internet connection is unstable! Please make sure you can access the Internet.');
    }
}

export function updateCall() {
    setInterval(function() {
        checkConnection();
    }, 20000);
}

export async function getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier, flrAddr) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var selectedNetwork = document.getElementById("SelectedNetwork");
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
            networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
            flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = "W" + tokenIdentifier;

            var object = {}

            object.selectedNetwork = selectedNetwork;
            object.rpcUrl = rpcUrl;
            object.chainIdHex = chainidhex;
            object.networkValue = networkValue;
            object.tokenIdentifier = tokenIdentifier;
            object.wrappedTokenIdentifier = wrappedTokenIdentifier;
            object.flrAddr = flrAddr

            resolve(object);
        }, 200);
    })
}


export async function createSelectedNetwork(DappObject) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            var networkSelectBox = document.getElementById('SelectedNetwork');

            for (const property in dappNetworks) {
                var option = document.createElement("option");
                option.value = dappNetworks[property].id;
                option.text = dappNetworks[property].chainidentifier;
                option.setAttribute('data-chainidhex', '0x' + dappNetworks[property].chainid.toString(16));
                option.setAttribute('data-rpcurl', dappNetworks[property].rpcurl);
                option.setAttribute('data-registrycontract', dappNetworks[property].registrycontract);

                networkSelectBox.appendChild(option);
            }

            networkSelectBox.options[0].setAttribute('selected', 'selected');
            networkSelectBox.options.selectedIndex = Number(networkSelectBox.options[0].value) - 1;
            
            await provider.request({method: 'eth_requestAccounts'}).then(async function () {
                if (!provider) {
                    DappObject.metamaskInstalled = false;
                    downloadMetamask();
                } else {
                    DappObject.metamaskInstalled = true;
                    isConnected()
                        .then(async function () {
                            var chainIdHexPromise = await provider.request({method: 'eth_chainId'}).then(async function(chainIdHex) {
                                var realChainId;

                                realChainId = networkSelectBox.options[0].getAttribute('data-chainidhex');

                                for (var i = 0; i < networkSelectBox.options.length; i++) {
                                    if (networkSelectBox.options[i].getAttribute('data-chainidhex') === chainIdHex) {
                                        networkSelectBox.options[i].setAttribute('selected', 'selected');
                                        networkSelectBox.options.selectedIndex = Number(networkSelectBox.options[i].value) - 1;
                                        realChainId = chainIdHex;
                                    } else {
                                        networkSelectBox.options[i].removeAttribute('selected');
                                    }
                                }
            
                                if (DappObject.metamaskInstalled === true) {
                                    try {
                                        await window.ethereum.request({
                                            method: "wallet_switchEthereumChain",
                                            params: [
                                                {
                                                "chainId": realChainId
                                                }
                                            ]
                                            }).catch((error) => console.error(error));
                                    } catch (error) {
                                        console.log(error);
                                        if (error.code === 4902) {
                                            try {
                                                await ethereum.request({
                                                    method: 'wallet_addEthereumChain',
                                                    params: [
                                                        {
                                                            "chainId": realChainId,
                                                            "rpcUrls": [networkSelectBox.options[networkSelectBox.selectedIndex].getAttribute('data-rpcurl')],
                                                            "chainName": `${networkSelectBox.options[networkSelectBox.selectedIndex].innerText} Mainnet`,
                                                            "iconUrls": [
                                                                `https://portal.flare.network/token-logos/${networkSelectBox.options[networkSelectBox.selectedIndex].innerText}.svg`
                                                            ],
                                                            "nativeCurrency": {
                                                                "name": `${networkSelectBox.options[networkSelectBox.selectedIndex].innerText}`,
                                                                "symbol": `${networkSelectBox.options[networkSelectBox.selectedIndex].innerText}`,
                                                                "decimals": 18
                                                            }
                                                        },
                                                    ],
                                                });
                                            } catch (error) {
                                                throw(error);
                                            }
                                        }
                                    }
                                }
                                resolve();
                            });        
                        });
                }
            })
        }, 200);
    })
}

export async function isWalletConnected(ProviderObject) {
    if (ProviderObject instanceof MetaMaskSDK.MetaMaskSDK) {
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
    if (typeof token !== 'undefined' && token !== null) {
        document.getElementById("tokenIdentifier").innerText = token;
    }

    document.getElementById("wrappedTokenIdentifier").innerText = wrappedToken;
}

// WRAP MODULE

export async function ConnectWalletClickWrap(rpcUrl, FlrAddr, DappObject) {
    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, FlrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const account = await getAccount('GET');
        showAccountAddress(account);
        const balance = await web32.eth.getBalance(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();

        if (DappObject.wrapBool) {
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

export async function toggleWrapButton(DappObject, tokenIdentifier, wrappedTokenIdentifier, rpcUrl, flrAddr) {
    // Switching wrap/unwrap.
    if (DappObject.wrapBool === true) {
        DappObject.wrapBool = false;
        document.getElementById("wrapUnwrap").value = "true";
        document.getElementById("FromIcon").style.color = "#000";
        document.getElementById("ToIcon").style.color = "#fd000f";
        document.getElementById("Wrap").style.color = "#383a3b";
        document.getElementById("Unwrap").style.color = "#fd000f";
        showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
        setWrapButton(DappObject);
    } else {
        DappObject.wrapBool = true;
        document.getElementById("wrapUnwrap").value = "false";
        document.getElementById("FromIcon").style.color = "#fd000f";
        document.getElementById("ToIcon").style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        setWrapButton(DappObject);
    }

    document.getElementById("ConnectWallet").click();
}

// Is there a valid input?
export function setWrapButton(DappObject) {
    var wrapButton = document.getElementById("WrapButton");
    var wrapButtonText = document.getElementById("WrapButtonText");

    if (Number(document.getElementById("AmountFrom").value.replace(/[^0-9]/g, '')) < 1) {
        wrapButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        wrapButton.style.cursor = "auto";
        wrapButtonText.innerText = "Enter Amount";
        DappObject.isRealValue = false;
    } else {
        wrapButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        wrapButton.style.cursor = "pointer";
        DappObject.isRealValue = true;

        if (DappObject.wrapBool === true) {
            wrapButtonText.innerText = "Wrap";
        } else {
            wrapButtonText.innerText = "Unwrap";
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

export async function ConnectWalletClickDelegate(rpcUrl, flrAddr, DappObject) {
    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const account = await getAccount('GET');
        showAccountAddress(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
    } catch (error) {
        // console.log(error);
    }
};

// Switch claim button to claimable.
export function switchDelegateButtonColor(claimBool) {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    claimBool = true;
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

export function switchDelegateButtonColorBack(claimBool) {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    claimBool = false;
    document.getElementById('ClaimButton').style.cursor = "auto";
}

export function isDelegateInput1(DappObject) {
    let amount1 = document.getElementById("Amount1");
    let claimButton = document.getElementById("ClaimButton");

    if (Number(amount1.value.replace(/[^0-9]/g, '')) < 1 || Number(amount1.value.replace(/^0-9]/g, '')) > 100) {
        claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        claimButton.style.cursor = "auto";
        document.getElementById("ClaimButtonText").innerText = "Enter Amount";
        DappObject.isRealValue = false;
    } else {
        if (Number(amount1.value.replace(/[^0-9]/g, '')) === 50 || Number(amount1.value.replace(/[^0-9]/g, '')) === 100) {
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
            isDelegateInput3(DappObject);
        } else {
            claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            claimButton.style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            DappObject.isRealValue = false;
        }
    }
}

export function isDelegateInput2(DappObject) {
    let amount2 = document.getElementById("Amount2");
    let claimButton = document.getElementById("ClaimButton");

    if (Number(amount2.value.replace(/[^0-9]/g, '')) < 1 || Number(amount2.value.replace(/[^0-9]/g, '')) > 100) {
        claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        claimButton.style.cursor = "auto";
        document.getElementById("ClaimButtonText").innerText = "Enter Amount";
        DappObject.isRealValue = false;
        DappObject.isAmount2Active = false;
    } else {
        if (Number(amount2.value.replace(/[^0-9]/g, '')) === 50 || Number(amount2.value.replace(/[^0-9]/g, '')) === 100) {
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            DappObject.isAmount2Active = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
            isDelegateInput3(DappObject);
        } else {
            claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            claimButton.style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            DappObject.isRealValue = false;
            DappObject.isAmount2Active = false;
        }
    }
}

export function isDelegateInput3(DappObject) {
    let ftso1 = document.getElementById("ftso-1");
    let ftso2 = document.getElementById("ftso-2");
    let amount1 = document.getElementById("Amount1");
    let amount2 = document.getElementById("Amount2");
    let claimButton = document.getElementById("ClaimButton");

    if (Number(amount1.value.replace(/[^0-9]/g, '')) + Number(amount2.value.replace(/[^0-9]/g, '')) > 100 || Number(ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-ftso')) === 0) {
        claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        claimButton.style.cursor = "auto";
        document.getElementById("ClaimButtonText").innerText = "Enter Amount";
        DappObject.isRealValue = false;
        DappObject.isAmount2Active = false;
    } else {
        if (Number(amount2.value.replace(/[^0-9]/g, '')) !== 0 && amount2.value.replace(/[^0-9]/g, '') !== '') {
            if (ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-ftso') === "0") {
                claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
                claimButton.style.cursor = "auto";
                document.getElementById("ClaimButtonText").innerText = "Enter Amount";
                DappObject.isRealValue = false;
                DappObject.isAmount2Active = false;
            } else {
                claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
                claimButton.style.cursor = "pointer";
                DappObject.isRealValue = true;
                DappObject.isAmount2Active = true;
                document.getElementById("ClaimButtonText").innerText = "Delegate";
            }
        } else {
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            DappObject.isAmount2Active = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
        }
    }
}

// Populate select elements.
export async function populateFtsos(ftso1, ftso2, rpcUrl, flrAddr) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            var insert = '<option value="" data-ftso="0" disabled selected hidden>Select FTSO</option>';
            var insert1 = '';
            var insert2 = '';
            let web32 = new Web3(rpcUrl);

            try {
                const voterWhitelistAddr = await GetContract("VoterWhitelister", rpcUrl, flrAddr);
                let voterWhitelistContract = new web32.eth.Contract(DappObject.voterWhitelisterAbi, voterWhitelistAddr);

                const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders("0").call();

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
                                        $.alert('The FTSO you are delegated to is invalid!');
                                        break;
                                    }
                                }
                            }
                        }
                    });
            } catch (error) {
                console.log(error)
            }

            resolve();
        }, 200);
    })
}

// CLAIM MODULE

export async function ConnectWalletClickClaim(rpcUrl, flrAddr, DappObject) {
    var delegatedFtsoElement = document.getElementById('after');
    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
        const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", rpcUrl, flrAddr);
        const ftsoRewardAddr = await GetContract("FtsoRewardManager", rpcUrl, flrAddr);
        const voterWhitelistAddr = await GetContract("VoterWhitelister", rpcUrl, flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        let DistributionDelegatorsContract = new web32.eth.Contract(DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
        let ftsoRewardContract = new web32.eth.Contract(DappObject.ftsoRewardAbiLocal, ftsoRewardAddr);
        let voterWhitelistContract = new web32.eth.Contract(DappObject.voterWhitelisterAbi, voterWhitelistAddr);
        const account = await getAccount('GET');
        showAccountAddress(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
        showFdRewards(0.0);
        showRewards(0.0);

        // Changing the color of Claim button.
        if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
            switchClaimButtonColor();
            
            DappObject.claimBool = true;
        } else {
            switchClaimButtonColorBack();

            DappObject.claimBool = false;
        }

        if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1) {
            switchClaimFdButtonColor();
            
            DappObject.fdClaimBool = true;
        } else {
            switchClaimFdButtonColorBack();

            DappObject.fdClaimBool = false;
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
                                    insert1 = `<div class="wrap-box-ftso" data-addr="${delegatedFtsos[i]}"><div class="wrap-box-content"><img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegated-icon" id="delegatedIcon"/><div class="ftso-identifier"><span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span></div><div class="wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
                                } else {
                                    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                    insert2 += `<div class="wrap-box-ftso" data-addr="${delegatedFtsos[i]}"><div class="wrap-box-content"><img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegated-icon" id="delegatedIcon"/><div class="ftso-identifier"><span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span></div><div class="wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
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
            switchClaimButtonColor();

            DappObject.claimBool = true;
        } else {
            switchClaimButtonColorBack();

            DappObject.claimBool = false;
        }

        var fdBucketTotal = await web32.eth.getBalance(DistributionDelegatorsAddr);

        if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1 && Number(document.getElementById('ClaimFdButtonText').innerText) < fdBucketTotal) {
            showFdRewards(String(round(web32.utils.fromWei(claimableAmountFd, "ether"))));
            switchClaimFdButtonColor();

            DappObject.fdClaimBool = true;
        } else {
            switchClaimFdButtonColorBack();

            DappObject.fdClaimBool = false;
        }
    } catch (error) {
        // console.log(error);
    }
}

// Function to remove by id or class name.
export const remove = (sel) => document.querySelectorAll(sel).forEach(el => el.remove());

// Switch claim button to claimable.
export function switchClaimButtonColor() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

export function switchClaimButtonColorBack() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    document.getElementById('ClaimButton').style.cursor = "auto";
}

export function switchClaimFdButtonColor() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    document.getElementById('ClaimFdButton').style.cursor = "pointer";
}

export function switchClaimFdButtonColorBack() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    document.getElementById('ClaimFdButton').style.cursor = "auto";
}

// Show current rewards.
export function showClaimRewards(Rewards) {
    document.getElementById('ClaimButtonText').innerText = Rewards;
}

// Show current rewards.
export function showFdRewards(Rewards) {
    document.getElementById('ClaimFdButtonText').innerText = Rewards;
}

export async function delegate(object) {
    if (DappObject.isRealValue === false) {
        $.alert("Please enter valid value. (50% or 100%)");
    } else {
        let amount1 = document.getElementById("Amount1");
        let amount2 = document.getElementById("Amount2");
        let ftso1 = document.getElementById("ftso-1");
        let ftso2 = document.getElementById("ftso-2");

        let web32 = new Web3(object.rpcUrl);

        web32.setProvider(provider);

        const value1 = amount1.value;
        const value2 = amount2.value;

        const percent1 = value1.replace(/[^0-9]/g, '');
        const percent2 = value2.replace(/[^0-9]/g, '');

        const bips1 = Number(percent1) * 100;
        const bips2 = Number(percent2) * 100;

        var addr1 = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-addr');
        var addr2 = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-addr');

        try {
            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
            let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
            const accounts = await provider.request({method: 'eth_requestAccounts'});
            const account = accounts[0];

            const transactionParameters2 = {
                from: account,
                to: wrappedTokenAddr,
                data: tokenContract.methods.delegate(addr1, bips1).encodeABI(),
            };

            showSpinner(async () => {
                await provider.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters2],
                })
                .then((txHash) => showConfirm(txHash))
                .catch((error) => showFail());
            });

            if (DappObject.isAmount2Active) {
                const transactionParameters3 = {
                    from: account,
                    to: wrappedTokenAddr,
                    data: tokenContract.methods.delegate(addr2, bips2).encodeABI(),
                };

                showSpinner(async () => {
                    await provider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters3],
                    })
                        .then((txHash) => showConfirm(txHash))
                        .catch((error) => showFail());
                });
            }
        } catch (error) {
        }
    }
}

async function undelegate(object) {
    let web32 = new Web3(object.rpcUrl);

    web32.setProvider(provider);

    try {
        const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];

        const transactionParameters = {
            from: account,
            to: wrappedTokenAddr,
            data: tokenContract.methods.undelegateAll().encodeABI(),
        };

        showSpinner(async () => {
            await provider.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            })
            .then((txHash) => showConfirm(txHash))
            .catch((error) => showFail());
        });
    } catch(error) {

    }
}

export async function showAlreadyDelegated(DelegatedFtsos, object) {    
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-solid fa-flag red',
        title: 'Already delegated!',
        content: 'You have already delegated to ',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            undelegate: {
                btnClass: 'btn-red',
                action: function () {
                    undelegate(object);
                },
            },
            cancel: function () {
            }
        },
        onContentReady: function () {
            if (DelegatedFtsos.length > 1) {
                this.setContentAppend(DelegatedFtsos[0] + " and " + DelegatedFtsos[1] + ". <br />");
            } else {
                this.setContentAppend(DelegatedFtsos[0] + ". <br />");
            }
            this.setContentAppend("Are you sure you want to undelegate? <br />");
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}