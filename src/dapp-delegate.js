import { FlareAbis, Provider as provider, GetContract, showAccountAddress, } from "./flare-utils";
import * as DappCommon from './dapp-common.js';

function __init__(object) {
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
        DappCommon.ConnectWalletClickDelegate(object.rpcUrl, object.flrAddr, DappCommon.DappObject);
    });

    document.getElementById("Amount1").addEventListener('input', function () {
        DappCommon.isDelegateInput1(DappCommon.DappObject);

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
        DappCommon.isDelegateInput2(DappCommon.DappObject);

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
        if (DappCommon.DappObject.isRealValue === false) {
            $.alert("Please enter valid value");
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
                const wrappedTokenAddr = GetContract("WNat", object.rpcUrl, object.flrAddr);
                let tokenContract = new web32.eth.Contract(DappCommon.DappObject.ercAbi, wrappedTokenAddr);
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

                if (DappCommon.DappObject.isAmount2Active) {
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

window.onload = async (event) => {
    let selectedNetwork = document.getElementById("SelectedNetwork");
    let rpcUrl;
    let chainidhex;
    let networkValue;
    let ftso1 = document.getElementById("ftso-1");
    let ftso2 = document.getElementById("ftso-2");

    await DappCommon.createSelectedNetwork(DappCommon.DappObject).then( async () => {
        DappCommon.getSelectedNetwork(rpcUrl, chainidhex, networkValue).then(async (object) => {

            __init__(object);

            document.getElementById("ConnectWallet").click();

            await DappCommon.populateFtsos(ftso1, ftso2, object.rpcUrl, object.flrAddr);

            DappCommon.isDelegateInput1(DappCommon.DappObject);

            if (DappCommon.DappObject.isAmount2Active) {
                DappCommon.isDelegateInput2(DappCommon.DappObject);
            }

            ftso1.onchange = async () => {
                let img = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-img');
                let delegatedicon = document.getElementById("delegatedIcon1");
                delegatedicon.src = img;
                DappCommon.isDelegateInput1(DappCommon.DappObject);
            }

            ftso2.onchange = async () => {
                let img = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-img');
                let delegatedicon = document.getElementById("delegatedIcon2");
                delegatedicon.src = img;
                DappCommon.isDelegateInput2(DappCommon.DappObject);
            }

            selectedNetwork.onchange = async () => {
                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                DappCommon.isDelegateInput1(DappCommon.DappObject);

                if (DappCommon.DappObject.isAmount2Active) {
                    DappCommon.isDelegateInput2(DappCommon.DappObject);
                }

                // Alert Metamask to switch.
                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{chainId: chainidhex}],
                    });
                    
                    document.getElementById("ConnectWallet").click();
                } catch (error) {
                    // console.log(error);
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
        });
    });

}