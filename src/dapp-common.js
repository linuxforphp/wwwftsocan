// Copyright 2024, Andrew Caya <andrewscaya@yahoo.ca>
// Copyright 2024, Jean-Thomas Caya

import {GetContract, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";
import { ethers } from "./ethers.js";

// ALL MODULES.

var DappObject = {
    costonLogo: FlareLogos.costonLogo,
    flrLogo: FlareLogos.flrLogo,
    sgbLogo: FlareLogos.sgbLogo,
    ercAbi: FlareAbis.WNat,
    voterWhitelisterAbi: FlareAbis.VoterWhitelister,
    distributionAbiLocal: FlareAbis.DistributionToDelegators,
    ftsoRewardAbiLocal: FlareAbis.FtsoRewardManager,
    addressBinderAbiLocal: FlareAbis.AddressBinder,
    wrapBool: true,
    claimBool: false,
    fdClaimBool: false,
    isRealValue: false,
    isAmount2Active: false,
    transferBool: true,
    metamaskInstalled: false,
    ledgerStake: false,
    signatureStaking: "",
    unPrefixedAddr: "",
    ledgerAddrArray: [],
    ledgerSelectedIndex: "",
    ledgerSelectedAddress: "",
}

const provider = window.ethereum;

function unPrefix0x (input) {
    return input.startsWith("0x") ? input.slice(2) : input;
}

async function getAccount(operation) {
    var accountAddr = document.getElementById("Accounts").getAttribute('data-address');

    if (operation === 'GET' || operation === 'POST') {
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

function decimalToInteger(dec, offset) {
    let ret = dec;
    if (ret.includes(".")) {
      const split = ret.split(".");
      ret = split[0] + split[1].slice(0, offset).padEnd(offset, "0");
    } else {
      ret = ret + "0".repeat(offset);
    }
    return ret;
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
        content: 'Waiting for network confirmation. <br />Please wait...',
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

async function showConfirmationSpinnerStake(doSomething) {
    var spinner =
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: '<div id="ExportTx"><div id="ExportTxIcon" class="fa fa-spinner fa-spin"></div> Export Transaction status: <div id="ExportTxStatus">Processing...</div></div><br />' + '<div id="ImportTx"><div id="ImportTxIcon" class="fa fa-spinner fa-spin"></div> Import Transaction status: <div id="ImportTxStatus">Processing...</div></div>',
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
            await doSomething(this);
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
                    document.getElementById("ConnectWallet").click();
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

async function showConfirmStake(DappObject, stakingOption, txHashes) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-solid fa-check green',
        title: 'Transaction confirmed!',
        content: '',
        type: 'green',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    RefreshStakingPage(DappObject, stakingOption);
                },
            }
        },
        onContentReady: async function () {
            for (let i = 0; i < txHashes.length; i++) {
                this.setContentAppend(txHashes[i] + "<br />");
            }

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
            ok: {
                action: function () {
                    document.getElementById("ConnectWallet").click();
                },
            },
        },
        onContentReady: function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

function showFailStake(DappObject, stakingOption) {
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
            ok: {
                action: function () {
                    RefreshStakingPage(DappObject, stakingOption);
                },
            },
        },
        onContentReady: function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

async function showBindPAddress(contract, address, publicKey, addressPchainEncoded) {
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-warning',
        title: 'P-Address Invalid!',
        content: 'Your P-Chain address is not bound to your C-Chain address! <br /> If you do not bind them, you will not be able to stake. <br /> Do you wish to bind them?',
        type: 'orange',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            yes: {
                action: function () {
                    contract.registerAddresses(publicKey, addressPchainEncoded, address);
                },
            },
            no: {
                action: function () {
                    this.close();
                },
            }
        },
        onContentReady: async function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

async function handleAccountsChanged(accounts, DappObject, pageIndex = 1) {
    DappObject.signatureStaking = "";

    if (pageIndex === 1 || pageIndex === '1') {
        if (accounts.length !== 0) {
            document.getElementById("ConnectWallet").click();
        } else {
            document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
            showBalance(0);
            showTokenBalance(0);
    
            await window.ethereum.request({
                "method": "wallet_revokePermissions",
                "params": [
                  {
                    "eth_accounts": {}
                  }
                ]
              });
        }
    } else if (pageIndex === 3 || pageIndex === '3') {
        if (accounts.length !== 0) {
            document.getElementById("ConnectWallet").click();
        } else {
            document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
            showTokenBalance(0);
            showConnectedAccountAddress('0x0');
    
            await window.ethereum.request({
                "method": "wallet_revokePermissions",
                "params": [
                  {
                    "eth_accounts": {}
                  }
                ]
              });
        }
    } else if (pageIndex === 4 || pageIndex === '4') {
        document.getElementById("ConnectPChain").click();
    }
}

async function handleChainChanged() {
    try {
        var chainIdHexPromise = await provider.request({method: 'eth_chainId'}).then(async function(chainIdHex) {
            var realChainId;

            var changeEvent = new Event("change");

            var selectedNetwork = document.getElementById("SelectedNetwork");

            realChainId = selectedNetwork.options[0].getAttribute('data-chainidhex');

            for (var i = 0; i < selectedNetwork?.options.length; i++) {
                if (selectedNetwork?.options[i].getAttribute('data-chainidhex') === String(chainIdHex)) {
                    selectedNetwork.options[i].setAttribute('selected', 'selected');
                    selectedNetwork.options.selectedIndex = i;
                    realChainId = chainIdHex;
                    selectedNetwork.dispatchEvent(changeEvent);
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

async function handleChainChangedStake() {
    await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
            {
            "chainId": "0xe"
            }
        ]
        }).catch((error) => console.error(error));
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
    var i = 0;
    
    // Set interval to regularly check if we can get a receipt
    let interval = setInterval(() => {
        i += 1;
        
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
                clearInterval(interval);
            }
        });
        
        if (i === 20) {
            spinner.close();

            showFail();

            document.getElementById("ConnectWallet").click();
            
            // Clear interval
            clearInterval(interval);
        }
    }, 6000)
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
                                        // console.log(error);

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

async function getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject) {
    var delegatedFtsoElement = document.getElementById('delegate-wrapbox');

    const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
    let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
    let voterWhitelistAddr = await GetContract("VoterWhitelister", rpcUrl, flrAddr);
    let voterWhitelistContract = new web32.eth.Contract(DappObject.voterWhitelisterAbi, voterWhitelistAddr);

    // Getting which FTSO(s) the user has delegated to, the percentage of WNat he has
    // delegated,and the logo of said FTSO(s).
    const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();
    const ftsoJsonList = JSON.stringify(ftsoList);
    const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();
    const delegatedFtsos = delegatesOfUser[0];
    const BipsJson = delegatesOfUser[1];
    let Bips = [];

    if (typeof BipsJson[0] !== 'undefined' && BipsJson[0] != 0) {
        Bips = BipsJson[0] / 100n;
    } else {
        Bips = 0;
    }

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
                                    insert1 = `<div class="wrap-box-ftso" data-addr="${delegatedFtsos[i]}">
                                                    <div class="row">
                                                        <div class="wrap-box-content">
                                                            <img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegated-icon" id="delegatedIcon"/>
                                                            <div class="ftso-identifier">
                                                                <span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span>
                                                            </div>
                                                            <div class="wrapper-ftso">
                                                                <span id="delegatedBips1">${Bips}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="wrapper-claim">
                                                            <span>Provider:</span>
                                                            <span class="address-claim">${delegatedFtsos[i]}</span>
                                                        </div>
                                                    </div>
                                                </div>`;
                                } else {
                                    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                    insert2 += `<div class="wrap-box-ftso" data-addr="${delegatedFtsos[i]}">
                                                    <div class="row">
                                                        <div class="wrap-box-content">
                                                            <img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegated-icon" id="delegatedIcon"/>
                                                            <div class="ftso-identifier">
                                                                <span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span>
                                                            </div>
                                                            <div class="wrapper-ftso">
                                                                <span id="delegatedBips2">${Bips}%</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="wrapper-claim">
                                                            <span>Provider:</span>
                                                            <span class="address-claim">${delegatedFtsos[i]}</span>
                                                        </div>
                                                    </div>
                                                </div>`;
                                }
                            } else {
                                $.alert('The FTSO you have delegated to is invalid!');
                            }
                        }
                    }
                }

                let delegatedFtsoElementChildren = delegatedFtsoElement.getElementsByClassName('wrap-box-ftso');

                while (delegatedFtsoElementChildren[0]) {
                    delegatedFtsoElementChildren[0].parentNode.removeChild(delegatedFtsoElementChildren[0]);
                }

                delegatedFtsoElement.insertAdjacentHTML('afterbegin', insert1 + insert2);

                isDelegateInput1(DappObject);
            }
        );
}

// WRAP MODULE

async function ConnectWalletClickWrap(rpcUrl, flrAddr, DappObject) {
    document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    
    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
        showAccountAddress(account);
        const balance = await web32.eth.getBalance(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();

        DappObject.wrapBool = (document.getElementById("wrapUnwrap").value === 'true');

        if (DappObject.wrapBool === true) {
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
        document.getElementById("wrapUnwrap").value = "false";
        document.getElementById("FromIcon").style.color = "#000";
        document.getElementById("ToIcon").style.color = "#fd000f";
        document.getElementById("Wrap").style.color = "#383a3b";
        document.getElementById("Unwrap").style.color = "#fd000f";
        showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
        setWrapButton(DappObject);
    } else {
        DappObject.wrapBool = true;
        document.getElementById("wrapUnwrap").value = "true";
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

    let delegatedIcon1 = document.getElementById("delegatedIcon1");
    delegatedIcon1.src = dappUrlBaseAddr + 'img/FLR.svg';

    isDelegateInput1(DappObject);

    await populateFtsos(rpcUrl, flrAddr);

    let web32 = new Web3(rpcUrl);

    try {
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
        showAccountAddress(account);
        await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);
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

function getDelegatedBips() {
    let delegatedBips = 0;
    let delegatedBips1 = document.getElementById('delegatedBips1');
    let delegatedBips2 = document.getElementById('delegatedBips2');
    let delegatedBips1Value = 0;
    let delegatedBips2Value = 0;

    if (typeof delegatedBips1 !== 'undefined' && delegatedBips1 !== null) {
        delegatedBips1Value = Number(delegatedBips1?.innerText.replace(/[^0-9]/g, ''));

        delegatedBips = delegatedBips1Value;
    }

    if (typeof delegatedBips2 !== 'undefined' && delegatedBips2 !== null) {
        delegatedBips2Value = Number(delegatedBips2?.innerText.replace(/[^0-9]/g, ''));

        delegatedBips += delegatedBips2Value;
    }

    return delegatedBips;
}

function isDelegateInput1(DappObject) {
    let delegatedBips = getDelegatedBips();

    let claimButton = document.getElementById("ClaimButton");

    let wrapbox1 = document.getElementById('wrapbox-1');

    if (delegatedBips === 100) {
        if (typeof wrapbox1 !== 'undefined' && wrapbox1 !== null) {
            wrapbox1.style.display = "none";
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = "Undelegate all";
        }
    } else {
        if (typeof wrapbox1 !== 'undefined' && wrapbox1 !== null) {
            wrapbox1.removeAttribute('style');
        }

        let amount1 = document.getElementById("Amount1");

        if (delegatedBips === 0 && (Number(amount1.value.replace(/[^0-9]/g, '')) === 50 || Number(amount1.value.replace(/[^0-9]/g, '')) === 100)) {
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
        } else if (delegatedBips === 50 && Number(amount1.value.replace(/[^0-9]/g, '')) === 50) {
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = "Delegate";
        } else {
            claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            claimButton.style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            DappObject.isRealValue = false;
        }
    }
}

// Populate select elements.
async function populateFtsos(rpcUrl, flrAddr) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            var insert = [];
            let web32 = new Web3(rpcUrl);
            let selectedNetwork = document.getElementById('SelectedNetwork');
            let chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');

            try {
                const voterWhitelistAddr = await GetContract("VoterWhitelister", rpcUrl, flrAddr);
                let voterWhitelistContract = new web32.eth.Contract(DappObject.voterWhitelisterAbi, voterWhitelistAddr);

                const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders("0").call();

                const ftsoJsonList = JSON.stringify(ftsoList);

                var onInputChange = async (value) => {
                    let ftso1 = document.querySelector(".selectize-input");
                    let img = ftso1.childNodes[0].childNodes[0].getAttribute('data-img');
                    let delegatedicon = document.getElementById("delegatedIcon1");
                    delegatedicon.src = img;
                    isDelegateInput1(DappObject);
                }

                // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json
                fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
                    .then(res => res.json())
                    .then(FtsoInfo => {
                        FtsoInfo.providers.sort((a, b) => a.name > b.name ? 1 : -1);

                        let indexNumber;

                        let g = 1;

                        for (var f = 0; f < FtsoInfo.providers.length; f++) {
                            if ((FtsoInfo.providers[f].chainId === parseInt(chainIdHex, 16)) && (FtsoInfo.providers[f].listed === true)) {
                                for (var i = 0; i < ftsoList.length; i++) {
                                    if (FtsoInfo.providers[f].address === ftsoList[i]) {
                                        indexNumber = f;

                                        //<img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" class="delegatedIcon" id="delegatedIcon"/>
                                        if (ftsoJsonList.includes(ftsoList[i])) {
                                            if (FtsoInfo.providers[indexNumber].name === "FTSOCAN") {
                                                // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                                insert[0] = {
                                                    id: 0,
                                                    title: FtsoInfo.providers[indexNumber].name,
                                                    nodeid: ftsoList[i],
                                                    img: dappUrlBaseAddr + "assets/" + ftsoList[i] + ".png"
                                                }; 
                                            } else {
                                                // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                                insert[g] = {
                                                    id: g,
                                                    title: FtsoInfo.providers[indexNumber].name,
                                                    nodeid: ftsoList[i],
                                                    img: dappUrlBaseAddr + "assets/" + ftsoList[i] + ".png"
                                                }; 

                                                g += 1;
                                            }
                                        } else {
                                            $.alert('The FTSO you are delegated to is invalid!');
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                    console.log(insert);

                    $('#select-ftso').selectize({
                        maxItems: 1,
                        valueField: 'id',
                        labelField: 'title',
                        searchField: ["title", "nodeid"],
                        options: insert,
                        render: {
                            item: function (item, escape) {
                                return (
                                "<div>" +
                                (item.title
                                    ? `<span class="title" data-img=${item.img} data-addr=${item.nodeid}>` + escape(item.title) + "</span>"
                                    : "") +
                                "</div>"
                                );
                            },
                            option: function (item, escape) {
                                var label = item.title || item.nodeid;
                                var caption = item.title ? item.nodeid : null;
                                return (
                                "<div>" +
                                '<span class="ftso-name">' +
                                escape(label) +
                                "</span>" +
                                (caption
                                    ? '<span class="ftso-address">' + escape(caption) + "</span>"
                                    : "") +
                                "</div>"
                                );
                            },
                        },
                        onChange: function(value) {
                            onInputChange(value);
                        },
                        create: false,
                        dropdownParent: "body",
                    });
                });
            } catch (error) {
                // console.log(error)
            }

            resolve();
        }, 200);
    })
}

// CLAIM MODULE

async function ConnectWalletClickClaim(rpcUrl, flrAddr, DappObject) {
    document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

    var networkSelectBox = document.getElementById('SelectedNetwork');

    let web32 = new Web3(rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
        const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", rpcUrl, flrAddr);
        const ftsoRewardAddr = await GetContract("FtsoRewardManager", rpcUrl, flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        let DistributionDelegatorsContract = new web32.eth.Contract(DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
        let ftsoRewardContract = new web32.eth.Contract(DappObject.ftsoRewardAbiLocal, ftsoRewardAddr);
        const accounts = await provider.request({method: 'eth_requestAccounts'});
        const account = accounts[0];
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();

        showAccountAddress(account);
        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
        showFdRewards(0);
        showClaimRewards(0);
        showConnectedAccountAddress(account);

        // Changing the color of Claim button.
        if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
            switchClaimButtonColor();
            
            DappObject.claimBool = true;
        } else {
            switchClaimButtonColorBack();

            DappObject.claimBool = false;
        }

        if (Number(document.getElementById('ClaimFdButtonText').innerText) > 0) {
            switchClaimFdButtonColor();
            
            DappObject.fdClaimBool = true;
        } else {
            switchClaimFdButtonColorBack();

            DappObject.fdClaimBool = false;
        }

        remove(".wrap-box-ftso");

        await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);

        // Getting the unclaimed Rewards and affecting the Claim button.
        const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
        let unclaimedAmount = BigInt(0);
        let l;

        for (var k = 0; k < epochsUnclaimed.length; k++) {
            l = await ftsoRewardContract.methods.getStateOfRewards(account, epochsUnclaimed[k]).call();
            
            if (typeof l[1][0] === "bigint") {
                unclaimedAmount += l[1][0];
            } else {
                unclaimedAmount += BigInt(l[1][0]);
            }
        }
        
        const convertedRewards = String(Number.parseFloat(web32.utils.fromWei(unclaimedAmount, "ether")).toFixed(2));
        
        // Changing the color of Claim button.
        showClaimRewards(convertedRewards);

        if (networkSelectBox.options[networkSelectBox.selectedIndex].innerText === "FLR") {
            let claimableAmountFd = BigInt(0);
            let month;
            const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

            for (const property in claimableMonths) {
                month = !property.includes("_") && typeof claimableMonths[property] !== 'undefined' ? claimableMonths[property] : null;

                if (month && typeof month !== 'undefined' && isNumber(Number(month))) {
                    let claimableAmountMonth = await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, month).call();
                    
                    if (typeof claimableAmountMonth === "bigint") {
                        claimableAmountFd += claimableAmountMonth;
                    } else {
                        claimableAmountFd += BigInt(claimableAmountMonth);
                    }
                }
            }
            
            const convertedRewardsFd = String(Number.parseFloat(web32.utils.fromWei(claimableAmountFd, "ether")).toFixed(2));

            // Changing the color of FlareDrop Claim button.
            showFdRewards(convertedRewardsFd);

            if (Number(document.getElementById('ClaimFdButtonText').innerText) > 0) {
                switchClaimFdButtonColor();

                DappObject.fdClaimBool = true;
            } else {
                switchClaimFdButtonColorBack();

                DappObject.fdClaimBool = false;
            }
        }

        if (Number(document.getElementById('ClaimButtonText').innerText) > 0) {
            switchClaimButtonColor();

            DappObject.claimBool = true;
        } else {
            showClaimRewards(0);
            switchClaimButtonColorBack();

            DappObject.claimBool = false;
        }
    } catch (error) {
        console.error(error);
    }
}

function showConnectedAccountAddress(address) {
    document.getElementById('AccountAddress').innerText = address;
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
function showClaimRewards(rewards) {
    document.getElementById('ClaimButtonText').innerText = rewards == 0 ? '0' : rewards;
}

// Show current rewards.
 function showFdRewards(rewards) {
    document.getElementById('ClaimFdButtonText').innerText = rewards == 0 ? '0' : rewards;
}

async function delegate(object, DappObject) {
    if (DappObject.isRealValue === false) {
        $.alert("Please enter valid value. (50% or 100%)");
    } else {
        let amount1 = document.getElementById("Amount1");
        let ftso1 = document.querySelector(".selectize-input");

        let web32 = new Web3(object.rpcUrl);

        web32.setProvider(provider);

        const value1 = amount1.value;

        const percent1 = value1.replace(/[^0-9]/g, '');

        const bips1 = Number(percent1) * 100;

        var addr1 = ftso1.childNodes[0].childNodes[0].getAttribute('data-addr');

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

            isDelegateInput1(DappObject);
        } catch (error) {
            console.log(error);
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
            this.setContentAppend("You MUST undelegate before you can delegate to another provider. <br />");
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

// STAKE MODULE

async function ConnectPChainClickStake(stakingOption, DappObject, HandleClick, PassedPublicKey, PassedEthAddr, addressIndex) {
    if (typeof PassedPublicKey === "undefined") {
        document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    }

    let rpcUrl = "https://sbi.flr.ftsocan.com/ext/C/rpc";

    let flrAddr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

    let web32 = new Web3(rpcUrl);

    let message = "You are enabling the FTSOCAN DApp to access your accounts PUBLIC key to derive your P-Chain address. Additionally, you are acknowledging the risks involved with staking on Flare and the usage of the MetaMask 'eth_sign' functionality. \n\nWE ARE NOT RESPONSIBLE FOR ANY LOSSES OF FUNDS AFTER STAKING. CONTINUE AT YOUR OWN RISK!";

    try {
        let flrPublicKey;

        let account;

        let selectize;

        if (typeof addressIndex !== "undefined") {
            DappObject.ledgerSelectedIndex = addressIndex;
        }

        if (DappObject.ledgerStake === true && typeof PassedPublicKey === "undefined") {
            if (!Array.isArray(DappObject.ledgerAddrArray) || !DappObject.ledgerAddrArray.length) {
                let addresses = await getLedgerAddresses("flare");

                let insert = [];

                for (let i = 0; i < addresses.length; i++) {
                    insert[i] = {
                        id: i,
                        title: addresses[i].ethAddress,
                        pubkey: addresses[i].publicKey,
                    };
                }

                DappObject.ledgerAddrArray = insert;
            }

            console.log(DappObject.ledgerAddrArray);

            document.getElementById("ConnectWalletText").innerHTML = '<select id="select-account" class="connect-wallet-text" placeholder="Select Account"></select>'

            var onInputChange = async (value) => {
                let addressBox = document.querySelector(".selectize-input");
                let ethaddr = addressBox.childNodes[0].childNodes[0].getAttribute('data-ethkey');
                let pubKey = addressBox.childNodes[0].childNodes[0].getAttribute('data-pubkey');
                
                flrPublicKey = pubKey;

                account = ethaddr;

                DappObject.ledgerSelectedAddress = account;

                console.log("Value: " + value);

                DappObject.ledgerSelectedIndex = value;

                connectChainsAndKeys(flrPublicKey);

                let unprefixed = await publicKeyToBech32AddressString(flrPublicKey, "flare");

                DappObject.unPrefixedAddr = unprefixed;

                ConnectPChainClickStake(stakingOption, DappObject, HandleClick, flrPublicKey, ethaddr, value);
            }

            var $select = $('#select-account').selectize({
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: ["title"],
                options: DappObject.ledgerAddrArray,
                render: {
                    item: function (item, escape) {
                        return (
                        "<div>" +
                        (item.title
                            ? `<span class="title connect-wallet-text" data-pubkey=${item.pubkey} data-ethkey=${item.title}>` + escape(item.title) + "</span>"
                            : "") +
                        "</div>"
                        );
                    },
                    option: function (item, escape) {
                        var label = item.title;
                        return (
                        "<div>" +
                        '<span class="connect-wallet-text">' +
                        escape(label) +
                        "</span>" +
                        "</div>"
                        );
                    },
                },
                onChange: function(value) {
                    onInputChange(value);
                },
                create: false,
                dropdownParent: "body",
            });

            selectize = $select[0].selectize;

            console.log("LEDGER SELECTED INDEX: " + DappObject.ledgerSelectedIndex);

            if (DappObject.ledgerSelectedIndex !== "") {
                selectize.setValue([Number(DappObject.ledgerSelectedIndex)]);
            }

            let addressDropdown = document.querySelector(".selectize-input");
            let publicKey = addressDropdown?.childNodes[0]?.childNodes[0]?.getAttribute('data-pubkey');
                
            flrPublicKey = publicKey;
        } else if (DappObject.ledgerStake === false && typeof PassedPublicKey === "undefined") {
            const accounts = await provider.request({method: 'eth_requestAccounts'});
            
            account = accounts[0];

            if (DappObject.signatureStaking === "") {

                let signSpinner = $.confirm({
                    escapeKey: false,
                    backgroundDismiss: false,
                    icon: 'fa fa-spinner fa-spin',
                    title: 'Loading...',
                    content: 'Waiting for signature confirmation. <br />Remember to turn on "eth_sign"...',
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
                    }
                });

                const signature = await provider.request({
                    "method": "personal_sign",
                    "params": [
                    message,
                    account
                    ]
                }).catch((error) => async function() {
                    signSpinner.close();

                    throw error;
                });

                DappObject.signatureStaking = signature;

                signSpinner.close();
            }

            flrPublicKey = await GetPublicKey(account, message, DappObject.signatureStaking);
        } else if (typeof PassedPublicKey !== "undefined") {
            account = PassedEthAddr;
            flrPublicKey = PassedPublicKey;
        }

        console.log(flrPublicKey);

        if (typeof flrPublicKey !== 'undefined') {

            const addressBinderAddr = await GetContract("AddressBinder", rpcUrl, flrAddr);

            const AddressBinderContract = new web32.eth.Contract(DappObject.addressBinderAbiLocal, addressBinderAddr);

            connectChainsAndKeys(flrPublicKey);

            const ethAddressString = await publicKeyToEthereumAddressString(flrPublicKey);

            const CchainAddr = ethers.utils.getAddress(ethAddressString);

            const PchainAddr = await publicKeyToBech32AddressString(flrPublicKey, "flare");

            DappObject.unPrefixedAddr = PchainAddr;

            DappObject.ledgerSelectedAddress = account;

            const PchainAddrEncoded = await publicKeyToPchainEncodedAddressString(flrPublicKey);
                
            const addressPchain = await AddressBinderContract.methods.cAddressToPAddress(CchainAddr).call();

            if (addressPchain !== "0x0000000000000000000000000000000000000000") {

                const prefixedPchainAddress = "P-" + PchainAddr;

                const PchainBalanceObject = await getPchainBalanceOf(prefixedPchainAddress);

                const PchainBalanceBigInt = BigInt(PchainBalanceObject.balance);

                const balance = await web32.eth.getBalance(account);

                console.log(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));

                console.log(stakingOption);

                console.log(PchainAddrEncoded);

                console.log(flrPublicKey);

                let addressBox = document.querySelector(".selectize-input");

                if (DappObject.ledgerStake === true) {          
                    addressBox.childNodes[0].childNodes[0].innerText = prefixedPchainAddress;
                } else {
                    showAccountAddress(prefixedPchainAddress);
                }

                if (stakingOption === 1) {
                    if (DappObject.transferBool === true) {
                        showBalance(round(web32.utils.fromWei(balance, "ether")));

                        showPchainBalance(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));
                    } else {
                        showBalance(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));

                        showPchainBalance(round(web32.utils.fromWei(balance, "ether")));
                    }
                } else if (stakingOption === 2) {
                    let delegatedIcon1 = document.getElementById("delegatedIcon1");
                    delegatedIcon1.src = dappUrlBaseAddr + 'img/FLR.svg';
                
                    // isDelegateInput1(DappObject);
                
                    await populateValidators();
                
                    try {
                        // await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);
                    } catch (error) {
                        // console.log(error);
                    }
                }
            } else {
                await showBindPAddress(AddressBinderContract, account, flrPublicKey, PchainAddrEncoded);

                document.getElementById("ConnectPChain").click();
            }
        } else {
            document.getElementById("ConnectPChain").removeEventListener("click", HandleClick);
        }
    } catch (error) {
        console.log(error);

        document.getElementById("ConnectWalletText").innerText = "Connect to P-Chain";

        DappObject.signatureStaking = "";

        DappObject.ledgerSelectedIndex = "";

        DappObject.ledgerSelectedAddress = "";

        DappObject.unPrefixedAddr = "";

        DappObject.ledgerAddrArray = [];

        var ClickHandler;

        document.getElementById("ConnectPChain").addEventListener("click", ClickHandler = async () => {
            ConnectPChainClickStake(stakingOption, DappObject, ClickHandler);
        });
    }
}

async function RefreshStakingPage(DappObject, stakingOption) {
    let rpcUrl = "https://sbi.flr.ftsocan.com/ext/C/rpc";

    let web32 = new Web3(rpcUrl);

    if (DappObject.unPrefixedAddr !== "") {

        const prefixedPchainAddress = "P-" + DappObject.unPrefixedAddr;

        const PchainBalanceObject = await getPchainBalanceOf(prefixedPchainAddress);

        const PchainBalanceBigInt = BigInt(PchainBalanceObject.balance);

        const balance = await web32.eth.getBalance(DappObject.ledgerSelectedAddress);

        let addressBox = document.querySelector(".selectize-input");

        if (DappObject.ledgerStake === true) {          
            addressBox.childNodes[0].childNodes[0].innerText = prefixedPchainAddress;
        } else {
            showAccountAddress(prefixedPchainAddress);
        }

        if (stakingOption === 1) {
            if (DappObject.transferBool === true) {
                showBalance(round(web32.utils.fromWei(balance, "ether")));

                showPchainBalance(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));
            } else {
                showBalance(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));

                showPchainBalance(round(web32.utils.fromWei(balance, "ether")));
            }
        } else if (stakingOption === 2) {
            let delegatedIcon1 = document.getElementById("delegatedIcon1");
            delegatedIcon1.src = dappUrlBaseAddr + 'img/FLR.svg';
        
            // isDelegateInput1(DappObject);
        
            await populateValidators();
        
            try {
                // await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);
            } catch (error) {
                // console.log(error);
            }
        }
    } else {
        document.getElementById("ConnectPChain").click();
    }
}

async function connectChainsAndKeys(publicKey) {
    const cKeychain = await keychainc();
    const pKeychain = await keychainp();

    cKeychain.importKey(
      `PublicKey-${unPrefix0x(publicKey)}`
    );
    pKeychain.importKey(
      `PublicKey-${unPrefix0x(publicKey)}`
    );
}

async function GetPublicKey(address, message, signature) {
    const messageHash = ethers.utils.hashMessage(message);
    const recoveredPublicKey = ethers.utils.recoverPublicKey(messageHash, signature);

    // To confirm the signer's address, you can compute the Ethereum address from the recovered public key
    const recoveredAddress = ethers.utils.computeAddress(recoveredPublicKey);
  
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        return recoveredPublicKey;
    } else {
        throw new Error("Failed to verify signer.");
    }
}

async function showPchainBalance(Pchainbalance) {
    document.getElementById("TokenBalance").innerText = Pchainbalance;
}

async function toggleTransferButton(DappObject, stakingOption) {
    var transferIcon = document.getElementById("TransferIcon");

    var fromText = document.getElementById("FromText");
    var toText = document.getElementById("ToText");

    // Switching wrap/unwrap.
    if (DappObject.transferBool === true) {

        DappObject.transferBool = false;
        setTransferButton2(DappObject);

        fromText.style.color = "#000";
        toText.style.color = "#fd000f";
        fromText.innerText = "P";
        toText.innerText = "C";
    } else {
        DappObject.transferBool = true;
        setTransferButton(DappObject);

        fromText.style.color = "#fd000f";
        toText.style.color = "#000";
        fromText.innerText = "C";
        toText.innerText = "P";
    }

    RefreshStakingPage(DappObject, stakingOption);
}

// Is there a valid input?
function setTransferButton(DappObject) {
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

        wrapButtonText.innerText = "Transfer Funds";
    }
}

function setTransferButton2(DappObject) {
    var wrapButton = document.getElementById("WrapButton");
    var wrapButtonText = document.getElementById("WrapButtonText");

    if (Number(document.getElementById("AmountTo").value.replace(/[^0-9]/g, '')) < 1) {
        wrapButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        wrapButton.style.cursor = "auto";
        wrapButtonText.innerText = "Enter Amount";
        DappObject.isRealValue = false;
    } else {
        wrapButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        wrapButton.style.cursor = "pointer";
        DappObject.isRealValue = true;

        wrapButtonText.innerText = "Transfer Funds";
    }
}

// Copy the input.
function copyTransferInput() {
    let amountFrom = document.getElementById("AmountFrom");
    let amountTo = document.getElementById("AmountTo");
    let newValue = ''
    
    if (isNumber(amountTo.value)) {
        newValue = amountTo.value;
    }

    amountFrom.value = newValue;
}

// Transfer button

async function transferTokens(DappObject, stakingOption) {
    if (DappObject.isRealValue === false) {
        $.alert("Please enter a valid value");
    } else {
        let rpcUrl = "https://sbi.flr.ftsocan.com/ext/C/rpc";

        var web32 = new Web3(rpcUrl);

        try {
            const accounts = await provider.request({method: 'eth_accounts'});
            const account = accounts[0];
            var amountFrom = document.getElementById("AmountFrom");
            var amountTo = document.getElementById("AmountTo");
            const amountFromValue = amountFrom.value;

            if (!isNumber(amountFromValue)) {
                $.alert("Invalid number of tokens!");
            } else {
                const amountFromValueInt = web32.utils.toWei(amountFromValue, "gwei");

                console.log(amountFromValueInt);

                if (DappObject.transferBool === true) {
                    // C-chain to P-chain

                    // getting C-Chain Keychain

                    const cKeychain = await keychainc();

                    const pKeychain = await keychainp();

                    const nonce = await web32.eth.getTransactionCount(account);

                    console.log(cKeychain);

                    let cChainTransactionId;

                    let pChainTransactionId;

                    // export tokens C-Chain

                    try {
                        showConfirmationSpinnerStake(async (spinner) => {
                            const cChainTxId = await exportTokensP(DappObject.unPrefixedAddr, account, cKeychain, nonce, amountFromValueInt, DappObject.ledgerStake, DappObject.ledgerSelectedIndex).then(result => {
                                return new Promise((resolve, reject) => {
                                    console.log("C Chain TX ID: " + result.txid);

                                    cChainTransactionId = result.txid;
                                    
                                    try {
                                        let status = waitCchainAtomicTxStatus(result.txid).then(value => {
                                            console.log(value);

                                            switch (value) {
                                                case "Accepted":
                                                    spinner.$content.find('#ExportTxStatus').html('Accepted');
                                                    spinner.$content.find('#ExportTxIcon').removeClass();
                                                    spinner.$content.find('#ExportTxIcon').addClass("fa fa-solid fa-check");
                                                    setTimeout(() => {
                                                        resolve("Success");
                                                    }, 1500);
                                                    break
                                                case "Dropped":
                                                    spinner.$content.find('#ExportTxStatus').html('Dropped');
                                                    spinner.$content.find('#ExportTxIcon').removeClass();
                                                    spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                    resolve("Failed");
                                                    spinner.close();
                                                    showFailStake(DappObject, stakingOption);
                                                    break
                                                case "Unknown":
                                                    spinner.$content.find('#ExportTxStatus').html('Unknown');
                                                    spinner.$content.find('#ExportTxIcon').removeClass();
                                                    spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                    setTimeout(() => {
                                                        resolve("Unknown");
                                                    }, 1500);
                                                    break
                                                default:
                                                    break
                                            }
                                        });
                                    } catch (error) {
                                        console.log(error);
                                    }
                                });
                            }).then(async result => {
                                if (result == "Success" || result == "Unknown") {
                                    const pChainTxId = await importTokensP(DappObject.unPrefixedAddr, account, pKeychain, 1, DappObject.ledgerStake, DappObject.ledgerSelectedIndex).then(result => {
                                        console.log("P Chain TX ID: " + result.txid);
        
                                        pChainTransactionId = result.txid;
                                    
                                        try {
                                            let status = waitPchainAtomicTxStatus(result.txid).then(value => {
                                                console.log(value);
        
                                                switch (value) {
                                                    case "Committed":
                                                        spinner.$content.find('#ImportTxStatus').html('Committed');
                                                        spinner.$content.find('#ImportTxIcon').removeClass();
                                                        spinner.$content.find('#ImportTxIcon').addClass("fa fa-solid fa-check");
                                                        spinner.close();
                                                        showConfirmStake(DappObject, stakingOption, [cChainTransactionId,pChainTransactionId]);
                                                        break
                                                    case "Dropped":
                                                        spinner.$content.find('#ImportTxStatus').html('Dropped');
                                                        spinner.$content.find('#ImportTxIcon').removeClass();
                                                        spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                        spinner.close();
                                                        showFailStake(DappObject, stakingOption);
                                                        break
                                                    case "Unknown":
                                                        spinner.$content.find('#ImportTxStatus').html('Unknown');
                                                        spinner.$content.find('#ImportTxIcon').removeClass();
                                                        spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                        spinner.close();
                                                        showFailStake(DappObject, stakingOption);
                                                        break
                                                    default:
                                                        break
                                                }
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    });
                                };
                            });
                        });
                    } catch (error) {
                        console.log("ERROR C-chain to P-chain");
                        throw error;
                    }
                } else {
                    // P-chain to C-chain

                    // getting C-Chain Keychain

                    const cKeychain = await keychainc();

                    const pKeychain = await keychainp();

                    console.log(cKeychain);

                    let cChainTransactionId;

                    let pChainTransactionId;

                    // export tokens P-Chain

                    try {
                        showConfirmationSpinnerStake(async (spinner) => {
                            const pChainTxId = await exportTokensC(DappObject.unPrefixedAddr, account, pKeychain, amountFromValueInt, DappObject.ledgerStake, DappObject.ledgerSelectedIndex).then(result => {
                                return new Promise((resolve, reject) => {
                                    console.log("P Chain TX ID: " + result);

                                    pChainTransactionId = result;
                                
                                    try {
                                        let status = waitPchainAtomicTxStatus(result).then(value => {
                                            console.log(value);

                                            switch (value) {
                                                case "Committed":
                                                    spinner.$content.find('#ExportTxStatus').html('Committed');
                                                    spinner.$content.find('#ExportTxIcon').removeClass();
                                                    spinner.$content.find('#ExportTxIcon').addClass("fa fa-solid fa-check");
                                                    setTimeout(() => {
                                                        resolve("Success");
                                                    }, 1500);
                                                    break
                                                case "Dropped":
                                                    spinner.$content.find('#ExportTxStatus').html('Dropped');
                                                    spinner.$content.find('#ExportTxIcon').removeClass();
                                                    spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                    resolve("Failed");
                                                    spinner.close();
                                                    showFailStake(DappObject, stakingOption);
                                                    break
                                                case "Unknown":
                                                    spinner.$content.find('#ExportTxStatus').html('Unknown');
                                                    spinner.$content.find('#ExportTxIcon').removeClass();
                                                    spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                    setTimeout(() => {
                                                        resolve("Unknown");
                                                    }, 1500);
                                                    break
                                                default:
                                                    break
                                            }
                                        });
                                    } catch (error) {
                                        console.log(error);
                                    }
                                });
                            }).then(async result => {
                                if (result == "Success" || result == "Unknown") {
                                    const cChainTxId = await importTokensC(DappObject.unPrefixedAddr, account, cKeychain, DappObject.ledgerStake, DappObject.ledgerSelectedIndex).then(result => {
                                        console.log("C Chain TX ID: " + result);

                                        cChainTransactionId = result;
                                        
                                        try {
                                            let status = waitCchainAtomicTxStatus(result).then(value => {
                                                console.log(value);

                                                switch (value) {
                                                    case "Accepted":
                                                        spinner.$content.find('#ImportTxStatus').html('Accepted');
                                                        spinner.$content.find('#ImportTxIcon').removeClass();
                                                        spinner.$content.find('#ImportTxIcon').addClass("fa fa-solid fa-check");
                                                        spinner.close();
                                                        showConfirmStake(DappObject, stakingOption, [pChainTransactionId,cChainTransactionId]);
                                                        break
                                                    case "Dropped":
                                                        spinner.$content.find('#ImportTxStatus').html('Dropped');
                                                        spinner.$content.find('#ImportTxIcon').removeClass();
                                                        spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                        spinner.close();
                                                        showFailStake(DappObject, stakingOption);
                                                        break
                                                    case "Unknown":
                                                        spinner.$content.find('#ImportTxStatus').html('Unknown');
                                                        spinner.$content.find('#ImportTxIcon').removeClass();
                                                        spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                        spinner.close();
                                                        showFailStake(DappObject, stakingOption);
                                                        break
                                                    default:
                                                        break
                                                }
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }   
                                    });
                                };
                            });
                        });
                    } catch (error) {
                        console.log("ERROR P-chain to C-chain");
                        throw error;
                    }
                }

                if (typeof amountFrom !== 'undefined' && amountFrom != null && typeof amountTo !== 'undefined' && amountTo != null) {
                    amountFrom.value = "";
                    amountTo.value = "";
                }

                setTransferButton(DappObject);
            }
        } catch (error) {
            console.log(error);
            showFailStake(DappObject, stakingOption);
        }
    }
}

// Populate select elements.
async function populateValidators() {
    return new Promise((resolve) => {
        setTimeout(async () => {
            var insert = [];

            try {

                const ftsoList = await getValidators();

                console.log(ftsoList);

                var onInputChange = async (value) => {
                    let ftso1 = document.querySelector(".selectize-input");
                    let img = ftso1.childNodes[0].childNodes[0].getAttribute('data-img');
                    let delegatedicon = document.getElementById("delegatedIcon1");
                    delegatedicon.src = img;
                    // isDelegateInput1(DappObject);
                }

                // Origin: https://raw.githubusercontent.com/jtcaya/validator_list_json/master/validatorlist.json
                fetch(dappUrlBaseAddr + 'validatorlist.json')
                    .then(res => res.json())
                    .then(FtsoInfo => {
                        FtsoInfo.validators.sort((a, b) => a.name > b.name ? 1 : -1);

                        let indexNumber;

                        let g = 1;

                        for (var f = 0; f < FtsoInfo.validators.length; f++) {
                            for (var i = 0; i < ftsoList.length; i++) {
                                if (FtsoInfo.validators[f].nodeId === ftsoList[i].nodeID) {
                                    indexNumber = f;

                                    //<img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" class="delegatedIcon" id="delegatedIcon"/>
                                    if (FtsoInfo.validators[indexNumber].name === "FTSOCAN") {
                                        // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                        insert[0] = {
                                            id: 0,
                                            title: FtsoInfo.validators[indexNumber].name,
                                            nodeid: ftsoList[i].nodeID,
                                            img: dappUrlBaseAddr + "assets/" + FtsoInfo.validators[indexNumber].address + ".png"
                                        }; 
                                    } else {
                                        // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                        insert[g] = {
                                            id: g,
                                            title: FtsoInfo.validators[indexNumber].name,
                                            nodeid: ftsoList[i].nodeID,
                                            img: dappUrlBaseAddr + "assets/" + FtsoInfo.validators[indexNumber].address + ".png"
                                        }; 

                                        g += 1;
                                    }
                                }
                            }
                        }

                    console.log(insert);

                    $('#select-validator').selectize({
                        maxItems: 1,
                        valueField: 'id',
                        labelField: 'title',
                        searchField: ["title", "nodeid"],
                        options: insert,
                        render: {
                            item: function (item, escape) {
                                return (
                                "<div>" +
                                (item.title
                                    ? `<span class="title" data-img=${item.img} data-addr=${item.nodeid}>` + escape(item.title) + "</span>"
                                    : "") +
                                "</div>"
                                );
                            },
                            option: function (item, escape) {
                                var label = item.title || item.nodeid;
                                var caption = item.title ? item.nodeid : null;
                                return (
                                "<div>" +
                                '<span class="ftso-name">' +
                                escape(label) +
                                "</span>" +
                                (caption
                                    ? '<span class="ftso-address">' + escape(caption) + "</span>"
                                    : "") +
                                "</div>"
                                );
                            },
                        },
                        onChange: function(value) {
                            onInputChange(value);
                        },
                        create: false,
                        dropdownParent: "body",
                    });
                });
            } catch (error) {
                // console.log(error)
            }

            resolve();
        }, 200);
    })
}

// INIT

window.dappInit = async (option, stakingOption) => {
    if (!provider) {
        downloadMetamask();
    } else {
        await MMSDK.init();
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
                            $.alert("Please enter a valid value");
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
                                var amountTo = document.getElementById("AmountTo");
                                const amountFromValue = parseFloat(amountFrom.value);

                                if (!isNumber(amountFromValue)) {
                                    $.alert("Invalid number of tokens!");
                                } else {
                                    const amountFromValueWei = web32.utils.toWei(amountFromValue, "ether");
                                    const amountFromValueWeiBN = BigInt(amountFromValueWei);
                                    const amountFromValueWeiHex = web32.utils.toHex(amountFromValueWeiBN);

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
                                            data: tokenContract.methods.withdraw(amountFromValueWeiBN).encodeABI()
                                        };
                                    }

                                    const transactionParameters = txPayload;

                                    if (DappObject.wrapBool === true && amountFromValueWeiBN > balance) {
                                        $.alert("Insufficient balance!");
                                    } else if (DappObject.wrapBool === false && amountFromValueWeiBN > tokenBalance) {
                                        $.alert("Insufficient balance!");
                                    } else {
                                        if (typeof amountFrom !== 'undefined' && amountFrom != null && typeof amountTo !== 'undefined' && amountTo != null) {
                                            amountFrom.value = "";
                                            amountTo.value = "";
                                        }

                                        showSpinner(async () => {
                                            await provider.request({
                                                method: 'eth_sendTransaction',
                                                params: [transactionParameters],
                                            })
                                                .then(txHash => showConfirmationSpinner(txHash, web32))
                                                .catch((error) => showFail());
                                        });

                                        setWrapButton(DappObject);
                                    }
                                }
                            } catch (error) {
                                // console.log(error);
                                // showFail();
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
                        DappObject.wrapBool = false;
                        wrapUnwrapButton.value = "false";
                        fromIcon.style.color = "#fd000f";
                        toIcon.style.color = "#000";
                        document.getElementById("Wrap").style.color = "#fd000f";
                        document.getElementById("Unwrap").style.color = "#383a3b";
                        document.getElementById("wrapUnwrap").click();

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
                        handleAccountsChanged(accounts, DappObject);
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

                                let delegatedBips = getDelegatedBips();
                
                                if (delegatedFtsos.length === 2 || delegatedBips === 100) {
                                    showAlreadyDelegated(ftsoNames, object);
                                } else {
                                    delegate(object, DappObject);
                                }
                            });
                        } catch(error) {
                            //console.log(error);
                        }
                    });

                    document.getElementById("ConnectWallet").click();

                    isDelegateInput1(DappObject);

                    selectedNetwork.onchange = async () => {
                        object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                        object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                        object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

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
                        } catch (error) {
                            // console.log(error);
                        }
                    };

                    window.ethereum.on("accountsChanged", async (accounts) => {
                        handleAccountsChanged(accounts, DappObject);
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
                                let txPayload = {};

                                var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

                                if ((Number(document.getElementById('ClaimButtonText').innerText) > 0) && (Number(document.getElementById('ClaimButtonText').innerText) < bucketTotal)) {
                                    if (checkBox.checked) {
                                        txPayload = {
                                            from: account,
                                            to: ftsoRewardAddr,
                                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[epochsUnclaimed.length - 1]), true).encodeABI(),
                                        };
                                    } else {
                                        txPayload = {
                                            from: account,
                                            to: ftsoRewardAddr,
                                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[epochsUnclaimed.length - 1]), false).encodeABI(),
                                        };
                                    }
                                    
                                    const transactionParameters = txPayload;
                    
                                    showSpinner(async () => {
                                        await provider.request({
                                            method: 'eth_sendTransaction',
                                            params: [transactionParameters],
                                        })
                                        .then(txHash => showConfirmationSpinner(txHash, web32))
                                        .catch((error) => showFail());
                                    });

                                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                                    
                                    showClaimRewards(0);
                                    switchClaimButtonColorBack(DappObject.claimBool);
                                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                                } else {
                                    $.alert("The Rewards Bucket is empty! Please try again later.")
                                }
                            } catch (error) {
                                // console.log(error);
                            }
                        }
                    });
                
                    document.getElementById("ClaimFdButton").addEventListener("click", async () => {
                        if (DappObject.fdClaimBool === true) {
                            let web32 = new Web3(object.rpcUrl);
                            var checkBox = document.getElementById("RewardsCheck");
                
                            try {
                                const accounts = await provider.request({method: 'eth_requestAccounts'});
                                const account = accounts[0];
                                const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                                let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                                const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", object.rpcUrl, object.flrAddr);
                                let DistributionDelegatorsContract = new web32.eth.Contract(DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
                                let month;
                                let currentMonth = 0;
                                const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

                                for (const property in claimableMonths) {
                                    month = !property.includes("_") && typeof claimableMonths[property] !== 'undefined' ? claimableMonths[property] : null;

                                    if (month && typeof month !== 'undefined' && isNumber(Number(month))) {
                                        if (month > currentMonth) {
                                            currentMonth = month;
                                        }
                                    }
                                }
                                
                                let txPayload = {};
                                
                                if (Number(document.getElementById('ClaimFdButtonText').innerText) > 0) {
                                    if (checkBox.checked) {
                                        txPayload = {
                                            from: account,
                                            to: DistributionDelegatorsAddr,
                                            data: DistributionDelegatorsContract.methods.claim(account, account, currentMonth, true).encodeABI(),
                                        };
                                    } else {
                                        txPayload = {
                                            from: account,
                                            to: DistributionDelegatorsAddr,
                                            data: DistributionDelegatorsContract.methods.claim(account, account, currentMonth, false).encodeABI(),
                                        };
                                    }
                                    
                                    const transactionParameters = txPayload;
            
                                    showSpinner(async () => {
                                        await provider.request({
                                            method: 'eth_sendTransaction',
                                            params: [transactionParameters],
                                        })
                                        .then(txHash => showConfirmationSpinner(txHash, web32))
                                        .catch((error) => showFail());
                                    });
                                    
                                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                                    
                                    showFdRewards(0);
                                    switchClaimFdButtonColorBack(DappObject.fdClaimBool);
                                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
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
                        
                        object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
                        object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                        showTokenIdentifiers(null, object.wrappedTokenIdentifier);

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
                        } catch (error) {
                            // console.log(error);
                        }
                    };

                    window.ethereum.on("accountsChanged", async (accounts) => {
                        remove(".wrap-box-ftso");
                        handleAccountsChanged(accounts, DappObject, 3);
                    });

                    window.ethereum.on("chainChanged", async () => {
                        handleChainChanged();
                    });
                });
            });
        } else if (option === 4 || option === '4') {
            // switch to Flare
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                        "chainId": "0xe"
                        }
                    ]
                    }).catch((error) => console.error(error));
            } catch (error) {
                // console.log(error);

                if (error.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    "chainId": "0xe",
                                    "rpcUrls": ["https://sbi.flr.ftsocan.com/ext/C/rpc"],
                                    "chainName": `Flare Mainnet`,
                                    "iconUrls": [
                                        `https://portal.flare.network/token-logos/FLR.svg`
                                    ],
                                    "nativeCurrency": {
                                        "name": `FLR`,
                                        "symbol": `FLR`,
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

            var handleClick;

            if (typeof stakingOption === 'undefined') {
                document.getElementById("ContinueMetamask").addEventListener("click", async () => {
                    getDappPage(8);
                });
                document.getElementById("ContinueLedger").addEventListener("click", async () => {
                    getDappPage(9);
                });
            } else if (stakingOption === 4) {
                //Metamask
                document.getElementById("ContinueAnyway").addEventListener("click", async () => {
                    DappObject.ledgerStake = false;
                    getDappPage(5);
                });
            } else if (stakingOption === 5) {
                document.getElementById("ContinueAnyway").addEventListener("click", async () => {
                    DappObject.ledgerStake = true;
                    getDappPage(5);
                });
            } else if (stakingOption === 1) {
                document.getElementById("ConnectPChain").addEventListener("click", handleClick = async () => {
                    ConnectPChainClickStake(stakingOption, DappObject, handleClick);
                });

                if (DappObject.ledgerStake === false || (Array.isArray(DappObject.ledgerAddrArray) && DappObject.ledgerAddrArray.length)) {
                    document.getElementById("ConnectPChain").click();
                }

                // We check if the input is valid, then copy it to the wrapped tokens section.
                document.querySelector("#AmountFrom").addEventListener("input", function () {
                    setTransferButton(DappObject);
                    copyWrapInput();
                });

                document.querySelector("#AmountTo").addEventListener("input", function () {
                    setTransferButton2(DappObject);
                    copyTransferInput();
                });

                document.getElementById("TransferIcon").addEventListener("click", async () => {
                    toggleTransferButton(DappObject, stakingOption);
                });

                document.getElementById("WrapButton").addEventListener("click", async () => {
                    transferTokens(DappObject, stakingOption);
                });
            } else if (stakingOption === 2) {
                document.getElementById("ConnectPChain").addEventListener("click", handleClick = async () => {
                    ConnectPChainClickStake(stakingOption, DappObject, handleClick);
                });

                if (DappObject.ledgerStake === false || (Array.isArray(DappObject.ledgerAddrArray) && DappObject.ledgerAddrArray.length)) {
                    document.getElementById("ConnectPChain").click();
                }
            }

            window.ethereum.on("accountsChanged", async (accounts) => {
                handleAccountsChanged(accounts, DappObject, 4);
            });

            window.ethereum.on("chainChanged", async () => {
                handleChainChangedStake();
            });

            // const cChain = flare.CChain();
            // const pChain = flare.PChain();
        }
    }
};