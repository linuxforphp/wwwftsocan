import { GetNetworkName } from "./flare-utils";
import { ethers } from "./ethers.js";
import { wait, checkTx, checkTxStake } from "./dapp-utils.js";
import { showSpinner, showConfirmationSpinnerv2, showConfirmationSpinnerStake, showConfirm, showFail, showFailStake, setCurrentAppState, setCurrentPopup, setMabelMessages } from "./dapp-ui.js";
import { ConnectWalletClick, handleAccountsChanged } from "./dapp-wallet.js";
import { ConnectWalletClickFassets, FAssetInfo } from "./dapp-fassets.js";

export async function setupTransportConnect(dappOption, dappStakingOption, DappObject) {
    if (("usb" in navigator) && !("hid" in navigator) || ("usb" in navigator) && ("hid" in navigator)) {
        window.chosenNavigator = navigator.usb;
    } else if (("hid" in navigator) && !("usb" in navigator)) {
        window.chosenNavigator = navigator.hid;
    }

    if (("usb" in navigator) || ("hid" in navigator)) {
        // USB Connect Event

        chosenNavigator?.addEventListener('connect', async event => {
            // console.log("Connected!");
            if ((dappOption === 4 && typeof dappStakingOption === 'undefined') || (dappOption === 4 && dappStakingOption === 4) || DappObject.isHandlingOperation === true) {
                
            } else {
                await handleTransportConnect(chosenNavigator, DappObject, dappOption, dappStakingOption);
            }
        });

        // USB Disconnect Event
            
        chosenNavigator?.addEventListener('disconnect', async event => {
            // console.log("Disconnected!");
            if ((dappOption === 4 && typeof dappStakingOption === 'undefined') || (dappOption === 4 && dappStakingOption === 4) || DappObject.isHandlingOperation === true) {
                
            } else {
                await handleTransportConnect(chosenNavigator, DappObject, dappOption, dappStakingOption);
            }
        });
    }
}

export async function ConnectSecondaryWalletSetupLedger(requiredApp, selectize, account, flrPublicKey, passedAddr, pageIndex, HandleClick, DappObject, FassetName = undefined) {
    DappObject.ledgerSelectedIndex = "";

    await getLedgerApp(requiredApp).then(async result => {
        switch (result) {
            case "Success":
                await wait(3000);

                if (!Array.isArray(DappObject.ledgerSecondaryArray) || !DappObject.ledgerSecondaryArray.length) {
                    let addresses;

                    // console.log("Fetching Addresses... ETH");

                    // @TODO: Change this function in jstest repo;
                    addresses = await getLedgerAddresses(requiredApp);

                    let insert = [];

                    for (let i = 0; i < addresses.length; i++) {
                        insert[i] = {
                            id: i,
                            title: addresses[i].ethAddress,
                        };
                    }

                    DappObject.ledgerSecondaryArray = insert;
                }

                // console.log(DappObject.ledgerAddrArray);

                document.getElementById("ConnectNativeText").innerHTML = '<select id="select-account" class="connect-wallet-text" placeholder="' + dappStrings['dapp_select_wallet'] + '"></select>'

                var onInputChange = async (value) => {
                    let addressBox = document.querySelector("span.title.connect-wallet-text");
                    let addr = addressBox.getAttribute('data-ethkey');

                    passedAddr = addr;

                    DappObject.secondaryAddr = passedAddr;

                    DappObject.ledgerSelectedIndex = value;

                    ConnectWalletClickFassets(DappObject, pageIndex, HandleClick, flrPublicKey, account, value, passedAddr, FassetName);
                }

                var $select = $('#select-account').selectize({
                    maxItems: 1,
                    valueField: 'id',
                    labelField: 'title',
                    searchField: ["title"],
                    options: DappObject.ledgerSecondaryArray,
                    render: {
                        item: function (item, escape) {
                            return (
                            "<div>" +
                            (item.title
                                ? `<span class="title connect-wallet-text" data-ethkey=${item.title}>` + escape(item.title) + "</span>"
                                : "") +
                            "</div>"
                            );
                        },
                        option: function (item, escape) {
                            var label = item.title;
                            return (
                            "<div>" +
                            '<span class="connect-wallet-text">' +
                            escape(label) +
                            "</span>" +
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

                selectize = $select[0].selectize;

                if (HandleClick) {
                    document.getElementById("ConnectNative").removeEventListener("click", HandleClick);
                    document.getElementById("ConnectNative").remove();
                }

                if (DappObject.ledgerSelectedIndex !== "") {
                    selectize.setValue([Number(DappObject.ledgerSelectedIndex)]);
                } else {
                    await setCurrentPopup(dappStrings['dapp_mabel_selectaccount'], true);
                }

                let addressDropdown = document.querySelector(".selectize-input");
                let secondaryAddress = addressDropdown?.childNodes[0]?.childNodes[0]?.getAttribute('data-ethkey');
                    
                passedAddr = secondaryAddress;
                break
            case "Failed: App not Installed":
                await setCurrentAppState("Alert");

                await setMabelMessages(undefined, dappStrings['dapp_mabel_ledger2'] + ' ' + requiredApp + ' ' + dappStrings['dapp_mabel_ledger3'], 1000);

                throw new Error("Ledger Avalanche App not installed!");
                break
            case "Failed: User Rejected":
                ConnectWalletClickFassets(DappObject, pageIndex, HandleClick, undefined, undefined, undefined, undefined, FassetName);
                break
        }
    });
}

export async function ConnectWalletSetupLedger(requiredApp, selectize, account, flrPublicKey, rpcUrl, flrAddr, pageIndex, HandleClick, DappObject, FassetName = undefined, passedSecondaryAddr = undefined) {
    await getLedgerApp(requiredApp).then(async result => {
        switch (result) {
            case "Success":
                await wait(3000);

                if (!Array.isArray(DappObject.ledgerAddrArray) || !DappObject.ledgerAddrArray.length) {
                    let addresses;

                    // console.log("Fetching Addresses... ETH");

                    if (GetNetworkName(rpcUrl) === "flare") {
                        addresses = await getLedgerAddresses("flare", DappObject.isAvax);
                    } else if (GetNetworkName(rpcUrl) === "songbird") {
                        addresses = await getLedgerAddresses("songbird", DappObject.isAvax);
                    }

                    let insert = [];

                    for (let i = 0; i < addresses.length; i++) {
                        insert[i] = {
                            id: i,
                            title: addresses[i].ethAddress,
                            pubkey: addresses[i].publicKey,
                        };
                    }

                    DappObject.ledgerAddrArray = insert;
                }

                // console.log(DappObject.ledgerAddrArray);

                document.getElementById("ConnectWalletText").innerHTML = '<select id="select-account" class="connect-wallet-text" placeholder="' + dappStrings['dapp_select_wallet'] + '"></select>'

                var onInputChange = async (value) => {
                    let addressBox = document.querySelector("span.title.connect-wallet-text");
                    let ethaddr = addressBox.getAttribute('data-ethkey');
                    let pubKey = addressBox.getAttribute('data-pubkey');
                    
                    flrPublicKey = pubKey;

                    account = ethaddr;

                    DappObject.selectedAddress = account;

                    DappObject.ledgerSelectedIndex = value;

                    let unprefixed;

                    if (GetNetworkName(rpcUrl) === "flare") {
                        unprefixed = await publicKeyToBech32AddressString(flrPublicKey, "flare");
                    } else if (GetNetworkName(rpcUrl) === "songbird") {
                        unprefixed = await publicKeyToBech32AddressString(flrPublicKey, "songbird");
                    }

                    DappObject.unPrefixedAddr = unprefixed;

                    if (pageIndex >= 0 && pageIndex < 4) {
                        // Normal DApp
                        ConnectWalletClick(rpcUrl, flrAddr, DappObject, pageIndex, HandleClick, flrPublicKey, ethaddr, value);
                    } else if (pageIndex >= 9) {
                        // FAssets
                        ConnectWalletClickFassets(DappObject, pageIndex, HandleClick, flrPublicKey, ethaddr, value, passedSecondaryAddr, FassetName);
                    }
                }

                var $select = $('#select-account').selectize({
                    maxItems: 1,
                    valueField: 'id',
                    labelField: 'title',
                    searchField: ["title"],
                    options: DappObject.ledgerAddrArray,
                    render: {
                        item: function (item, escape) {
                            return (
                            "<div>" +
                            (item.title
                                ? `<span class="title connect-wallet-text" data-pubkey=${item.pubkey} data-ethkey=${item.title}>` + escape(item.title) + "</span>"
                                : "") +
                            "</div>"
                            );
                        },
                        option: function (item, escape) {
                            var label = item.title;
                            return (
                            "<div>" +
                            '<span class="connect-wallet-text">' +
                            escape(label) +
                            "</span>" +
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

                selectize = $select[0].selectize;

                if (HandleClick) {
                    document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
                }

                if (DappObject.ledgerSelectedIndex !== "") {
                    selectize.setValue([Number(DappObject.ledgerSelectedIndex)]);
                } else {
                    await setCurrentPopup(dappStrings['dapp_mabel_selectaccount'], true);
                }

                let addressDropdown = document.querySelector(".selectize-input");
                let publicKey = addressDropdown?.childNodes[0]?.childNodes[0]?.getAttribute('data-pubkey');
                    
                flrPublicKey = publicKey;
                break
            case "Failed: App not Installed":
                await setCurrentAppState("Alert");

                await setMabelMessages(undefined, dappStrings['dapp_mabel_ledger2'] + ' ' + requiredApp + ' ' + dappStrings['dapp_mabel_ledger3'], 1000);

                throw new Error("Ledger Avalanche App not installed!");
                break
            case "Failed: User Rejected":
                if (pageIndex >= 0 && pageIndex < 4) {
                    // Normal DApp
                    ConnectWalletClick(rpcUrl, flrAddr, DappObject, pageIndex, HandleClick);
                } else if (pageIndex >= 9) {
                    // FAssets
                    ConnectWalletClickFassets(DappObject, pageIndex, HandleClick, undefined, undefined, undefined, undefined, FassetName);
                }
                break
        }
    });
}

export async function LedgerEVMSingleSign(txPayload, DappObject, stakingOption, isStake = false, object, pageIndex) {
    DappObject.isHandlingOperation = true;

    let ethersProvider;

    let web32;

    if (typeof object !== "undefined") {
        ethersProvider = new ethers.providers.JsonRpcProvider(object.rpcUrl);

        web32 = new Web3(object.rpcUrl);
    } else {
        ethersProvider = new ethers.providers.JsonRpcProvider('https://sbi.flr.ftsocan.com/ext/C/rpc');

        web32 = new Web3('https://sbi.flr.ftsocan.com/ext/C/rpc');
    }

    const nonce = await ethersProvider.getTransactionCount(DappObject.selectedAddress, "latest");

    const feeData = await web32.eth.calculateFeeData();

    const latestBlock = await ethersProvider.getBlock("latest");

    let gasPrice = feeData.gasPrice > BigInt(latestBlock.baseFeePerGas._hex) ? feeData.gasPrice : BigInt(latestBlock.baseFeePerGas._hex);

    let maxFeePerGas = feeData.maxFeePerGas > BigInt(latestBlock.baseFeePerGas._hex) ? feeData.maxFeePerGas : BigInt(latestBlock.baseFeePerGas._hex);

    let chainId = 14;

    if (typeof object !== "undefined" && GetNetworkName(object.rpcUrl) === "flare") {
        chainId = 14;
    } else if (typeof object !== "undefined" && GetNetworkName(object.rpcUrl) === "songbird") {
        chainId = 19;
    }

    let LedgerTxPayload;

    if (txPayload.value) {
        LedgerTxPayload = {
            to: txPayload.to,
            maxPriorityFeePerGas: maxFeePerGas,
            maxFeePerGas: maxFeePerGas,
            gasPrice: gasPrice,
            gasLimit: ethers.utils.hexlify(latestBlock.gasLimit),
            nonce: nonce,
            chainId: chainId,
            data: txPayload.data,
            value: txPayload.value
        };
    } else {
        LedgerTxPayload = {
            to: txPayload.to,
            maxPriorityFeePerGas: maxFeePerGas,
            maxFeePerGas: maxFeePerGas,
            gasPrice: gasPrice,
            gasLimit: ethers.utils.hexlify(latestBlock.gasLimit),
            nonce: nonce,
            chainId: chainId,
            data: txPayload.data,
        };
    }

    await showSpinner(async () => {
        try {
            await ledgerSignEVM(LedgerTxPayload, DappObject.ledgerSelectedIndex, ethersProvider).then(async signedTx => {

                showConfirmationSpinnerStake(async (spinner) => {
                    try {
                        spinner.setContent(dappStrings['dapp_popup_networkconfirm1'] + '<br />' + dappStrings['dapp_popup_networkconfirm2']);
                        ethersProvider.sendTransaction(signedTx).then(response => {
                            if (isStake === true) {
                                checkTxStake(response.hash, web32, spinner, DappObject);
                            } else {
                                checkTx(response.hash, web32, spinner, object, DappObject, pageIndex);
                            }
                        });
                    } catch (error) {
                        spinner.close();
                        throw error;
                    }
                });
            })
        } catch (error) {
            if (isStake === true) {
                showFailStake(DappObject, stakingOption);
                // console.log(error);
            } else {
                showFail(object, DappObject, pageIndex);
                // console.log(error);
            }
        }
    });
}

export async function LedgerEVMFtsoV2Sign(txPayload, txPayloadV2, DappObject, object, pageIndex, txHashes) {
    DappObject.isHandlingOperation = true;

    let ethersProvider;

    let web32;

    if (typeof object !== "undefined") {
        ethersProvider = new ethers.providers.JsonRpcProvider(object.rpcUrl);

        web32 = new Web3(object.rpcUrl);
    } else {
        ethersProvider = new ethers.providers.JsonRpcProvider('https://sbi.flr.ftsocan.com/ext/C/rpc');

        web32 = new Web3('https://sbi.flr.ftsocan.com/ext/C/rpc');
    }

    const nonce = await ethersProvider.getTransactionCount(DappObject.selectedAddress, "latest");

    const feeData = await web32.eth.calculateFeeData();

    const latestBlock = await ethersProvider.getBlock("latest");

    let gasPrice = feeData.gasPrice > BigInt(latestBlock.baseFeePerGas._hex) ? feeData.gasPrice : BigInt(latestBlock.baseFeePerGas._hex);

    let maxFeePerGas = feeData.maxFeePerGas > BigInt(latestBlock.baseFeePerGas._hex) ? feeData.maxFeePerGas : BigInt(latestBlock.baseFeePerGas._hex);

    let chainId = 14;

    if (typeof object !== "undefined" && GetNetworkName(object.rpcUrl) === "flare") {
        chainId = 14;
    } else if (typeof object !== "undefined" && GetNetworkName(object.rpcUrl) === "songbird") {
        chainId = 19;
    }

    let LedgerTxPayload = {
        to: txPayload.to,
        maxPriorityFeePerGas: maxFeePerGas,
        maxFeePerGas: maxFeePerGas,
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(latestBlock.gasLimit),
        nonce: nonce,
        chainId: chainId,
        data: txPayload.data,
    };

    let LedgerTxPayloadV2 = {
        to: txPayloadV2.to,
        maxPriorityFeePerGas: maxFeePerGas,
        maxFeePerGas: maxFeePerGas,
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(latestBlock.gasLimit),
        nonce: nonce + 1,
        chainId: chainId,
        data: txPayloadV2.data,
    };

    await showConfirmationSpinnerv2(async (v2Spinner) => {
        try {
            await ledgerSignEVM(LedgerTxPayload, DappObject.ledgerSelectedIndex, ethersProvider).then(async signedTx => {
                ethersProvider.sendTransaction(signedTx).then(response => {
                    v2Spinner.$content.find('#v1TxStatus').html(dappStrings['dapp_popup_networkconfirm1']);

                    txHashes[0] = response.hash;

                    checkTx(response.hash, web32, undefined, object, DappObject, pageIndex, true).then(result => {
                        return new Promise((resolve, reject) => {
                            switch (result) {
                                case "Success":
                                    v2Spinner.$content.find('#v1TxStatus').html(dappStrings['dapp_popup_success']);
                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-solid fa-check");
                                    v2Spinner.$content.find('#v2TxStatus').html('Please check your Wallet...');
                                    setTimeout(() => {
                                        resolve("Success");
                                    }, 1500);
                                    break
                                case "Fail":
                                    v2Spinner.$content.find('#v1TxStatus').html(dappStrings['dapp_popup_failed']);
                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-warning");
                                    resolve("Failed");
                                    v2Spinner.close();
                                    showFail(object, DappObject, 2);
                                    break
                                case "Unknown":
                                    v2Spinner.$content.find('#v1TxStatus').html('Unknown');
                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-warning");
                                    v2Spinner.$content.find('#v2TxStatus').html('Please check your Wallet...');
                                    setTimeout(() => {
                                        resolve("Unknown");
                                    }, 1500);
                                    break
                            }
                        });
                    }).then(async value => {
                        if (value === "Success" || value === "Unknown") {
                            await ledgerSignEVM(LedgerTxPayloadV2, DappObject.ledgerSelectedIndex, ethersProvider).then(async signedTxV2 => {
                                ethersProvider.sendTransaction(signedTxV2).then(answer => {
                                    v2Spinner.$content.find('#v2TxStatus').html(dappStrings['dapp_popup_networkconfirm1']);

                                    txHashes[1] = answer.hash;

                                    checkTx(answer.hash, web32, undefined, object, DappObject, pageIndex, true).then(receipt => {
                                        switch (receipt) {
                                            case "Success":
                                                v2Spinner.$content.find('#v2TxStatus').html(dappStrings['dapp_popup_success']);
                                                v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-solid fa-check");
                                                v2Spinner.close();
                                                showConfirm(txHashes[0] + "<br/>" + txHashes[1], object, DappObject, 2);
                                                break
                                            case "Fail":
                                                v2Spinner.$content.find('#v2TxStatus').html(dappStrings['dapp_popup_failed']);
                                                v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-warning");
                                                v2Spinner.close();
                                                showFail(object, DappObject, 2);
                                                break
                                            case "Unknown":
                                                v2Spinner.$content.find('#v2TxStatus').html('Unknown');
                                                v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-warning");
                                                v2Spinner.close();
                                                showFail(object, DappObject, 2);
                                                break
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
            });
        } catch (error) {
            v2Spinner.close();

            showFail(object, DappObject, pageIndex);
        }
    });
}

export async function handleTransportConnect(chosenNavigator, DappObject, option, stakingOption) {
    DappObject.isHandlingOperation = true;

    if (option === 4 && stakingOption === 5) {
        let continueButton = document.getElementById("ContinueAnyway");

        let newButton = continueButton.cloneNode(true);

        continueButton.parentNode.replaceChild(newButton, continueButton);
        
        document.getElementById("ContinueAnyway")?.classList.add("claim-button");

        DappObject.isHandlingOperation = false;
    }

    clearTimeout(DappObject.latestPopupTimeoutId);

    let numberOfLedgers = await getNumberOfLedgers(chosenNavigator);

    if (numberOfLedgers >= 1) {
        let requiredApp;

        if (DappObject.secondaryWalletIndex !== -1) {
            requiredApp = FAssetInfo[DappObject.chosenFAsset].ledgerAppName;
        } else {
            if (DappObject.walletIndex === 0) {
                requiredApp = "Ethereum";
            } else if (DappObject.walletIndex === 1 || DappObject.walletIndex === -1) {
                if (DappObject.isAvax === true) {
                    requiredApp = "Avalanche";
                } else {
                    requiredApp = "Flare Network";
                }
            }
        }

        await setCurrentAppState("Connecting");

        await getLedgerApp(requiredApp).then(async result => {
            switch (result) {
                case "Success":
                    let rpc;

                    let registryaddr;

                    if (option != 4) {
                        var networkSelectBox = document.getElementById('SelectedNetwork');

                        rpc = networkSelectBox.options[networkSelectBox.selectedIndex].getAttribute("data-rpcurl");

                        registryaddr = networkSelectBox.options[networkSelectBox.selectedIndex].getAttribute("data-registrycontract");
                    }

                    await wait(3000);
              
                    handleAccountsChanged([], DappObject, option, stakingOption, rpc, registryaddr, true);
                    break
                case "Failed: App not Installed":
                    await setCurrentAppState("Alert");

                    await setMabelMessages(undefined, dappStrings['dapp_mabel_ledger2'] + ' ' + requiredApp + ' ' + dappStrings['dapp_mabel_ledger3'], 1000);

                    if (option === 4 && stakingOption === 5) {
                        let continueButton = document.getElementById("ContinueAnyway");

                        let newButton = continueButton.cloneNode(true);

                        continueButton.parentNode.replaceChild(newButton, continueButton);
                        
                        document.getElementById("ContinueAnyway")?.classList.add("claim-button");

                        DappObject.isHandlingOperation = false;
                    }

                    throw new Error("Ledger " + requiredApp + " App not installed!");
                    break
                case "Failed: User Rejected":
                    if (option === 4 && stakingOption === 5) {
                        let continueButton = document.getElementById("ContinueAnyway");

                        let newButton = continueButton.cloneNode(true);

                        continueButton.parentNode.replaceChild(newButton, continueButton);
                        
                        document.getElementById("ContinueAnyway")?.classList.add("claim-button");

                        DappObject.isHandlingOperation = false;
                    }
            }
        });
    } else {
        DappObject.isHandlingOperation = false;

        if (DappObject.walletIndex === 1) {
            clearTimeout(DappObject.latestPopupTimeoutId);

            DappObject.latestPopupTimeoutId = setTimeout( async () => {
                getDappPage("Wallet");
            }, 3000);
        }

        // console.log("No Devices!");
    }
}