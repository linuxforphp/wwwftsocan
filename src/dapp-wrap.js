import { GetContract, round, showAccountAddress, showBalance, showTokenBalance } from "./flare-utils";
import { isNumber, showTokenIdentifiers, } from "./dapp-utils.js";
import { showSpinner, showConfirmationSpinner, showFail, setCurrentPopup, setMabelMessages } from "./dapp-ui.js";
import { ConnectWalletClick, handleAccountsChanged, handleChainChanged } from "./dapp-wallet.js";
import { LedgerEVMSingleSign } from "./dapp-ledger.js";
import { createSelectedNetwork, getSelectedNetwork } from "./dapp-common.js";

export async function setupWrapPage(DappObject, handleClick) {
    document.getElementById("wrapTab")?.classList.add("selected");
    document.getElementById("delegateTab")?.classList.remove("selected");
    document.getElementById("rewardsTab")?.classList.remove("selected");
    document.getElementById("stakeTab")?.classList.remove("selected");

    let selectedNetwork = document.getElementById("SelectedNetwork");
    let chainidhex;
    let rpcUrl;
    let networkValue;
    let tokenIdentifier;
    let wrappedTokenIdentifier;
    var wrapUnwrapButton = document.getElementById("wrapUnwrap");
    var fromIcon = document.getElementById("FromIcon");
    var toIcon = document.getElementById("ToIcon");
    document.getElementById("layer2").innerHTML = DappObject.flrLogo;
    document.getElementById("layer3").innerHTML = DappObject.flrLogo;

    let balanceElement = document.getElementById("Balance");
    let tokenBalanceElement = document.getElementById("TokenBalance");

    new Odometer({el: balanceElement, value: 0, format: odometerFormat});
    new Odometer({el: tokenBalanceElement, value: 0, format: odometerFormat});

    await createSelectedNetwork(DappObject).then( async () => {
        getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

            showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);

            document.getElementById("ConnectWallet")?.addEventListener("click", handleClick = async () => {
                ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, (dappOption - 1), handleClick);
            });
        
            // We check if the input is valid, then copy it to the wrapped tokens section.
            document.querySelector("#AmountFrom")?.addEventListener("input", function () {
                setWrapButton(DappObject);
                copyWrapInput();
            });
        
            document.getElementById("wrapUnwrap")?.addEventListener("click", async () => {
                toggleWrapButton(DappObject, object.tokenIdentifier, object.wrappedTokenIdentifier, object.rpcUrl, object.flrAddr);
            });

            document.getElementById("WrapIcon")?.addEventListener("click", async () => {
                toggleWrapButton(DappObject, object.tokenIdentifier, object.wrappedTokenIdentifier, object.rpcUrl, object.flrAddr);
            });
        
            // If the input is valid, we wrap on click of "WrapButton".
            document.getElementById("WrapButton")?.addEventListener("click", async () => {
                wrapTokens(object, DappObject);
            });

            if (DappObject.ledgerSelectedIndex !== "") {
                ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 0, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
            } else {
                document.getElementById("ConnectWallet")?.click();
            }

            // When the Connect Wallet button is clicked, we connect the wallet, and if it
            // has already been clicked, we copy the public address to the clipboard.
            if (object.networkValue === '1') {
                document.getElementById("layer2").innerHTML = DappObject.flrLogo;
                document.getElementById("layer3").innerHTML = DappObject.flrLogo;
            } else if (object.networkValue === '2') {
                document.getElementById("layer2").innerHTML = DappObject.sgbLogo;
                document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
            } else {
                document.getElementById("layer2").innerHTML = DappObject.costonLogo;
                document.getElementById("layer3").innerHTML = DappObject.costonLogo;
            }

            object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
            object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex]?.innerHTML;
            object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
            showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
            setWrapButton(DappObject);

            //When Selected Network Changes, alert Metamask
            selectedNetwork.onchange = async () => {
                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
                object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
                object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

                DappObject.selectedNetworkIndex = Number(object.networkValue);

                if (object.networkValue === '1') {
                    document.getElementById("layer2").innerHTML = DappObject.flrLogo;
                    document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                } else if (object.networkValue === '2') {
                    document.getElementById("layer2").innerHTML = DappObject.sgbLogo;
                    document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                } else {
                    document.getElementById("layer2").innerHTML = DappObject.costonLogo;
                    document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                }

                object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex]?.innerHTML;
                object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
                DappObject.wrapBool = false;
                wrapUnwrapButton.value = "false";
                fromIcon.style.color = "#fd000f";
                toIcon.style.color = "#000";
                document.getElementById("Wrap").style.color = "#fd000f";
                document.getElementById("Unwrap").style.color = "#383a3b";
                document.getElementById("wrapUnwrap")?.click();

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

                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 0, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                } catch (error) {
                    // console.log(error);
                }
                
                setWrapButton(DappObject);
            }

            if (DappObject.walletIndex !== 1) {
                DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                    handleAccountsChanged(accounts, DappObject, dappOption, undefined, object.rpcUrl, object.flrAddr);
                });

                DappObject.chosenEVMProvider.on("chainChanged", async () => {
                    handleChainChanged(DappObject);
                });

                if (DappObject.walletIndex === 2) {
                    DappObject.chosenEVMProvider.on("disconnect", async () => {
                        getDappPage(4);
                    });
                }
            }
        });
    });
}

export async function ConnectWalletWrap(account, prefixedPchainAddress, DappObject, balance, tokenBalance, web32) {
    await setMabelMessages(dappStrings['dapp_mabel_wrap1'], dappStrings['dapp_mabel_wrap2'], 15000);
    
    showAccountAddress(account, prefixedPchainAddress);
        
    if (DappObject.wrapBool === true) {
        showBalance(round(web32.utils.fromWei(balance, "ether")), DappObject.wrapBool);
        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")), DappObject.wrapBool);
    } else {
        showBalance(round(web32.utils.fromWei(tokenBalance, "ether")), DappObject.wrapBool);
        showTokenBalance(round(web32.utils.fromWei(balance, "ether")), DappObject.wrapBool);
    }
}

export async function toggleWrapButton(DappObject, tokenIdentifier, wrappedTokenIdentifier, rpcUrl, flrAddr) {
    // Switching wrap/unwrap.
    if (DappObject.wrapBool === true) {
        DappObject.wrapBool = false;
        document.getElementById("wrapUnwrap").value = "false";
        document.getElementById("FromIcon").style.color = "#000";
        document.getElementById("ToIcon").style.color = "#fd000f";
        document.getElementById("Wrap").style.color = "#383a3b";
        document.getElementById("Unwrap").style.color = "#fd000f";
        showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
        setWrapButton(DappObject);
    } else {
        DappObject.wrapBool = true;
        document.getElementById("wrapUnwrap").value = "true";
        document.getElementById("FromIcon").style.color = "#fd000f";
        document.getElementById("ToIcon").style.color = "#000";
        document.getElementById("Wrap").style.color = "#fd000f";
        document.getElementById("Unwrap").style.color = "#383a3b";
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        setWrapButton(DappObject);
    }

    ConnectWalletClick(rpcUrl, flrAddr, DappObject, 0, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
}

// Is there a valid input?
export function setWrapButton(DappObject) {
    var wrapButton = document.getElementById("WrapButton");
    var wrapButtonText = document.getElementById("WrapButtonText");

    if (Number(document.getElementById("AmountFrom").value.replace(/[^0-9]/g, '')) < 1) {
        wrapButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        wrapButton.style.cursor = "auto";
        wrapButtonText.innerText = dappStrings['dapp_enteramount'];
        DappObject.isRealValue = false;
    } else {
        wrapButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        wrapButton.style.cursor = "pointer";
        DappObject.isRealValue = true;

        if (DappObject.wrapBool === true) {
            wrapButtonText.innerText = dappStrings['dapp_wrap'];
        } else {
            wrapButtonText.innerText = dappStrings['dapp_unwrap'];
        }
    }
}

// Copy the input.
export function copyWrapInput() {
    let amountFrom = document.getElementById("AmountFrom");
    let amountTo = document.getElementById("AmountTo");
    let newValue = ''
    
    if (isNumber(amountFrom.value)) {
        newValue = amountFrom.value;
    }

    amountTo.value = newValue;
}

export async function wrapTokens(object, DappObject) {
    if (DappObject.isRealValue === false) {
        await setCurrentPopup(dappStrings['dapp_mabel_wrap_error1'], true);
    } else {
        DappObject.isHandlingOperation = true;

        var web32 = new Web3(object.rpcUrl);

        try {
            const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
            let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
            const account = DappObject.selectedAddress;
            let balance = await web32.eth.getBalance(account);
            let tokenBalance = await tokenContract.methods.balanceOf(account).call();
            var amountFrom = document.getElementById("AmountFrom");
            var amountTo = document.getElementById("AmountTo");
            const amountFromValue = parseFloat(amountFrom.value);

            if (!isNumber(amountFromValue)) {
                await setCurrentPopup(dappStrings['dapp_mabel_wrap_error2'], true);
            } else {
                const amountFromValueWei = web32.utils.toWei(amountFromValue, "ether");
                const amountFromValueWeiBN = BigInt(amountFromValueWei);
                const amountFromValueWeiHex = web32.utils.toHex(amountFromValueWeiBN);

                let txPayload = {};

                if (DappObject.wrapBool === true) {
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
                        data: tokenContract.methods.withdraw(amountFromValueWeiBN).encodeABI()
                    };
                }

                const transactionParameters = txPayload;

                if (DappObject.wrapBool === true && amountFromValueWeiBN > balance) {
                    await setCurrentPopup(dappStrings['dapp_mabel_wrap_error3'], true);
                } else if (DappObject.wrapBool === false && amountFromValueWeiBN > tokenBalance) {
                    await setCurrentPopup(dappStrings['dapp_mabel_wrap_error4'], true);
                } else {
                    if (typeof amountFrom !== 'undefined' && amountFrom != null && typeof amountTo !== 'undefined' && amountTo != null) {
                        amountFrom.value = "";
                        amountTo.value = "";
                    }

                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMSingleSign(transactionParameters, DappObject, undefined, false, object, 0);
                    } else {
                        showSpinner(async () => {
                            await DappObject.chosenEVMProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 0))
                            .catch((error) => showFail(object, DappObject, 0));
                        });
                    }

                    DappObject.isHandlingOperation = false;

                    setWrapButton(DappObject);
                }
            }
        } catch (error) {
            // console.log(error);

            DappObject.isHandlingOperation = false;

            // showFail();
        }
    }
}