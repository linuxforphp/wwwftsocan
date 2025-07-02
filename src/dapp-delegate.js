import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";
import { showSpinner, showConfirmationSpinner, showFail, setCurrentPopup } from "./dapp-ui.js";
import { LedgerEVMSingleSign } from "./dapp-ledger.js";

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

        if (delegatedBips === 0 && (Number(amount1.value.replace(/[^0-9]/g, '')) === 50 || Number(amount1.value.replace(/[^0-9]/g, '')) === 100)) {
            claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
            claimButton.style.cursor = "pointer";
            DappObject.isRealValue = true;
            document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_delegate'];
        } else if (delegatedBips === 50 && Number(amount1.value.replace(/[^0-9]/g, '')) === 50) {
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
    }
}

// Populate select elements.
export async function populateFtsos(rpcUrl, flrAddr) {
    return new Promise(async (resolve) => {
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
        let amount1 = document.getElementById("Amount1");
        let ftso1 = document.querySelector(".selectize-input");

        let web32 = new Web3(object.rpcUrl);

        const value1 = amount1.value;

        const percent1 = value1.replace(/[^0-9]/g, '');

        const bips1 = Number(percent1) * 100;

        var addr1 = ftso1.childNodes[0].childNodes[0].getAttribute('data-addr');

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