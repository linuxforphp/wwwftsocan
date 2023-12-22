import { FlareAbis, Provider as provider, FlareLogos, GetContract, round, showAccountAddress, showBalance, showTokenBalance, isNumber } from "./flare-utils";
import * as DappCommon from './dapp-common.js';
// dapp_wrap.js
var selectedNetwork;
var chainidhex;
var rpcUrl;
var networkValue;
var tokenIdentifier;
var wrappedTokenIdentifier;
var costonLogo = FlareLogos.costonLogo;
var flrLogo = FlareLogos.flrLogo;
var sgbLogo = FlareLogos.sgbLogo;
var ercAbi = FlareAbis.WNat;
var wrapBool = true;
var isRealValue = false;

window.onload = (event) => {
    var wrapUnwrapButton = document.getElementById("wrapUnwrap");
    var amountFrom = document.getElementById("AmountFrom");
    var amountTo = document.getElementById("AmountTo");
    var fromIcon = document.getElementById("FromIcon");
    var toIcon = document.getElementById("ToIcon");
    document.getElementById("layer2").innerHTML = flrLogo;
    document.getElementById("layer3").innerHTML = flrLogo;
    DappCommon.getSelectedNetwork(selectedNetwork, rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier);

    // When the Connect Wallet button is clicked, we connect the wallet, and if it
    // has already been clicked, we copy the public address to the clipboard.
    if (networkValue === '1') {
        document.getElementById("layer2").innerHTML = flrLogo;
        document.getElementById("layer3").innerHTML = flrLogo;
    } else if (networkValue === '2') {
        document.getElementById("layer2").innerHTML = sgbLogo;
        document.getElementById("layer3").innerHTML = sgbLogo;
    } else {
        document.getElementById("layer2").innerHTML = costonLogo;
        document.getElementById("layer3").innerHTML = costonLogo;
    }

    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
    tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
    wrappedTokenIdentifier = "W" + tokenIdentifier;
    DappCommon.showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    DappCommon.isWrapInput();
    // We check if the input is valid, then copy it to the wrapped tokens section.
    document.querySelector("#AmountFrom").addEventListener("input", isInput);
    document.querySelector("#AmountFrom").addEventListener("input", copyInput);

    wrapUnwrapButton.addEventListener("click", async () => {
        toggleWrapButton(wrapUnwrapButton.value);
    });

    if (metamaskInstalled === true) {
        document.getElementById("ConnectWallet").addEventListener("click", DappCommon.ConnectWalletClickWrap);
    }

    //When Selected Network Changes, alert Metamask
    selectedNetwork.onchange = async () => {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
        networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

        if (networkValue === '1') {
            document.getElementById("layer2").innerHTML = flrLogo;
            document.getElementById("layer3").innerHTML = flrLogo;
        } else if (networkValue === '2') {
            document.getElementById("layer2").innerHTML = sgbLogo;
            document.getElementById("layer3").innerHTML = sgbLogo;
        } else {
            document.getElementById("layer2").innerHTML = costonLogo;
            document.getElementById("layer3").innerHTML = costonLogo;
        }

        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        DappCommon.showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        wrapUnwrapButton.value = "false";
        fromIcon.style.color = "#fd000f";
        toIcon.style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        wrapBool = true;
        DappCommon.isWrapInput();

        //Alert Metamask to switch
        if (metamaskInstalled === true) {
            let web32 = new Web3(rpcUrl);

            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: chainidhex}],
                });

                const isUnlocked = DappCommon.isWalletConnected(provider);

                if (await isUnlocked !== "false") {
                    document.getElementById("ConnectWallet").click();
                } else {
                    $.alert("You are not connected!");
                }
            } catch (error) {
                // console.log(error);
            }
        }

        //If we have already logged in the account, show new results, else do nothing.
        if (connectWalletBool === true) {
            if (metamaskInstalled === true) {

                try {
                    const isUnlocked = isWalletConnected(provider);
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
                    var contractName = "WNat"
                    const wrappedTokenAddr = await GetContract(contractName);
                    let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
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
                    // console.log(error)
                }
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

    // If the input is valid, we wrap on click of "WrapButton".
    if (metamaskInstalled === true) {
        document.getElementById("WrapButton").addEventListener("click", async () => {
            if (!isRealValue) {
                $.alert("Please enter valid value");
            } else {

                let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

                if (wrapBool === true) {
                    try {
                        var contractName = "WNat"
                        const wrappedTokenAddr = await GetContract(contractName);
                        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                        const accounts = await provider.request({method: 'eth_requestAccounts'});
                        const account = accounts[0];
                        let balance = await web32.eth.getBalance(account);
                        let tokenBalance = await tokenContract.methods.balanceOf(account).call();
                        const amountFromValue = Number(amountFrom.value.replace(/[^0-9]/g, ''))
                        const amountFromValueWei = Number(web32.utils.toWei(amountFromValue, "ether")).toString(16)

                        if (amountFromValue >= Number(web32.utils.fromWei(balance, "ether"))) {
                            $.alert("Insufficient Balance!");
                        } else {
                            const transactionParameters = {
                                from: account,
                                to: wrappedTokenAddr,
                                data: tokenContract.methods.deposit(amountFromValueWei).encodeABI(),
                                value: amountFromValueWei
                            };

                            showSpinner(async () => {
                                await provider.request({
                                    method: 'eth_sendTransaction',
                                    params: [transactionParameters],
                                })
                                .then((txHash) => showConfirm(txHash))
                                .catch((error) => showFail());
                            });

                            balance = await web32.eth.getBalance(account);
                            tokenBalance = await tokenContract.methods.balanceOf(account).call();

                            if (wrapBool) {
                                showBalance(round(web32.utils.fromWei(balance, "ether")));
                                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                            } else {
                                showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                                showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
                            }
                        }
                    } catch (error) {
                        showFail();
                    }
                } else {
                    try {
                        var contractName = "WNat"
                        const wrappedTokenAddr = await GetContract(contractName);
                        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                        const accounts = await provider.request({method: 'eth_requestAccounts'});
                        const account = accounts[0];
                        let balance = await web32.eth.getBalance(account);
                        let tokenBalance = await tokenContract.methods.balanceOf(account).call();
                        const amountFromValue = Number(amountFrom.value.replace(/[^0-9]/g, ''));
                        const amountFromValueWei = Number(web32.utils.toWei(amountFromValue, "ether")).toString(16);

                        if (amountFromValue >= Number(web32.utils.fromWei(tokenBalance, "ether"))) {
                            $.alert("Insufficient Balance!");
                        } else {
                            const transactionParameters = {
                                from: account,
                                to: wrappedTokenAddr,
                                data: tokenContract.methods.receive(amountFromValueWei).encodeABI(),
                                value: amountFromValueWei,
                            };

                            showSpinner(async () => {
                                await provider.request({
                                    method: 'eth_sendTransaction',
                                    params: [transactionParameters],
                                })
                                .then((txHash) => async () => {
                                    showConfirm(txHash);
                                    balance = await web32.eth.getBalance(account);
                                    tokenBalance = await tokenContract.methods.balanceOf(account).call();

                                    if (wrapBool) {
                                        showBalance(round(web32.utils.fromWei(balance, "ether")));
                                        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                                    } else {
                                        showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                                        showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
                                    }
                                })
                                .catch((error) => showFail());
                            });
                        }
                    } catch (error) {
                        showFail();
                    }
                }
            }
        });
    }
}
