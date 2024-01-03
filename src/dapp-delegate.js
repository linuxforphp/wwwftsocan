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
        let web32 = new Web3(object.rpcUrl);

        try {
            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
            let tokenContract = new web32.eth.Contract(DappCommon.DappObject.ercAbi, wrappedTokenAddr);
            const account = await DappCommon.getAccount('GET');

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
                    DappCommon.showAlreadyDelegated(ftsoNames, object);
                } else {
                    DappCommon.delegate(object);
                }
            });
        } catch(error) {
            //console.log(error);
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

}