import { FlareAbis, Provider as provider, FlareLogos, GetContract, round, showAccountAddress, showBalance, showTokenBalance, isNumber } from "./flare-utils";
import * as DappCommon from './dapp-common.js';
import { ethers } from './ethers.js';

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
            var web32 = new Web3(object.rpcUrl);

            try {
                const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                let tokenContract = new web32.eth.Contract(DappCommon.DappObject.ercAbi, wrappedTokenAddr);
                const accounts = await provider.request({method: 'eth_accounts'});
                const account = accounts[0];
                let balance = await web32.eth.getBalance(account);
                let tokenBalance = await tokenContract.methods.balanceOf(account).call();
                var amountFrom = document.getElementById("AmountFrom");
                const amountFromValue = Number(amountFrom.value.replace(/[^0-9]/g, ''));
                const amountFromValueWei = String(Number(web32.utils.toWei(amountFromValue, "ether")));
                const amountFromValueWeiHex = Number(web32.utils.toWei(amountFromValue, "ether")).toString(16);
                let txPayload = {};
                
                if (DappCommon.DappObject.wrapBool === true) {
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

                if (DappCommon.DappObject.wrapBool === true && amountFromValue >= Number(web32.utils.fromWei(balance, "ether"))) {
                    $.alert("Insufficient Balance!");
                } else if (DappCommon.DappObject.wrapBool === false && amountFromValue >= Number(web32.utils.fromWei(tokenBalance, "ether"))) {
                    $.alert("Insufficient Balance!");
                } else {
                    showSpinner(async () => {
                        await provider.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters],
                        })
                        .then((txHash) => showConfirm(txHash))
                        .catch((error) => console.log(error));
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

            DappCommon.showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);

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

    DappCommon.updateCall();
}
