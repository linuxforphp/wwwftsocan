import { showConfirm, showConfirmStake, showFail, showFailStake, setCurrentAppState, setCurrentPopup } from "./dapp-ui.js";
import { updateCurrentAccountStatus } from "./flare-utils.js";

export function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function unPrefix0x(input) {
    return input.startsWith("0x") ? input.slice(2) : input;
}

// Simple math function.
export function round(num) {
    return +(Math.round(num + "e+4") + "e-4");
}

// Is value a number?
export function isNumber(value) {
    if (void 0 === value || null === value) {
        return false;
    }
    if (typeof value == "number") {
        return true;
    }
    return !isNaN(value - 0);
}

export function checkConnection() {
    if (!navigator.onLine) {
        setCurrentAppState("Alert");

        setCurrentPopup(dappStrings['dapp_mabel_internet_error'], true);

        throw new Error("No Internet!");
    }
}

export async function checkTx(hash, web32, spinner, object, DappObject, pageIndex, isV2 = false) {
    return new Promise((resolve) => {
        try {
            var i = 0;
        
            // Set interval to regularly check if we can get a receipt
            let interval = setInterval(() => {
                i += 1;
                
                web32.eth.getTransactionReceipt(hash).then((receipt) => {
                    // If we've got a receipt, check status and log / change text accordingly
                    if (receipt) {
                        if (spinner) {
                            spinner.close();
                        }
                        
                        if (Number(receipt.status) === 1) {
                            if (isV2 === false) {
                                showConfirm(receipt.transactionHash, object, DappObject, pageIndex);
                            }
    
                            resolve("Success");
                        } else if (Number(receipt.status) === 0) {
                            if (isV2 === false) {
                                showFail(object, DappObject, pageIndex);
                            }
    
                            resolve("Fail");
                        }
    
                        // Clear interval
                        clearInterval(interval);
                    }
                });
                
                if (i === 20) {
                    throw new Error("Transaction Dropped.");
                }
            }, 6000)
        } catch (error) {
            if (spinner) {
                spinner.close();
            }

            if (isV2 === false) {
                showFail(object, DappObject, pageIndex);
            }
            
            // Clear interval
            clearInterval(interval);
        }
    });
}

export async function checkTxStake(hash, web32, spinner, DappObject) {
    try {
        var i = 0;
        
        // Set interval to regularly check if we can get a receipt
        let interval = setInterval(() => {
            i += 1;
            
            web32.eth.getTransactionReceipt(hash).then((receipt) => {
                // If we've got a receipt, check status and log / change text accordingly
                if (receipt) {
                    spinner.close();
                    
                    if (Number(receipt.status) === 1) {
                        showConfirmStake(DappObject, 3, [receipt.transactionHash]);
                    } else if (Number(receipt.status) === 0) {
                        showFailStake(DappObject, 3);
                    }

                    // Clear interval
                    clearInterval(interval);
                }
            });
            
            if (i === 20) {
                throw new Error("Transaction dropped.");
            }
        }, 6000)
    } catch (error) {
        spinner.close();

        showFailStake(DappObject, 3);
        
        // Clear interval
        clearInterval(interval);
    }
}

// Show the current token identifiers.
export function showTokenIdentifiers(token, wrappedToken) {
    if (typeof token !== 'undefined' && token !== null) {
        document.getElementById("tokenIdentifier").innerText = token;
    }

    document.getElementById("wrappedTokenIdentifier").innerText = wrappedToken;
}

export function showConnectedAccountAddress(address, pAddress) {
    if (typeof address !== "undefined") {
        if (address !== "0x0") {
            updateCurrentAccountStatus(address, null, true, pAddress);
        }
        
        document.getElementById('AccountAddress').innerText = address;
    } else {
        if (DappObject.selectedAddress && DappObject.selectedAddress.startsWith("0x")) {
            document.getElementById('AccountAddress').innerText = DappObject.selectedAddress;
        }
    }
}

// Function to remove by id or class name.
export const remove = (sel) => document.querySelectorAll(sel).forEach(el => el.remove());


export async function resetDappObjectState(DappObject) {
    DappObject.isHandlingOperation = false;

    DappObject.signatureStaking = "";

    DappObject.ledgerSelectedIndex = "";

    DappObject.selectedAddress = "";

    DappObject.unPrefixedAddr = "";

    DappObject.secondaryAddr = "";

    DappObject.ledgerAddrArray = [];

    DappObject.ledgerSecondaryArray = [];

    if (DappObject.walletIndex === 2 && DappObject.chosenEVMProvider !== undefined) {
        DappObject.chosenEVMProvider.disconnect();
    }

    if (DappObject.walletIndex === 3 && DappObject.chosenEVMProvider !== undefined) {
        await cryptoComConnector.deactivate();
    }

    DappObject.chosenEVMProvider = undefined;
}