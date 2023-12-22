import { FlareAbis, Provider as provider, FlareLogos, GetContract, downloadMetamask, round, showAccountAddress, showBalance, showTokenBalance, isNumber } from "./flare-utils";

var selectedNetwork = document.getElementById("SelectedNetwork");
var flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
var rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
var chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
var networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;

// dapp_wrap.js
var selectedNetwork = document.getElementById("SelectedNetwork");
var flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
var chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
var networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
var costonLogo = FlareLogos.costonLogo;
var flrLogo = FlareLogos.flrLogo;
var sgbLogo = FlareLogos.sgbLogo;
var ercAbi = FlareAbis.WNat;
var wrapUnwrapButton = document.getElementById("wrapUnwrap");
var amountFrom = document.getElementById("AmountFrom");
var amountTo = document.getElementById("AmountTo");
var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
var wrappedTokenIdentifier = "W" + tokenIdentifier;
var wrapBool = true;
var isRealValue = false;
var fromIcon = document.getElementById("FromIcon");
var toIcon = document.getElementById("ToIcon");
document.getElementById("layer2").innerHTML = flrLogo;
document.getElementById("layer3").innerHTML = flrLogo;

// show the current token identifiers
function showTokenIdentifiers(token, wrappedToken) {
    document.getElementById("tokenIdentifier").innerText = token;
    document.getElementById("wrappedTokenIdentifier").innerText = wrappedToken;
}

async function switchIconColor() {
    // Switching wrap/unwrap.
    if (wrapUnwrapButton.value === "false") {
        wrapBool = false;
        wrapUnwrapButton.value = "true";
        fromIcon.style.color = "#000";
        toIcon.style.color = "#fd000f";
        document.getElementById("Wrap").style.color = "#383a3b";
        document.getElementById("Unwrap").style.color = "#fd000f";
        showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
        isInput();
    } else {
        wrapBool = true;
        wrapUnwrapButton.value = "false";
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
}

wrapUnwrapButton.addEventListener("click", async () => {
    switchIconColor();
});

// is a valid input?
function isInput() {
    if (Number(amountFrom.value.replace(/[^0-9]/g, '')) < 1) {
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


// copy an input
function copyInput() {
    if (isNumber(amountFrom.value)) {
        amountTo.value = amountFrom.value;
    } else {
        amountTo.value = "";
    }
}

// If network value is 1 or 4, FLR or C2FLR, else SGB or CFLR.
function isNetworkValue(networkValue) {
    if (networkValue === '1') {
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        document.getElementById("layer2").innerHTML = flrLogo;
        document.getElementById("layer3").innerHTML = flrLogo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    } else if (networkValue === '2') {
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        document.getElementById("layer2").innerHTML = sgbLogo;
        document.getElementById("layer3").innerHTML = sgbLogo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    } else {
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        document.getElementById("layer2").innerHTML = costonLogo;
        document.getElementById("layer3").innerHTML = costonLogo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    }
}

isNetworkValue(networkValue);
showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
isInput();

//When Selected Network Changes, alert Metamask
selectedNetwork.onchange = async () => {
    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
    chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
    networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

    if (networkValue === '1') {
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        document.getElementById("layer2").innerHTML = flrLogo;
        document.getElementById("layer3").innerHTML = flrLogo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        wrapUnwrapButton.value = "false";
        fromIcon.style.color = "#fd000f";
        toIcon.style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        wrapBool = true;
        isInput();
    } else if (networkValue === '2') {
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        document.getElementById("layer2").innerHTML = sgbLogo;
        document.getElementById("layer3").innerHTML = sgbLogo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        wrapUnwrapButton.value = "false";
        fromIcon.style.color = "#fd000f";
        toIcon.style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        wrapBool = true;
        isInput();
    } else {
        tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
        wrappedTokenIdentifier = "W" + tokenIdentifier;
        document.getElementById("layer2").innerHTML = costonLogo;
        document.getElementById("layer3").innerHTML = costonLogo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        wrapUnwrapButton.value = "false";
        fromIcon.style.color = "#fd000f";
        toIcon.style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        wrapBool = true;
        isInput();
    }

    //Alert Metamask to switch
    if (!provider && downloadMetamaskFlag === false) {
        downloadMetamaskFlag = true;
        downloadMetamask();
    } else {
        let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{chainId: chainidhex}],
            })
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

    //If we have already logged in the account, show new results, else do nothing.
    if (connectWalletBool === true) {
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

// When the Connect Wallet button is clicked, we connect the wallet (duh), and if it
// has already been clicked, we copy the public address to the clipboard.

if (!provider && downloadMetamaskFlag === false) {
    downloadMetamaskFlag = true;
    downloadMetamask();
} else {
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
        if (connectWalletBool === false) {
            connectWalletBool = true;
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
        } else {
            navigator.clipboard.writeText(document.getElementById("ConnectWalletText").innerText);
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
    });
}

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

// We check if the input is valid, then copy it to the wrapped tokens section.
document.querySelector("#AmountFrom").addEventListener("input", isInput);
document.querySelector("#AmountFrom").addEventListener("input", copyInput);

// If the input is valid, we wrap on click of "WrapButton"
if (!provider && downloadMetamaskFlag === false) {
    downloadMetamaskFlag = true;
    downloadMetamask();
} else {
    document.getElementById("WrapButton").addEventListener("click", async () => {
        if (!isRealValue) {
            $.alert("Please enter valid value");
        } else {

            let web32 = new Web3(selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl'));

            if (wrapBool) {
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
