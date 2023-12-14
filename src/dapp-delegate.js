import { FlareAbis, Provider as provider, GetContract, downloadMetamask, round, showAccountAddress, showTokenBalance,} from "./flare-utils";
// dapp_claim.js
var selectedNetwork = document.getElementById("SelectedNetwork");
var flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
var chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
var networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
var ercAbi = FlareAbis.WNat;
var voterWhitelisterAbiLocal = FlareAbis.VoterWhitelister;
var ftso1 = document.getElementById("ftso-1");
var ftso2 = document.getElementById("ftso-2");
var isRealValue = false;
var amount1 = document.getElementById("Amount1");
var amount2 = document.getElementById("Amount2");
var isAmount2Active = false;

function isInput1() {
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
            isInput3();
        } else {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            isRealValue = false;
        }
    }
}

function isInput2() {
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
            isInput3();
        } else {
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = "Enter Amount";
            isRealValue = false;
            isAmount2Active = false;
        }

        document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        document.getElementById("ClaimButton").style.cursor = "pointer";
        isRealValue = true;
        isAmount2Active = true;
        document.getElementById("ClaimButtonText").innerText = "Delegate";
        isInput3();
    }
}

function isInput3() {
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

//Checking if Metamask wallet is unlocked.
async function isWalletUnlocked() {
    const Web3provider = new ethers.providers.Web3Provider(window.ethereum);

    let unlocked;

    try {
        const accounts = await Web3provider.listAccounts();

        unlocked = accounts.length > 0;
    } catch (e) {
        unlocked = false;
    }

    return unlocked;
}


// Populate select elements.
async function populateFtsos() {
    var insert = '<option value="" data-ftso="0" disabled selected hidden>Select FTSO</option>';
    let web32 = new Web3(rpcUrl);

    try {
        const voterWhitelistAddr = await GetContract("VoterWhitelister");
        let voterWhitelistContract = new web32.eth.Contract(voterWhitelisterAbiLocal, voterWhitelistAddr);

        const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();

        const ftsoJsonList = JSON.stringify(ftsoList);

        fetch('https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json')
            .then(res => res.json())
            .then(FtsoInfo => {
                for (var i = 0; i < ftsoList.length; i++) {
                    let indexNumber;

                    if (ftsoJsonList.includes(ftsoList[i])) {
                        for (var f = 0; f < FtsoInfo.providers.length; f++) {
                            if (FtsoInfo.providers[f].address === ftsoList[i]) {
                                indexNumber = f;
                                //<img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" class="delegatedIcon" id="delegatedIcon"/>

                                insert += `<option value="${i}" data-img="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${ftsoList[i]}.png" data-addr="${ftsoList[i]}" data-ftso="1">${FtsoInfo.providers[indexNumber].name}</option>`;
                                ftso1.innerHTML = insert;
                                ftso2.innerHTML = insert;
                            }
                        }
                    } else {
                        alert('The FTSO you have delegated to is invalid!');
                        break;
                    }
                }
            })
    } catch (error) {
        // console.log(error)
    }
}

populateFtsos();

ftso1.onchange = async () => {
    var img = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-img');
    var delegatedicon = document.getElementById("delegatedIcon1");
    delegatedicon.src = img;
    isInput1();
}

ftso2.onchange = async () => {
    var img = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-img');
    var delegatedicon = document.getElementById("delegatedIcon2");
    delegatedicon.src = img;
    isInput2();
}

amount1.addEventListener('input', function () {
    var str = this.value;
    var suffix = "%";

    if (str.search(suffix) === -1) {
        str += suffix;
    }

    var actualLength = str.length - suffix.length;

    if (actualLength === 0) {
        this.value = str.substring(0, actualLength)

        this.setSelectionRange(actualLength, actualLength);
    } else {
        this.value = str.substring(0, actualLength) + suffix;

        // set cursor position
        this.setSelectionRange(actualLength, actualLength);
    }
});


amount2.addEventListener('input', function () {
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

        // set cursor position
        this.setSelectionRange(actualLength, actualLength);
    }
});

// If network value is 1 or 4, FLR or C2FLR, else SGB or CFLR.
function isNetworkValue(networkValue) {
    if (networkValue === '1') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
    } else if (networkValue === '2') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
    } else {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
    }
}

isNetworkValue(networkValue);
isInput1();

if (isAmount2Active) {
    isInput2();
}

selectedNetwork.onchange = async () => {
    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
    chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
    networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

    if (networkValue === '1' || networkValue === '4') {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
        isInput1();

        if (isAmount2Active) {
            isInput2();
        }
    } else {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
        isInput1();

        if (isAmount2Active) {
            isInput2();
        }
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
            let web32 = new Web3(rpcUrl);

            try {
                const isUnlocked = isWalletUnlocked();

                if (await isUnlocked !== "false") {
                    const wrappedTokenAddr = await GetContract("WNat");

                    let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                    const accounts = await provider.request({method: 'eth_requestAccounts'});
                    const account = accounts[0];
                    showAccountAddress(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
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
        if (connectWalletBool === false) {
            connectWalletBool = true;
            let web32 = new Web3(rpcUrl);

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
        } else {
            navigator.clipboard.writeText(document.getElementById("ConnectWalletText").innerText);
            connectWalletBool = true;
            let web32 = new Web3(rpcUrl);

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
        }
    });
}

provider.on("accountsChanged", async (accounts) => {
    if (accounts.length !== 0) {
        const account = accounts[0];
        showAccountAddress(account);
    } else {
        document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
        connectWalletBool = false;
    }
});

document.querySelector("#Amount1").addEventListener("input", isInput1);
document.querySelector("#Amount2").addEventListener("input", isInput2);

if (!provider && downloadMetamaskFlag === false) {
    downloadMetamaskFlag = true;
    downloadMetamask();
} else {
    document.getElementById("ClaimButton").addEventListener("click", async () => {
        if (!isRealValue) {
            $.alert("Please enter valid value");
        } else {
            let web32 = new Web3(rpcUrl);

            web32.setProvider(provider);

            const value1 = amount1.value;
            const value2 = amount1.value;

            const percent1 = value1.replace(/[^0-9]/g, '');
            const percent2 = value2.replace(/[^0-9]/g, '');

            const bips1 = Number(percent1) * 100;
            const bips2 = Number(percent2) * 100;

            var addr1 = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-addr');
            var addr2 = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-addr');

            try {
                const wrappedTokenAddr = await GetContract("WNat");
                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                const accounts = await provider.request({method: 'eth_requestAccounts'});
                const account = accounts[0];

                const transactionParameters = {
                    from: account,
                    to: wrappedTokenAddr,
                    data: tokenContract.methods.undelegateAll().encodeABI(),
                };

                const transactionParameters2 = {
                    from: account,
                    to: wrappedTokenAddr,
                    data: tokenContract.methods.delegate(addr1, bips1).encodeABI(),
                };

                showSpinner(async () => {
                    await provider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                    .then((txHash) => showConfirm(txHash))
                    .catch((error) => showFail());
                });

                showSpinner(async () => {
                    await provider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters2],
                    })
                    .then((txHash) => showConfirm(txHash))
                    .catch((error) => showFail());
                });

                if (isAmount2Active) {
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
    })
}
