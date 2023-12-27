import { FlareAbis, Provider as provider, FlareLogos, GetContract, round, showAccountAddress, showBalance, showTokenBalance, isNumber } from "./flare-utils";
import * as DappCommon from './dapp-common.js';
// dapp_wrap.js

function __init__(object) {
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
        DappCommon.ConnectWalletClickWrap(object.rpcUrl, object.flrAddr, DappCommon.DappObject);
    });

    // We check if the input is valid, then copy it to the wrapped tokens section.
    document.querySelector("#AmountFrom").addEventListener("input", function () {
        DappCommon.setWrapButton(DappCommon.DappObject);
        DappCommon.copyWrapInput();
    });

    document.getElementById("wrapUnwrap").addEventListener("click", async () => {
        DappCommon.toggleWrapButton(DappCommon.DappObject, object.tokenIdentifier, object.wrappedTokenIdentifier, object.rpcUrl, object.flrAddr);
    });

    // If the input is valid, we wrap on click of "WrapButton".
    document.getElementById("WrapButton").addEventListener("click", async () => {
        if (DappCommon.DappObject.isRealValue === false) {
            $.alert("Please enter valid value");
        } else {
            let web32 = new Web3(object.rpcUrl);

            try {
                var wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                var tokenContract = new web32.eth.Contract(DappCommon.DappObject.ercAbi, wrappedTokenAddr);
                var accounts = await provider.request({method: 'eth_accounts'});
                var account = accounts[0];
                var balance = await web32.eth.getBalance(account);
                var tokenBalance = await tokenContract.methods.balanceOf(account).call();
                var amountFromValue = Number(document.getElementById("AmountFrom").value.replace(/[^0-9]/g, ''));
                var amountFromValueWei = String(Number(web32.utils.toWei(amountFromValue, "ether")));

                console.log(amountFromValue);
                console.log(amountFromValueWei);

                if (DappCommon.DappObject.wrapBool === true && amountFromValue >= Number(web32.utils.fromWei(balance, "ether"))) {
                    $.alert("Insufficient Balance!");
                } else if (DappCommon.DappObject.wrapBool === false && amountFromValue >= Number(web32.utils.fromWei(tokenBalance, "ether"))) {
                    $.alert("Insufficient Balance!");
                } else {
                    if (DappCommon.DappObject.wrapBool === true) {
                        var transactionParameters = {
                            to: wrappedTokenAddr,
                            from: account,
                            data: tokenContract.methods.deposit(amountFromValueWei).encodeABI(),
                            value: amountFromValueWei
                        };
                    } else {
                        var transactionParameters = {
                            to: wrappedTokenAddr,
                            from: account,
                            data: tokenContract.methods.withdraw(amountFromValueWei).encodeABI(),
                            value: amountFromValueWei
                        };
                    }

                    showSpinner(async () => {
                        await provider.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters],
                        })
                        .then((txHash) => web32.eth.getTransactionReceipt(txHash)
                        .then((receipt) => async (receipt) => {
                            const accounts = await provider.request({method: 'eth_accounts'});
    
                            balance = await web32.eth.getBalance(accounts[0]);
                            tokenBalance = await tokenContract.methods.balanceOf(accounts[0]).call();
    
                            if (DappCommon.DappObject.wrapBool) {
                                showBalance(round(web32.utils.fromWei(balance, "ether")));
                                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                            } else {
                                showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                                showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
                            }
    
                            let confirm = receipt.status ? true : false;
    
                            if (confirm === false) {
                                throw new Error('Transaction was reverted.');
                            } else {
                                document.getElementById("ConnectWallet").click();
                                showConfirm(receipt.transactionHash);
                            }
                        }))
                        .catch((error) => showFail());
                    });
                }
            } catch (error) {
                console.log(error);
                showFail();
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
    var wrapUnwrapButton = document.getElementById("wrapUnwrap");
    var fromIcon = document.getElementById("FromIcon");
    var toIcon = document.getElementById("ToIcon");
    document.getElementById("layer2").innerHTML = DappCommon.DappObject.flrLogo;
    document.getElementById("layer3").innerHTML = DappCommon.DappObject.flrLogo;

    await DappCommon.createSelectedNetwork(DappCommon.DappObject).then( async () => {
        DappCommon.getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

            __init__(object);

            document.getElementById("ConnectWallet").click();

            // When the Connect Wallet button is clicked, we connect the wallet, and if it
            // has already been clicked, we copy the public address to the clipboard.
            if (object.networkValue === '1') {
                document.getElementById("layer2").innerHTML = DappCommon.DappObject.flrLogo;
                document.getElementById("layer3").innerHTML = DappCommon.DappObject.flrLogo;
            } else if (object.networkValue === '2') {
                document.getElementById("layer2").innerHTML = DappCommon.DappObject.sgbLogo;
                document.getElementById("layer3").innerHTML = DappCommon.DappObject.sgbLogo;
            } else {
                document.getElementById("layer2").innerHTML = DappCommon.DappObject.costonLogo;
                document.getElementById("layer3").innerHTML = DappCommon.DappObject.costonLogo;
            }

            object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
            object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
            DappCommon.showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
            DappCommon.setWrapButton(DappCommon.DappObject);

            //When Selected Network Changes, alert Metamask
            selectedNetwork.onchange = async () => {
                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
                object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
                object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

                if (object.networkValue === '1') {
                    document.getElementById("layer2").innerHTML = DappCommon.DappObject.flrLogo;
                    document.getElementById("layer3").innerHTML = DappCommon.DappObject.flrLogo;
                } else if (object.networkValue === '2') {
                    document.getElementById("layer2").innerHTML = DappCommon.DappObject.sgbLogo;
                    document.getElementById("layer3").innerHTML = DappCommon.DappObject.sgbLogo;
                } else {
                    document.getElementById("layer2").innerHTML = DappCommon.DappObject.costonLogo;
                    document.getElementById("layer3").innerHTML = DappCommon.DappObject.costonLogo;
                }

                object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
                object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                DappCommon.showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
                wrapUnwrapButton.value = "false";
                fromIcon.style.color = "#fd000f";
                toIcon.style.color = "#000";
                document.getElementById("Wrap").style.color = "#fd000f";
                document.getElementById("Unwrap").style.color = "#383a3b";
                DappCommon.DappObject.wrapBool = true;

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
                
                DappCommon.setWrapButton(DappCommon.DappObject);
            }

            if (typeof accounts !== 'undefined' && accounts !== []) {
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
            }

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

    DappCommon.updateCall();
}
