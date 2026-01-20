import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";
import { showSpinner, showConfirmationSpinner, showFail, setCurrentPopup, setMabelMessages } from "./dapp-ui.js";
import { LedgerEVMSingleSign } from "./dapp-ledger.js";
import { getDelegatedProviders } from "./dapp-claim.js";
import { createSelectedNetwork, getSelectedNetwork } from "./dapp-common.js";
import { ConnectWalletClick, handleAccountsChanged, handleChainChanged } from "./dapp-wallet.js";

export async function setupDelegatePage(DappObject, handleClick, option) {
    document.getElementById("wrapTab")?.classList.remove("selected");
    document.getElementById("delegateTab")?.classList.add("selected");
    document.getElementById("rewardsTab")?.classList.remove("selected");
    document.getElementById("stakeTab")?.classList.remove("selected");

    let selectedNetwork = document.getElementById("SelectedNetwork");
    let rpcUrl;
    let chainidhex;
    let networkValue;

    await createSelectedNetwork(DappObject).then( async () => {
        getSelectedNetwork(rpcUrl, chainidhex, networkValue).then(async (object) => {

            document.getElementById("ConnectWallet")?.addEventListener("click", handleClick = async () => {
                ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, (option - 1), handleClick);
            });
        
            document.getElementById("Amount1")?.addEventListener('input', async function () {
                await isDelegateInput1(DappObject);
        
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
        
            document.getElementById("ClaimButton")?.addEventListener("click", async () => {
                let web32 = new Web3(object.rpcUrl);

                DappObject.isHandlingOperation = true;
        
                try {
                    const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                    let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                    const account = DappObject.selectedAddress;
        
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
        
                        if (delegatedFtsos.length === 2 || delegatedBips === 100 || document.getElementById("ClaimButton").innerText === dappStrings['dapp_undelegate']) {
                            showAlreadyDelegated(ftsoNames, object, DappObject);
                        } else {
                            delegate(object, DappObject);
                        }

                        DappObject.isHandlingOperation = false;
                    });
                } catch(error) {
                    DappObject.isHandlingOperation = false;

                    // console.log(error);
                }
            });

            if (DappObject.ledgerSelectedIndex !== "") {
                ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 1, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
            } else {
                document.getElementById("ConnectWallet")?.click();
            }

            await isDelegateInput1(DappObject);

            if (window.cachedValues.delegateDropdown !== undefined) {
                window.cachedValues.delegateDropdown.clear();
            }

            selectedNetwork.onchange = async () => {
                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                DappObject.selectedNetworkIndex = Number(object.networkValue);

                clearTimeout(DappObject.latestPopupTimeoutId);

                // Alert Metamask to switch.
                try {
                    if (DappObject.walletIndex !== 1) {
                        const realChainId = await DappObject.chosenEVMProvider.request({method: 'eth_chainId'});

                        if (realChainId != object.chainIdHex) {
                            await DappObject.chosenEVMProvider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        "chainId": object.chainIdHex,
                                        "rpcUrls": [selectedNetwork.options[selectedNetwork.selectedIndex].getAttribute('data-publicrpcurl')],
                                        "chainName": selectedNetwork.options[selectedNetwork.selectedIndex].getAttribute('data-chainname'),
                                        "iconUrls": [
                                            `https://portal.flare.network/token-logos/${selectedNetwork.options[selectedNetwork.selectedIndex].innerText}.svg`
                                        ],
                                        "nativeCurrency": {
                                            "name": `${selectedNetwork.options[selectedNetwork.selectedIndex].innerText}`,
                                            "symbol": `${selectedNetwork.options[selectedNetwork.selectedIndex].innerText}`,
                                            "decimals": 18
                                        }
                                    },
                                ],
                            });

                            await DappObject.chosenEVMProvider.request({
                                method: "wallet_switchEthereumChain",
                                params: [
                                    {
                                    "chainId": object.chainIdHex
                                    }
                                ]
                                }).catch(async (error) => {
                                    throw(error);
                                });
                        }                    
                    }

                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 1, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                } catch (error) {
                    // console.log(error);
                }
            };

            if (DappObject.walletIndex !== 1) {
                DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                    handleAccountsChanged(accounts, DappObject, dappOption, undefined, object.rpcUrl, object.flrAddr);
                });

                DappObject.chosenEVMProvider.on("chainChanged", async () => {
                    handleChainChanged(DappObject);
                });

                if (DappObject.walletIndex === 2) {
                    DappObject.chosenEVMProvider.on("disconnect", async () => {
                        getDappPage("Wallet");
                    });
                }
            }

            await populateFtsos(object.rpcUrl, object.flrAddr);
        });
    });
}

export async function ConnectWalletDelegate(account, prefixedPchainAddress, rpcUrl, flrAddr, web32, DappObject) {
    await setMabelMessages(dappStrings['dapp_mabel_delegate1'], dappStrings['dapp_mabel_delegate2'], 15000);
    
    let delegatedIcon1 = document.getElementById("delegatedIcon1");
    delegatedIcon1.src = dappUrlBaseAddr + 'img/FLR.svg';

    if (window.cachedValues.delegateDropdown !== undefined) {
        window.cachedValues.delegateDropdown.clear();
    }

    await isDelegateInput1(DappObject);

    try {
        showAccountAddress(account, prefixedPchainAddress);
        await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);
    } catch (error) {
        throw error;
    }
}

export function getDelegatedBips() {
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

export async function isDelegateInput1(DappObject) {
    let delegatedBips = getDelegatedBips();

    let claimButton = document.getElementById("ClaimButton");

    let wrapbox1 = document.getElementById('wrapbox-1');

    if (delegatedBips === 100) {
        if (typeof wrapbox1 !== 'undefined' && wrapbox1 !== null) {
            wrapbox1.style.display = "none";
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_undelegate'];
        }

        await setCurrentPopup(dappStrings['dapp_mabel_delegate_error1'], true);
    } else {
        if (typeof wrapbox1 !== 'undefined' && wrapbox1 !== null) {
            wrapbox1.removeAttribute('style');
        }

        let amount1 = document.getElementById("Amount1");

        let ftso1 = document.querySelector(".selectize-input");
        let addr;
        
        addr = ftso1?.childNodes[0]?.childNodes[0]?.getAttribute('data-addr');

        if (addr !== undefined) {
            if (delegatedBips === 0 && (Number(amount1.value.replace(/[^0-9]/g, '')) === 50 || Number(amount1.value.replace(/[^0-9]/g, '')) === 100)) {
                claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
                claimButton.style.cursor = "pointer";
                DappObject.isRealValue = true;
                document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_delegate'];
            } else if (delegatedBips === 50 && (Number(amount1.value.replace(/[^0-9]/g, '')) === 50 
                || (Number(amount1.value.replace(/[^0-9]/g, '')) === 100 && addr.toLowerCase() === document.querySelector(".address-claim").innerText.toLowerCase()))) {
                claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
                claimButton.style.cursor = "pointer";
                DappObject.isRealValue = true;
                document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_delegate'];
            } else {
                claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
                claimButton.style.cursor = "auto";
                document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_enteramount'];
                DappObject.isRealValue = false;
            }
        } else {
            claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            claimButton.style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_enteramount'];
            DappObject.isRealValue = false;
        }
    }
}

// Populate select elements.
export async function populateFtsos(rpcUrl, flrAddr) {
    return new Promise(async (resolve) => {
            if (window.cachedValues.delegateDropdown !== undefined) {
                window.cachedValues.delegateDropdown.clear();
            }

            var insert = [];
            let web32 = new Web3(rpcUrl);
            let selectedNetwork = document.getElementById('SelectedNetwork');
            let chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');

            var onInputChange = async (value) => {
                let ftso1 = document.querySelector(".selectize-input");

                let img;
                img = ftso1?.childNodes[0]?.childNodes[0]?.getAttribute('data-img');

                if (img !== undefined) {
                    let delegatedicon = document.getElementById("delegatedIcon1");
                    delegatedicon.src = img;
                }

                await isDelegateInput1(DappObject);
            }

            var $select = $('#select-ftso').selectize({
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: ["title", "nodeid"],
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

            try {
                const voterWhitelistAddr = await GetContract("VoterWhitelister", rpcUrl, flrAddr);
                let voterWhitelistContract = new web32.eth.Contract(DappObject.voterWhitelisterAbi, voterWhitelistAddr);

                const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders("0").call();

                const ftsoJsonList = JSON.stringify(ftsoList);

                // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json
                fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
                    .then(res => res.json())
                    .then(async FtsoInfo => {
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
                                            await setCurrentPopup(dappStrings['dapp_mabel_delegate_error2'], true);
                                            break;
                                        }
                                    }
                                }
                            }
                        }

                    var control = $select[0].selectize;

                    control.clearOptions();

                    for (var z = 0; z < insert.length; z++) {
                        control.addOption({
                            id: insert[z].id,
                            title: insert[z].title,
                            nodeid: insert[z].nodeid,
                            img: insert[z].img
                        });
                    }

                    window.cachedValues.delegateDropdown = control;
                });
            } catch (error) {
                // console.log(error)
            }

            resolve();
    })
}

export async function delegate(object, DappObject) {
    if (DappObject.isRealValue === false) {
        await setCurrentPopup(dappStrings['dapp_mabel_delegate_error3'], true);
    } else {
        let delegatedBips = getDelegatedBips();

        let amount1 = document.getElementById("Amount1");
        let ftso1 = document.querySelector(".selectize-input");

        var addr1 = ftso1.childNodes[0].childNodes[0].getAttribute('data-addr');

        let delegatedAddr;

        let web32 = new Web3(object.rpcUrl);

        const value1 = amount1.value;

        let percent1 = value1.replace(/[^0-9]/g, '');

        if (delegatedBips === 50) {
            delegatedAddr = document.querySelector(".address-claim").innerText.toLowerCase();

            if (addr1.toLowerCase() === delegatedAddr.toLowerCase()) {
                percent1 = 100;
            }
        }

        const bips1 = Number(percent1) * 100;

        try {
            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
            let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
            const account = DappObject.selectedAddress;

            const transactionParameters2 = {
                from: account,
                to: wrappedTokenAddr,
                data: tokenContract.methods.delegate(addr1, bips1).encodeABI(),
            };

            if (DappObject.walletIndex === 1) {
                await LedgerEVMSingleSign(transactionParameters2, DappObject, undefined, false, object, 1);
            } else {
                showSpinner(async () => {
                    await DappObject.chosenEVMProvider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters2],
                    })
                    .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 1))
                    .catch((error) => showFail(object, DappObject, 1));
                });
            }

            await isDelegateInput1(DappObject);
        } catch (error) {
            // console.log(error);
        }
    }
}

export async function undelegate(object, DappObject) {
    let web32 = new Web3(object.rpcUrl);

    try {
        const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const account = DappObject.selectedAddress;

        const transactionParameters = {
            from: account,
            to: wrappedTokenAddr,
            data: tokenContract.methods.undelegateAll().encodeABI(),
        };

        if (DappObject.walletIndex === 1) {
            await LedgerEVMSingleSign(transactionParameters, DappObject, undefined, false, object, 1);
        } else {
            showSpinner(async () => {
                await DappObject.chosenEVMProvider.request({
                    method: 'eth_sendTransaction',
                    params: [transactionParameters],
                })
                .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 1))
                .catch((error) => showFail(object, DappObject, 1));
            });
        }
    } catch(error) {
        // console.log(error);
    }
}