import { FlareAbis, Provider as provider, GetContract, showAccountAddress, } from "./flare-utils";
import * as DappCommon from './dapp-common.js';

// dapp_delegate.js
var ercAbi = FlareAbis.WNat;
var voterWhitelisterAbiLocal = FlareAbis.VoterWhitelister;
var isRealValue = false;
var isAmount2Active = false;
var metamaskInstalled;

window.onload = async (event) => {
    var selectedNetwork;
    var rpcUrl;
    var chainidhex;
    var networkValue;
    var amount1 = document.getElementById("Amount1");
    var amount2 = document.getElementById("Amount2");
    var ftso1 = document.getElementById("ftso-1");
    var ftso2 = document.getElementById("ftso-2");

    DappCommon.populateFtsos(ftso1, ftso2);

    // When the Connect Wallet button is clicked, we connect the wallet, and if it
    // has already been clicked, we copy the public address to the clipboard.
    if (metamaskInstalled === true) {
        document.getElementById("ConnectWallet").addEventListener("click", DappCommon.ConnectWalletClickDelegate(rpcUrl));
    }

    await DappCommon.createSelectedNetwork(metamaskInstalled).then(DappCommon.getSelectedNetwork(selectedNetwork, rpcUrl, chainidhex, networkValue));

    ftso1.onchange = async () => {
        var img = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-img');
        var delegatedicon = document.getElementById("delegatedIcon1");
        delegatedicon.src = img;
        DappCommon.isDelegateInput1(isRealValue, isAmount2Active);
    }

    ftso2.onchange = async () => {
        var img = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-img');
        var delegatedicon = document.getElementById("delegatedIcon2");
        delegatedicon.src = img;
        DappCommon.isDelegateInput2(isRealValue, isAmount2Active);
    }

    amount1.addEventListener('input', function () {
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

            // Set cursor position.
            this.setSelectionRange(actualLength, actualLength);
        }
    });

    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');

    DappCommon.isDelegateInput2(isRealValue, isAmount2Active);

    if (isAmount2Active) {
        DappCommon.isDelegateInput2(isRealValue, isAmount2Active);
    }

    selectedNetwork.onchange = async () => {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
        chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
        networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

        DappCommon.isDelegateInput1(isRealValue, isAmount2Active);

        if (isAmount2Active) {
            DappCommon.isDelegateInput2(isRealValue, isAmount2Active);
        }

        // Alert Metamask to switch.
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
    };

    if (typeof accounts !== 'undefined' && accounts !== []) {
        window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts.length !== 0) {
                const account = accounts[0];
                showAccountAddress(account);
            } else {
                document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
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

    document.querySelector("#Amount1").addEventListener("input", DappCommon.isDelegateInput1(isRealValue, isAmount2Active));
    document.querySelector("#Amount2").addEventListener("input", DappCommon.isDelegateInput2(isRealValue, isAmount2Active));

    if (metamaskInstalled === true) {
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
                    const wrappedTokenAddr = GetContract("WNat", rpcUrl);
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
        });
    }    
}