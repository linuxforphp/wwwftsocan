import {GetContract, Provider as provider, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";

import { ethers } from './ethers.js';

// ALL MODULES.

var DappObject = {
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

async function getAccount(operation) {
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

async function showSpinner(doSomething) {
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: 'We are processing your transaction. <br />Please wait...',
        theme: 'material',
        type: 'dark',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                isHidden: true, // hide the button
            },
        },
        onContentReady: async function () {
            await doSomething();
            this.close();
        }
    });
}

async function showConfirmationSpinner(txHash, web32) {
    var spinner =
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: 'Transaction is being propagated on the network. <br />Please wait...',
        theme: 'material',
        type: 'orange',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                isHidden: true, // hide the button
            },
        },
        onContentReady: async function () {
            await checkTx(txHash, web32, this);
        }
    });


}

async function showConfirm(txHash) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-solid fa-check green',
        title: 'Transaction confirmed!',
        content: 'Transaction hash: <br />',
        type: 'green',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    window.dappInit();
                },
            }
        },
        onContentReady: async function () {
            this.setContentAppend(txHash);
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

function showFail() {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-warning red',
        title: 'Transaction declined!',
        content: '',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {},
        },
        onContentReady: function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

async function handleAccountsChanged(accounts) {
    if (accounts.length !== 0) {
        document.getElementById("ConnectWallet").click();
    } else {
        document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
        showBalance(0.0);
        showTokenBalance(0.0);

        await window.ethereum.request({
            "method": "wallet_revokePermissions",
            "params": [
              {
                "eth_accounts": {}
              }
            ]
          });
    }
}

async function handleChainChanged() {
    try {
        var chainIdHexPromise = await provider.request({method: 'eth_chainId'}).then(async function(chainIdHex) {
            var realChainId;

            var selectedNetwork = document.getElementById("SelectedNetwork");

            realChainId = selectedNetwork.options[0].getAttribute('data-chainidhex');

            for (var i = 0; i < selectedNetwork?.options.length; i++) {
                if (selectedNetwork?.options[i].getAttribute('data-chainidhex') === String(chainIdHex)) {
                    selectedNetwork.options[i].setAttribute('selected', 'selected');
                    selectedNetwork.options.selectedIndex = i;
                    realChainId = chainIdHex;
                } else {
                    selectedNetwork.options[i].removeAttribute('selected');
                }
            }

            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                    "chainId": realChainId
                    }
                ]
                }).catch((error) => console.error(error));
        });

        document.getElementById("ConnectWallet").click();
    } catch (error) {
        // console.log(error);
    }
}

function downloadMetamask() {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: false,
        icon: 'fa fa-warning red',
        title: '<br>Metamask is not installed!',
        content: 'Would you like to install Metamask in your browser?',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            yes: {
                btnClass: 'btn-red',
                keys: ['enter'],
                action: function () {
                    var url = 'https://metamask.io/download/';

                    window.open(url, '_blank').focus();
                },
            },
            no: {}
        }
    });
}

// Simple math function.
function round(num) {
    return +(Math.round(num + "e+4") + "e-4");
}

// Is value a number?
function isNumber(value) {
    if (void 0 === value || null === value) {
        return false;
    }
    if (typeof value == "number") {
        return true;
    }
    return !isNaN(value - 0);
}

async function getChainIdHex() {
    return await provider.request({method: 'eth_chainId'});
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

function updateCall() {
    setInterval(function() {
        checkConnection();
    }, 20000);
}

async function checkTx(hash, web32, spinner) {

    // Set interval to regularly check if we can get a receipt
    let interval = setInterval(() => {

        web32.eth.getTransactionReceipt(hash).then((receipt) => {

            // If we've got a receipt, check status and log / change text accordingly
            if (receipt) {

                spinner.close();
                if (Number(receipt.status) === 1) {
                    showConfirm(receipt.transactionHash);
                    document.getElementById("ConnectWallet").click();
                } else if (Number(receipt.status) === 0) {
                    showFail();
                    document.getElementById("ConnectWallet").click();
                }

                // Clear interval
                clearInterval(interval)
            }
        })
    }, 5000)
}

async function getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier, flrAddr) {
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


async function createSelectedNetwork(DappObject) {
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
            networkSelectBox.options.selectedIndex = 0;
            
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
                                        networkSelectBox.options.selectedIndex = i;
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

async function isWalletConnected(ProviderObject) {
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
function showTokenIdentifiers(token, wrappedToken) {
    if (typeof token !== 'undefined' && token !== null) {
        document.getElementById("tokenIdentifier").innerText = token;
    }

    document.getElementById("wrappedTokenIdentifier").innerText = wrappedToken;
}

// WRAP MODULE

async function ConnectWalletClickWrap(rpcUrl, FlrAddr, DappObject) {
    document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    
    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, FlrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
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

async function toggleWrapButton(DappObject, tokenIdentifier, wrappedTokenIdentifier, rpcUrl, flrAddr) {
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
function setWrapButton(DappObject) {
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
function copyWrapInput() {
    let amountFrom = document.getElementById("AmountFrom");
    let amountTo = document.getElementById("AmountTo");
    let newValue = ''
    
    if (isNumber(amountFrom.value)) {
        newValue = amountFrom.value;
    }

    amountTo.value = newValue;
}

// DELEGATE MODULE

async function ConnectWalletClickDelegate(rpcUrl, flrAddr, DappObject) {
    document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
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
function switchDelegateButtonColor(claimBool) {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    claimBool = true;
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

function switchDelegateButtonColorBack(claimBool) {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    claimBool = false;
    document.getElementById('ClaimButton').style.cursor = "auto";
}

function isDelegateInput1(DappObject) {
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

function isDelegateInput2(DappObject) {
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

function isDelegateInput3(DappObject) {
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
async function populateFtsos(ftso1, ftso2, rpcUrl, flrAddr) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            var insert = '<option value="" data-ftso="0" disabled selected hidden>Select FTSO</option>';
            var insert1 = '';
            var insert2 = '';
            let web32 = new Web3(rpcUrl);
            let selectedNetwork = document.getElementById('SelectedNetwork');
            let chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex')

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
                            if ((FtsoInfo.providers[f].chainId === parseInt(chainIdHex, 16)) && (FtsoInfo.providers[f].listed === true)) {
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

async function ConnectWalletClickClaim(rpcUrl, flrAddr, DappObject) {
    document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

    var delegatedFtsoElement = document.getElementById('after');
    var networkSelectBox = document.getElementById('SelectedNetwork');

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
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
        showAccountAddress(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
        showFdRewards(0.0);
        showClaimRewards(0.0);

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

        remove(".wrap-box-ftso");

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

        if (networkSelectBox.options[networkSelectBox.selectedIndex].innerText === "FLR") {
            let claimableAmountFd;
            let claimableAmountFdBNTotal = ethers.BigNumber.from(0);
            let month;
            const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

            for (const property in claimableMonths) {
                month = !property.includes("_") && typeof claimableMonths[property] !== 'undefined' ? claimableMonths[property] : null;

                if (month && typeof month !== 'undefined' && isNumber(Number(month))) {
                    let claimableAmountMonth = await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, month).call();
                    claimableAmountFdBNTotal.add(claimableAmountMonth);
                }
            }

            claimableAmountFd = claimableAmountFdBNTotal.toNumber();

            // Changing the color of FlareDrop Claim button.

            showFdRewards(String(round(web32.utils.fromWei(claimableAmountFd, "ether"))));

            if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1) {
                switchClaimFdButtonColor();

                DappObject.fdClaimBool = true;
            } else {
                switchClaimFdButtonColorBack();

                DappObject.fdClaimBool = false;
            }
        }

        // Changing the color of Claim button.

        showClaimRewards(round(convertedRewards));

        if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
            switchClaimButtonColor();

            DappObject.claimBool = true;
        } else {
            showClaimRewards(0.0);
            switchClaimButtonColorBack();

            DappObject.claimBool = false;
        }
    } catch (error) {
        console.error(error);
    }
}

// Function to remove by id or class name.
const remove = (sel) => document.querySelectorAll(sel).forEach(el => el.remove());

// Switch claim button to claimable.
function switchClaimButtonColor() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

function switchClaimButtonColorBack() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    document.getElementById('ClaimButton').style.cursor = "auto";
}

function switchClaimFdButtonColor() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    document.getElementById('ClaimFdButton').style.cursor = "pointer";
}

function switchClaimFdButtonColorBack() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    document.getElementById('ClaimFdButton').style.cursor = "auto";
}

// Show current rewards.
function showClaimRewards(Rewards) {
    document.getElementById('ClaimButtonText').innerText = Rewards;
}

// Show current rewards.
 function showFdRewards(Rewards) {
    document.getElementById('ClaimFdButtonText').innerText = Rewards;
}

async function delegate(object) {
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
                .then(txHash => showConfirmationSpinner(txHash, web32))
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
                    .then(txHash => showConfirmationSpinner(txHash, web32))
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
            .then(txHash => showConfirmationSpinner(txHash, web32))
            .catch((error) => showFail());
        });
    } catch(error) {

    }
}

async function showAlreadyDelegated(DelegatedFtsos, object) {    
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

// INIT

window.dappInit = async (option) => {
    if (option === 1 || option === '1') {
        let selectedNetwork = document.getElementById("SelectedNetwork");
        let chainidhex;
        let rpcUrl;
        let networkValue;
        let tokenIdentifier;
        let wrappedTokenIdentifier;
        var wrapUnwrapButton = document.getElementById("wrapUnwrap");
        var fromIcon = document.getElementById("FromIcon");
        var toIcon = document.getElementById("ToIcon");
        document.getElementById("layer2").innerHTML = DappObject.flrLogo;
        document.getElementById("layer3").innerHTML = DappObject.flrLogo;

        await createSelectedNetwork(DappObject).then( async () => {
            getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

                showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);

                document.getElementById("ConnectWallet").addEventListener("click", async () => {
                    ConnectWalletClickWrap(object.rpcUrl, object.flrAddr, DappObject);
                });
            
                // We check if the input is valid, then copy it to the wrapped tokens section.
                document.querySelector("#AmountFrom").addEventListener("input", function () {
                    setWrapButton(DappObject);
                    copyWrapInput();
                });
            
                document.getElementById("wrapUnwrap").addEventListener("click", async () => {
                    toggleWrapButton(DappObject, object.tokenIdentifier, object.wrappedTokenIdentifier, object.rpcUrl, object.flrAddr);
                });
            
                // If the input is valid, we wrap on click of "WrapButton".
                document.getElementById("WrapButton").addEventListener("click", async () => {
                    if (DappObject.isRealValue === false) {
                        $.alert("Please enter valid value");
                    } else {
                        var web32 = new Web3(object.rpcUrl);
            
                        try {
                            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                            let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                            const accounts = await provider.request({method: 'eth_accounts'});
                            const account = accounts[0];
                            let balance = await web32.eth.getBalance(account);
                            let tokenBalance = await tokenContract.methods.balanceOf(account).call();
                            var amountFrom = document.getElementById("AmountFrom");
                            const amountFromValue = Number(amountFrom.value.replace(/[^0-9]/g, ''));
                            const amountFromValueWei = String(Number(web32.utils.toWei(amountFromValue, "ether")));
                            const amountFromValueWeiHex = Number(web32.utils.toWei(amountFromValue, "ether")).toString(16);
                            let txPayload = {};
                            
                            if (DappObject.wrapBool === true) {
                                txPayload = {
                                    from: account,
                                    to: wrappedTokenAddr,
                                    data: tokenContract.methods.deposit(amountFromValueWeiHex).encodeABI(),
                                    value: amountFromValueWeiHex
                                };
                            } else {
                                txPayload = {
                                    from: account,
                                    to: wrappedTokenAddr,
                                    data: tokenContract.methods.withdraw(amountFromValueWei).encodeABI()
                                };
                            }
            
                            const transactionParameters = txPayload;
            
                            if (DappObject.wrapBool === true && amountFromValue >= Number(web32.utils.fromWei(balance, "ether"))) {
                                $.alert("Insufficient Balance!");
                            } else if (DappObject.wrapBool === false && amountFromValue >= Number(web32.utils.fromWei(tokenBalance, "ether"))) {
                                $.alert("Insufficient Balance!");
                            } else {
                                showSpinner(async () => {
                                    await provider.request({
                                        method: 'eth_sendTransaction',
                                        params: [transactionParameters],
                                    })
                                    .then(txHash => showConfirmationSpinner(txHash, web32))
                                    .catch((error) => console.log(error));
                                });
                            }
                        } catch (error) {
                            console.log(error);
                            showFail();
                        }
                    }
                });

                document.getElementById("ConnectWallet").click();

                // When the Connect Wallet button is clicked, we connect the wallet, and if it
                // has already been clicked, we copy the public address to the clipboard.
                if (object.networkValue === '1') {
                    document.getElementById("layer2").innerHTML = DappObject.flrLogo;
                    document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                } else if (object.networkValue === '2') {
                    document.getElementById("layer2").innerHTML = DappObject.sgbLogo;
                    document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                } else {
                    document.getElementById("layer2").innerHTML = DappObject.costonLogo;
                    document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                }

                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
                object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
                setWrapButton(DappObject);

                //When Selected Network Changes, alert Metamask
                selectedNetwork.onchange = async () => {
                    object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
                    object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
                    object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

                    if (object.networkValue === '1') {
                        document.getElementById("layer2").innerHTML = DappObject.flrLogo;
                        document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                    } else if (object.networkValue === '2') {
                        document.getElementById("layer2").innerHTML = DappObject.sgbLogo;
                        document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                    } else {
                        document.getElementById("layer2").innerHTML = DappObject.costonLogo;
                        document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                    }

                    object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
                    object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                    showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
                    wrapUnwrapButton.value = "false";
                    fromIcon.style.color = "#fd000f";
                    toIcon.style.color = "#000";
                    document.getElementById("Wrap").style.color = "#fd000f";
                    document.getElementById("Unwrap").style.color = "#383a3b";
                    DappObject.wrapBool = true;

                    // Alert Metamask to switch.
                    try {
                        await window.ethereum.request({
                            method: "wallet_switchEthereumChain",
                            params: [
                                {
                                "chainId": object.chainIdHex
                                }
                            ]
                            }).catch((error) => console.error(error));

                        document.getElementById("ConnectWallet").click();
                    } catch (error) {
                        // console.log(error);
                    }
                    
                    setWrapButton(DappObject);
                }

                window.ethereum.on("accountsChanged", async (accounts) => {
                    handleAccountsChanged(accounts);
                });

                window.ethereum.on("chainChanged", async () => {
                    handleChainChanged();
                });
            });
        });

        updateCall();
    } else if (option === 2 || option === '2') {
        let selectedNetwork = document.getElementById("SelectedNetwork");
        let rpcUrl;
        let chainidhex;
        let networkValue;
        let ftso1 = document.getElementById("ftso-1");
        let ftso2 = document.getElementById("ftso-2");

        await createSelectedNetwork(DappObject).then( async () => {
            getSelectedNetwork(rpcUrl, chainidhex, networkValue).then(async (object) => {

                document.getElementById("ConnectWallet").addEventListener("click", async () => {
                    ConnectWalletClickDelegate(object.rpcUrl, object.flrAddr, DappObject);
                });
            
                document.getElementById("Amount1").addEventListener('input', function () {
                    isDelegateInput1(DappObject);
            
                    var str = this.value;
                    var suffix = "%";
            
                    if (str.search(suffix) === -1) {
                        str += suffix;
                    }
            
                    var actualLength = str.length - suffix.length;
            
                    if (actualLength === 0) {
                        this.value = str.substring(0, actualLength);
            
                        this.setSelectionRange(actualLength, actualLength);
                    } else {
                        this.value = str.substring(0, actualLength) + suffix;
            
                        // Set cursor position.
                        this.setSelectionRange(actualLength, actualLength);
                    }
                });
            
                document.getElementById("Amount2").addEventListener('input', function () {
                    isDelegateInput2(DappObject);
            
                    var str = this.value;
                    var suffix = "%";
            
                    if (str.search(suffix) === -1) {
                        str += suffix;
                    }
            
                    var actualLength = str.length - suffix.length;
            
                    if (actualLength === 0) {
                        this.value = str.substring(0, actualLength);
            
                        this.setSelectionRange(actualLength, actualLength);
                    } else {
                        this.value = str.substring(0, actualLength) + suffix;
            
                        // Set cursor position.
                        this.setSelectionRange(actualLength, actualLength);
                    }
                });
            
                document.getElementById("ClaimButton").addEventListener("click", async () => {
                    let web32 = new Web3(object.rpcUrl);
            
                    try {
                        const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                        const account = await getAccount('GET');
            
                        const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();
                        const delegatedFtsos = delegatesOfUser[0];
            
                        let ftsoNames = [];
            
                        fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
                        .then(res => res.json())
                        .then(FtsoInfo => {
                            FtsoInfo.providers.sort((a, b) => a.name > b.name ? 1 : -1);
            
                            var indexNumber;
            
                            for (var f = 0; f < FtsoInfo.providers.length; f++) {
                                indexNumber = f;
            
                                for (var i = 0; i < delegatedFtsos.length; i++) {
                                    if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                                        if (typeof ftsoNames[0] !== "undefined" && ftsoNames[0] !== null) {
                                            ftsoNames[1] = FtsoInfo.providers[indexNumber].name;
                                        } else {
                                            ftsoNames[0] = FtsoInfo.providers[indexNumber].name;
                                        }
                                    }
                                }
                            }
            
                            if (delegatedFtsos.length !== 0) {
                                showAlreadyDelegated(ftsoNames, object);
                            } else {
                                delegate(object);
                            }
                        });
                    } catch(error) {
                        //console.log(error);
                    }
                });

                document.getElementById("ConnectWallet").click();

                await populateFtsos(ftso1, ftso2, object.rpcUrl, object.flrAddr);

                isDelegateInput1(DappObject);

                if (DappObject.isAmount2Active) {
                    isDelegateInput2(DappObject);
                }

                ftso1.onchange = async () => {
                    let img = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-img');
                    let delegatedicon = document.getElementById("delegatedIcon1");
                    delegatedicon.src = img;
                    isDelegateInput1(DappObject);
                }

                ftso2.onchange = async () => {
                    let img = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-img');
                    let delegatedicon = document.getElementById("delegatedIcon2");
                    delegatedicon.src = img;
                    isDelegateInput2(DappObject);
                }

                selectedNetwork.onchange = async () => {
                    object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                    object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                    object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                    isDelegateInput1(DappObject);

                    if (DappObject.isAmount2Active) {
                        isDelegateInput2(DappObject);
                    }

                    // Alert Metamask to switch.
                    try {
                        await window.ethereum.request({
                            method: "wallet_switchEthereumChain",
                            params: [
                                {
                                "chainId": object.chainIdHex
                                }
                            ]
                            }).catch((error) => console.error(error));

                        document.getElementById("ConnectWallet").click();
                    } catch (error) {
                        // console.log(error);
                    }
                };

                window.ethereum.on("accountsChanged", async (accounts) => {
                    handleAccountsChanged(accounts);
                });

                window.ethereum.on("chainChanged", async () => {
                    handleChainChanged();
                });
            });
        });
    } else if (option === 3 || option === '3') {
        let selectedNetwork = document.getElementById("SelectedNetwork");
        let chainidhex;
        let rpcUrl;
        let networkValue;
        let tokenIdentifier;
        let wrappedTokenIdentifier;
        document.getElementById('layer3').innerHTML = DappObject.flrLogo;

        await createSelectedNetwork(DappObject).then( async () => {
            getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

                showTokenIdentifiers(null, object.wrappedTokenIdentifier);

                document.getElementById("ConnectWallet").addEventListener("click", async () => {
                    ConnectWalletClickClaim(object.rpcUrl, object.flrAddr, DappObject);
                });
            
                document.getElementById("ClaimButton").addEventListener("click", async () => {
                    if (DappObject.claimBool === true) {
                        let web32 = new Web3(object.rpcUrl);
                        var checkBox = document.getElementById("RewardsCheck");
            
                        try {
                            const accounts = await provider.request({method: 'eth_requestAccounts'});
                            const account = accounts[0];
                            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                            let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                            const ftsoRewardAddr = await GetContract("FtsoRewardManager", object.rpcUrl, object.flrAddr);
                            let ftsoRewardContract = new web32.eth.Contract(DappObject.ftsoRewardAbiLocal, ftsoRewardAddr);
                            const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
                            var transactionParameters;

                            var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

                            if ((Number(document.getElementById('ClaimButtonText').innerText) >= 1) && (Number(document.getElementById('ClaimButtonText').innerText) < bucketTotal)) {
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
                                    .then(txHash => showConfirmationSpinner(txHash, web32))
                                    .catch((error) => showFail());
                                });

                                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                                showClaimRewards(0.0);
                                switchClaimButtonColorBack(DappObject.claimBool);
                                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                            } else {
                                $.alert("The Rewards Bucket is empty! Please try again later.")
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            
                document.getElementById("ClaimFdButton").addEventListener("click", async () => {
                    if (DappObject.fdClaimBool === true) {
                        let web32 = new Web3(object.rpcUrl);
                        var checkBox = document.getElementById("RewardsCheck");
            
                        try {
                            let claimableAmountFd;
                            let claimableAmountFdBNTotal = ethers.BigNumber.from(0);
                            let month;
                            const accounts = await provider.request({method: 'eth_requestAccounts'});
                            const account = accounts[0];
                            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                            let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                            const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", object.rpcUrl, object.flrAddr);
                            let DistributionDelegatorsContract = new web32.eth.Contract(DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
                            const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();
            
                            var transactionParameters;

                            var fdBucketTotal = await web32.eth.getBalance(DistributionDelegatorsAddr);

                            if (Number(document.getElementById('ClaimFdButtonText').innerText >= 1) && (Number(document.getElementById('ClaimFdButtonText').innerText) < fdBucketTotal)) {
                                for (const property in claimableMonths) {
                                    month = !property.includes("_") && typeof claimableMonths[property] !== 'undefined' ? claimableMonths[property] : null;

                                    if (month && typeof month !== 'undefined' && isNumber(Number(month))) {
                                        let claimableAmountMonth = await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, month).call();
                                        claimableAmountFdBNTotal.add(claimableAmountMonth);
                                    }
                                }

                                claimableAmountFd = claimableAmountFdBNTotal.toNumber();

                                if (checkBox.checked) {
                                    transactionParameters = {
                                        from: account,
                                        to: DistributionDelegatorsAddr,
                                        data: DistributionDelegatorsContract.methods.claim(account, account, claimableAmountFd, true).encodeABI(),
                                    };
                                } else {
                                    transactionParameters = {
                                        from: account,
                                        to: DistributionDelegatorsAddr,
                                        data: DistributionDelegatorsContract.methods.claim(account, account, claimableAmountFd, false).encodeABI(),
                                    };
                                }
        
                                showSpinner(async () => {
                                    await provider.request({
                                        method: 'eth_sendTransaction',
                                        params: [transactionParameters],
                                    })
                                    .then(txHash => showConfirmationSpinner(txHash, web32))
                                    .catch((error) => showFail());
                                });

                                showFdRewards(0.0);
                                switchClaimFdButtonColorBack(DappObject.fdClaimBool);
                                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                            } else {
                                $.alert("The FlareDrop Bucket is empty! Please try again later.")
                            }
                        } catch (error) {
                            // console.log(error);
                        }
                    }
                });

                document.getElementById("ConnectWallet").click();

                if (object.networkValue === '1') {
                    document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                } else if (object.networkValue === '2') {
                    document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                } else {
                    document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                }

                selectedNetwork.onchange = async () => {
                    object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                    object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                    object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                    if (object.networkValue === '1') {
                        document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                    } else if (object.networkValue === '2') {
                        document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                    } else {
                        document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                    }

                    // Alert Metamask to switch.
                    try {
                        await window.ethereum.request({
                            method: "wallet_switchEthereumChain",
                            params: [
                                {
                                "chainId": object.chainIdHex
                                }
                            ]
                            }).catch((error) => console.error(error));

                        document.getElementById("ConnectWallet").click();
                    } catch (error) {
                        // console.log(error);
                    }
                };

                window.ethereum.on("accountsChanged", async (accounts) => {
                    handleAccountsChanged(accounts);
                });

                window.ethereum.on("chainChanged", async () => {
                    handleChainChanged();
                });
            });
        });
    }
};