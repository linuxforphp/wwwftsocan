import { GetContract } from "./flare-utils";
import { isNumber, showTokenIdentifiers, } from "./dapp-utils.js";
import { showSpinner, showConfirmationSpinner, showFail, setCurrentPopup } from "./dapp-ui.js";
import { ConnectWalletClick } from "./dapp-wallet.js";
import { LedgerEVMSingleSign } from "./dapp-ledger.js";

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