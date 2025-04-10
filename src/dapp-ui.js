import { wait, checkTx, checkTxStake } from "./dapp-utils.js";
import { ledgerAppList, injectedProvider } from "./dapp-globals.js";
import { ConnectWalletClick } from "./dapp-wallet.js";
import { undelegate } from "./dapp-delegate.js";
import { claimRewards } from "./dapp-claim.js";
import { RefreshStakingPage } from "./dapp-staking.js";
import { LedgerEVMSingleSign } from "./dapp-ledger.js";

export async function showSpinner(doSomething) {
    return new Promise(async (resolve, reject) => {
        $.confirm({
            escapeKey: false,
            backgroundDismiss: false,
            icon: 'fa fa-spinner fa-spin',
            title: 'Loading...',
            content: 'To continue, you must approve the transaction. <br />Please check your Wallet...',
            theme: 'material',
            type: 'dark',
            typeAnimated: true,
            draggable: false,
            buttons: {
                ok: {
                    isHidden: true, // hide the button
                },
            },
            onContentReady: async function () {
                await doSomething();
                resolve("Success");
                this.close();
            }
        });
    });
}

export async function showConfirmationSpinner(txHash, web32, object, DappObject, pageIndex) {
    var spinner =
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: 'Waiting for network confirmation. <br />Please wait...',
        theme: 'material',
        type: 'orange',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                isHidden: true, // hide the button
            },
        },
        onContentReady: async function () {
            await checkTx(txHash, web32, this, object, DappObject, pageIndex);
        }
    });
}

export async function showConfirmationSpinnerv2(doSomething) {
    return new Promise(async (resolve, reject) => {
        var spinner =
        $.confirm({
            escapeKey: false,
            backgroundDismiss: false,
            icon: 'fa fa-spinner fa-spin',
            title: 'Loading...',
            content: '<div id="v1Tx"><div id="v1TxIcon" class="fa fa-spinner fa-spin"></div> V1 rewards claim status: <div id="v1TxStatus">Please check your Wallet...</div></div><br />' + '<div id="v2Tx"><div id="v2TxIcon" class="fa fa-spinner fa-spin"></div> V2 rewards claim status: <div id="v2TxStatus">Waiting for V1 reward status...</div></div>',
            theme: 'material',
            type: 'orange',
            typeAnimated: true,
            draggable: false,
            buttons: {
                ok: {
                    isHidden: true, // hide the button
                },
            },
            onContentReady: async function () {
                await doSomething(this);
                resolve("Success");
            }
        });
    });
}

export async function showConfirmationSpinnerTransfer(doSomething) {
    var spinner =
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: '<div id="ExportTx"><div id="ExportTxIcon" class="fa fa-spinner fa-spin"></div> Export Transaction status: <div id="ExportTxStatus">Please check your Wallet...</div></div><br />' + '<div id="ImportTx"><div id="ImportTxIcon" class="fa fa-spinner fa-spin"></div> Import Transaction status: <div id="ImportTxStatus">Waiting for Export status...</div></div>',
        theme: 'material',
        type: 'orange',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                isHidden: true, // hide the button
            },
        },
        onContentReady: async function () {
            await doSomething(this);
        }
    });
}

export async function showConfirmationSpinnerStake(doSomething) {
    var spinner =
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: 'To continue, you must approve the transaction. <br /><div id="StakeTxStatus">Please check your Wallet...</div>',
        theme: 'material',
        type: 'orange',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                isHidden: true, // hide the button
            },
        },
        onContentReady: async function () {
            await doSomething(this);
        }
    });
}

export async function showConfirm(txHash, object, DappObject, pageIndex) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-solid fa-check green',
        title: 'Transaction confirmed!',
        content: 'Transaction hash: <br />',
        type: 'green',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, pageIndex, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                },
            }
        },
        onContentReady: async function () {
            this.setContentAppend(txHash);
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

export async function showConfirmStake(DappObject, stakingOption, txHashes) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-solid fa-check green',
        title: 'Transaction confirmed!',
        content: '',
        type: 'green',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    RefreshStakingPage(DappObject, stakingOption);
                },
            }
        },
        onContentReady: async function () {
            for (let i = 0; i < txHashes.length; i++) {
                this.setContentAppend(txHashes[i] + "<br />");
            }

            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

export function showEmptyBucket(object, DappObject, claimAmount) {
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-warning',
        title: 'V1 Bucket is Empty!',
        content: 'The V1 rewards bucket will be replenished shortly.<br /> Only V2 rewards will be claimed for now.',
        type: 'dark',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    claimRewards(object, DappObject, claimAmount);
                },
            },
        },
        onContentReady: function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

export function showFail(object, DappObject, pageIndex, revertReason) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-warning red',
        title: 'Transaction declined!',
        content: '<div id="revertReason"></div>',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, pageIndex, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                },
            },
        },
        onContentReady: function () {
            this.showLoading(true);
            this.hideLoading(true);

            if (revertReason) {
                this.$content.find('#revertReason').html(revertReason);
            }
        }
    });
}

export function showFailStake(DappObject, stakingOption) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: true,
        icon: 'fa fa-warning red',
        title: 'Transaction declined!',
        content: '',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                action: function () {
                    RefreshStakingPage(DappObject, stakingOption);
                },
            },
        },
        onContentReady: function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

export async function showBindPAddress(contract, web32, address, publicKey, addressPchainEncoded, DappObject, stakingOption) {
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-warning',
        title: 'P-Address Invalid!',
        content: 'Your P-Chain address is not bound to your C-Chain address! <br /> If you do not bind them, you will not be able to stake. <br /> Do you wish to bind them?',
        type: 'orange',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            yes: {
                action: async function () {
                    const transactionParameters = {
                        from: address,
                        to: contract.options.address,
                        data: contract.methods.registerAddresses(publicKey, addressPchainEncoded, address).encodeABI(),
                    };
        
                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMSingleSign(transactionParameters, DappObject, stakingOption, true);
                    } else {
                        showSpinner(async () => {
                            await injectedProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                            .then(txHash => showConfirmationSpinnerStake(async (spinner) => {
                                checkTxStake(txHash, web32, spinner, DappObject);
                            }))
                            .catch((error) => showFailStake(DappObject, stakingOption));
                        });
                    }
                    ;
                },
            },
            no: {
                action: function () {
                    this.close();
                },
            }
        },
        onContentReady: async function () {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

export function downloadMetamask() {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: false,
        icon: 'fa fa-warning red',
        title: 'Metamask is not installed!',
        content: 'Would you like to install Metamask in your browser?',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            yes: {
                btnClass: 'btn-red',
                keys: ['enter'],
                action: function () {
                    var url = 'https://metamask.io/download/';

                    window.open(url, '_blank').focus();
                },
            },
            no: {}
        }
    });
}

export async function showValidatorInvalid(control, delegatedicon) {
    return new Promise(async (resolve, reject) => {
        $.confirm({
            escapeKey: false,
            backgroundDismiss: false,
            icon: 'fa fa-solid fa-flag red',
            title: 'Loading...',
            content: 'The validator you have selected is not currently stakeable. <br />Please select another validator.',
            theme: 'material',
            type: 'red',
            typeAnimated: true,
            draggable: false,
            buttons: {
                ok: {
                    action: function () {
                        control.clear();
                        delegatedicon.src = dappUrlBaseAddr + "img/FLR.svg";
                    },
                },
            },
            onContentReady: async function () {
                this.showLoading(true);
                this.hideLoading(true);
            }
        });
    });
}

export async function showAlreadyDelegated(DelegatedFtsos, object) {    
    $.confirm({
        escapeKey: false,
        backgroundDismiss: false,
        icon: 'fa fa-solid fa-flag red',
        title: 'Already delegated!',
        content: 'You have already delegated to ',
        type: 'red',
        theme: 'material',
        typeAnimated: true,
        draggable: false,
        buttons: {
            undelegate: {
                btnClass: 'btn-red',
                action: function () {
                    undelegate(object, DappObject);
                },
            },
            cancel: function () {
            }
        },
        onContentReady: function () {
            if (DelegatedFtsos.length > 1) {
                this.setContentAppend(DelegatedFtsos[0] + " and " + DelegatedFtsos[1] + ". <br />");
            } else {
                this.setContentAppend(DelegatedFtsos[0] + ". <br />");
            }
            this.setContentAppend("You MUST undelegate before you can delegate to another provider. <br />");
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

export async function setCurrentAppState(state) {
    const currentWallet = document.getElementById("currentWallet");

    const appLogo = document.getElementById("appLogo");

    const walletNotification = document.getElementById("currentWalletIcon");

    switch (DappObject.walletIndex) {
        case -1:
            appLogo.innerHTML = '<svg class="btn-bell" fill="none" version="1.1" viewBox="0 0 185 185" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g transform="translate(0 26.5)"><g transform="matrix(.93 0 0 .93 6.12 8.72)" fill="#fff" style="mix-blend-mode:normal"><path d="m98.8-11.9s-3.45 6.65-7.58 14.8c-4.13 8.13-7.68 15-7.91 15.3-0.451 0.61-1.04 0.959-1.73 1.12-0.963 0.175-1.82-0.222-2.54-0.6-1.1-0.572-3.01-1.68-6.75-3.83-4.21-2.43-7.67-4.41-7.68-4.39-0.0179 0.0185 2.08 10.9 4.67 24.3 2.23 11.5 3.4 17.6 4 20.9 0.297 1.64 0.449 2.58 0.516 3.15 0.179 1.28-0.51 2.31-1.53 2.9-0.982 0.423-2.09 0.351-2.99-0.172-0.28-0.201-4.75-4.92-9.93-10.5-5.18-5.57-9.53-10.2-9.67-10.4-0.0305-0.0319-0.059-0.0553-0.0907-0.0614-0.0316-0.0061-0.0663 0.0056-0.108 0.0442-0.0841 0.0772-0.198 0.263-0.379 0.632-0.362 0.738-0.993 2.21-2.19 5.02-1.14 2.67-1.78 4.16-2.2 5.03-0.334 0.806-0.813 1.4-1.53 1.78-1.07 0.517-2.26 0.169-3.2-0.0083-1.75-0.331-4.89-0.996-10.8-2.25-6.88-1.47-12.5-2.64-12.6-2.61-0.0307 0.0287 1.86 5.95 4.21 13.2 1.64 5.04 2.7 8.36 3.36 10.5 0.328 1.07 0.554 1.84 0.698 2.38 0.202 0.555 0.221 1.13 0.131 1.66-0.148 0.665-0.517 1.19-1 1.6-0.267 0.199-2.68 1.38-5.35 2.63l-4.87 2.27 16.9 13.7c13.1 10.6 19.6 15.9 22.9 18.6 1.67 1.37 2.54 2.09 3.02 2.51 0.465 0.366 0.828 0.823 1.03 1.31 0.198 1.02-0.039 2.04-0.325 2.94-0.352 1.1-1.02 2.94-2.26 6.35-1.46 4-2.63 7.29-2.6 7.31 0.0281 0.0215 2.8-0.448 6.16-1.04 5.31-0.942 10.1-1.83 14.2-2.63 4.13-0.804 7.66-1.52 10.5-2.13 5.75-1.21 8.91-1.97 9.15-2.04 1.08-0.296 2.33-0.65 3.69-1.03-0.267 0.0511-0.536 0.0933-0.806 0.127-6.73-0.0855-12.2-5.57-12.2-12.1 0.0784-7.9 7.71-13.6 15.1-11.8 0.0336 0.0101 0.0672 0.0204 0.101 0.0308l0.0625-21-16.5 0.0199c-0.464-4.28 0.776-8.53 2.83-12.3 2.85-5.36 8.17-8.32 13.8-9.84l0.0697-23.4-15.5 0.0863c-0.395-3.38 0.337-6.77 1.63-9.93 2.4-6.28 7.68-10.4 14-12.1z"/><path d="m108 15.2c-2.81 0.0422-5.16 0.0931-6.84 0.154-5.82 0.575-11.6 3.81-14.4 8.92-0.36 0.659-0.685 1.35-0.981 2.04-1.35 2.79-1.61 5.46-1.45 8.53l68.8-0.368c5.31-0.324 10.2-3.26 13.5-7.33 2.61-3.51 3.31-7.8 3.67-12.1-20.8 0.0319-40.5-0.158-62.3 0.165z"/><path d="m113 60.5c-4.57 0.0229-8.92 0.0842-12.4 0.207-5.15 0.55-10.5 2.94-13.7 7.04-2.81 3.73-4 7.85-3.74 12.5 13.8-0.0159 27.6-0.0324 41.4-0.0487 4.96-0.312 9.85-2.74 13.1-6.4 3.31-3.57 4.21-8.3 4.62-13.1-10.4-0.142-18.9-0.257-29.3-0.207z"/><path d="m95.4 104c-5.85 0.0737-10.6 4.83-10.6 10.5 0.0819 5.88 4.95 10.5 10.6 10.5 5.8-0.157 10.6-4.77 10.6-10.5-0.0157-5.82-4.92-10.5-10.6-10.5z"/></g></g></svg>';
            break
        case 0:
            appLogo.innerHTML = '<svg class="btn-bell" fill="none" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 79.374998 79.375" version="1.1" id="svg1" xml:space="preserve" <g id="layer1"><path style="fill:#FFFFFF" d="m 31.704516,54.76963 c -4.375814,-6.160866 -7.922539,-11.247117 -7.881611,-11.30278 0.04093,-0.05566 3.593184,1.983209 7.893905,4.530827 5.047396,2.989926 8.022846,4.553998 8.393112,4.411913 0.315491,-0.121065 3.842011,-2.14287 7.83671,-4.492899 3.9947,-2.350029 7.406681,-4.354063 7.582181,-4.453409 0.185732,-0.105139 0.191732,0.02645 0.01436,0.31485 C 54.951014,44.74094 40.471667,65.093835 40.069032,65.529353 39.751451,65.87287 37.889917,63.47828 31.704516,54.76963 Z M 31.75,45.034923 c -5.211187,-3.083904 -7.897706,-4.869531 -7.821643,-5.198748 0.237348,-1.027294 15.739202,-26.414666 15.975582,-26.163196 0.135321,0.143959 3.814868,6.16979 8.176771,13.390737 l 7.930733,13.128993 -7.961961,4.686285 C 43.670403,47.45645 39.997516,49.60284 39.88751,49.648749 39.777505,49.694658 36.115625,47.618436 31.75,45.034923 Z" id="path5"/></g></svg>'
            break
        case 1:
            if (DappObject.isAvax === true) {
                appLogo.innerHTML = '<svg class="btn-bell" viewBox="0 0 1503 1504" fill="none" version="1.1" id="svg1" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" clip-rule="evenodd" d="M 538.688,1050.86 H 392.94 c -30.626,0 -45.754,0 -54.978,-5.9 -9.963,-6.46 -16.051,-17.16 -16.789,-28.97 -0.554,-10.88 7.011,-24.168 22.139,-50.735 l 359.87,-634.32 c 15.313,-26.936 23.061,-40.404 32.839,-45.385 10.516,-5.35 23.062,-5.35 33.578,0 9.778,4.981 17.527,18.449 32.839,45.385 l 73.982,129.144 0.377,0.659 c 16.539,28.897 24.926,43.551 28.588,58.931 4.058,16.789 4.058,34.5 0,51.289 -3.69,15.497 -11.992,30.257 -28.781,59.591 l -189.031,334.153 -0.489,0.856 c -16.648,29.135 -25.085,43.902 -36.778,55.042 -12.73,12.18 -28.043,21.03 -44.832,26.02 -15.313,4.24 -32.47,4.24 -66.786,4.24 z m 368.062,0 h 208.84 c 30.81,0 46.31,0 55.54,-6.08 9.96,-6.46 16.23,-17.35 16.79,-29.15 0.53,-10.53 -6.87,-23.3 -21.37,-48.323 -0.5,-0.852 -1,-1.719 -1.51,-2.601 l -104.61,-178.956 -1.19,-2.015 c -14.7,-24.858 -22.12,-37.411 -31.65,-42.263 -10.51,-5.351 -22.88,-5.351 -33.391,0 -9.594,4.981 -17.342,18.08 -32.655,44.462 l -104.238,178.957 -0.357,0.616 c -15.259,26.34 -22.885,39.503 -22.335,50.303 0.738,11.81 6.826,22.69 16.788,29.15 9.041,5.9 24.538,5.9 55.348,5.9 z" fill="#FFFFFF" id="path1"/></svg>';
            } else {
                appLogo.innerHTML = '<svg class="btn-bell" fill="none" version="1.1" viewbox="0 0 383.66 538.51" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(.80749 0 0 .80749 59.503 59.212)" stroke-width="2.1053"><path d="m1.54 44.88s-1.54-0.83693-1.54-1.57c0-14.016 13.306-43.31 44.83-43.31 7.0837 1e-14 178 0 178 0s1.55 0.837 1.54 1.57c-0.28292 20.783-17.203 43.31-44.86 43.31h-177.97z"/><path d="m-2.8371e-7 133.36c-0.01006 0.733 1.54 1.57 1.54 1.57h110.8c25.586 0 44.577-22.527 44.86-43.31 0.01-0.733-1.54-1.57-1.54-1.57h-110.78c-25.453 0-44.595 22.522-44.88 43.31z"/><path d="m45.069 202.56a22.648 22.301 0 0 1-22.648 22.301 22.648 22.301 0 0 1-22.648-22.301 22.648 22.301 0 0 1 22.648-22.301 22.648 22.301 0 0 1 22.648 22.301z"/></g></svg><svg class="btn-bell" fill="#FFFFFF" version="1.1" viewbox="-40 -100 300 400" xmlns="http://www.w3.org/2000/svg"><g stroke-width="2.1053"><path d="m1.54 44.88s-1.54-0.83693-1.54-1.57c0-14.016 13.306-43.31 44.83-43.31 7.0837 1e-14 178 0 178 0s1.55 0.837 1.54 1.57c-0.28292 20.783-17.203 43.31-44.86 43.31h-177.97z"/><path d="m-2.8371e-7 133.36c-0.01006 0.733 1.54 1.57 1.54 1.57h110.8c25.586 0 44.577-22.527 44.86-43.31 0.01-0.733-1.54-1.57-1.54-1.57h-110.78c-25.453 0-44.595 22.522-44.88 43.31z"/><path d="m45.069 202.56a22.648 22.301 0 0 1-22.648 22.301 22.648 22.301 0 0 1-22.648-22.301 22.648 22.301 0 0 1 22.648-22.301 22.648 22.301 0 0 1 22.648 22.301z"/></g></svg>';
            }   
            break
        case 2:
            appLogo.innerHTML = '<svg class="btn-bell" fill="none" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" viewBox="0 0 79.374998 79.375" version="1.1" id="svg1" xml:space="preserve" <g id="layer1"><path style="fill:#FFFFFF" d="m 31.704516,54.76963 c -4.375814,-6.160866 -7.922539,-11.247117 -7.881611,-11.30278 0.04093,-0.05566 3.593184,1.983209 7.893905,4.530827 5.047396,2.989926 8.022846,4.553998 8.393112,4.411913 0.315491,-0.121065 3.842011,-2.14287 7.83671,-4.492899 3.9947,-2.350029 7.406681,-4.354063 7.582181,-4.453409 0.185732,-0.105139 0.191732,0.02645 0.01436,0.31485 C 54.951014,44.74094 40.471667,65.093835 40.069032,65.529353 39.751451,65.87287 37.889917,63.47828 31.704516,54.76963 Z M 31.75,45.034923 c -5.211187,-3.083904 -7.897706,-4.869531 -7.821643,-5.198748 0.237348,-1.027294 15.739202,-26.414666 15.975582,-26.163196 0.135321,0.143959 3.814868,6.16979 8.176771,13.390737 l 7.930733,13.128993 -7.961961,4.686285 C 43.670403,47.45645 39.997516,49.60284 39.88751,49.648749 39.777505,49.694658 36.115625,47.618436 31.75,45.034923 Z" id="path5"/></g></svg>'
            break
    }

    switch (state) {
        case "Null":
            currentWallet.classList.remove("ring");
            currentWallet.classList.add("paused");

            walletNotification.style.backgroundColor = "#aaa";
            walletNotification.style.border = "3px solid #dadada";
            break
        case "Alert":
            currentWallet.classList.add("ring");
            currentWallet.classList.remove("paused");

            walletNotification.style.backgroundColor = "#f45f58";
            walletNotification.style.border = "3px solid #ff9994";
            break
        case "Connecting":
            currentWallet.classList.add("ring");
            currentWallet.classList.remove("paused");

            walletNotification.style.backgroundColor = "#f9be2f";
            walletNotification.style.border = "3px solid #ffe5a7";
            break
        case "Connected":
            currentWallet.classList.remove("ring");
            currentWallet.classList.add("paused");

            walletNotification.style.backgroundColor = "#42ca40";
            walletNotification.style.border = "3px solid #8fe18e";
            break
    }
}


export async function setCurrentPopup(message, open) {
    document.getElementById("currentWalletPopup").classList.remove("showing");

    clearTimeout(DappObject.latestPopupTimeoutId);

    if (open === true) {
        if ((navigator.maxTouchPoints & 0xFF) === 0) {
            await wait(1000);

            document.getElementById("currentWalletPopup").classList.add("showing");
        }
    }

    document.getElementById("currentWalletPopupText").innerText = message;
}

export function closeCurrentPopup() {
    document.getElementById("currentWalletPopup").classList.remove("showing");
}

export async function setupLedgerOption() {
    if ((navigator.maxTouchPoints & 0xFF) === 0) {
        var $select = $('#chosenApp').selectize({
            maxItems: 1,
            valueField: 'id',
            labelField: 'title',
            searchField: ["title"],
            options: ledgerAppList,
            render: {
                item: function (item, escape) {
                    return (
                    "<div>" +
                    (item.title
                        ? `<span class="addr-wrap">` + escape(item.title) + "</span>"
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
                onLedgerInputChange(value);
            },
            create: false,
            dropdownParent: "body",
        });
    } else {
        document.getElementById("metamaskOption").classList.remove("col-md-4");
        document.getElementById("metamaskOption").classList.add("col-md-6");

        document.getElementById("walletConnectOption").classList.remove("col-md-4");
        document.getElementById("walletConnectOption").classList.add("col-md-6");

        document.getElementById("ledgerOption").style.display = "none";
    }
}

export const onLedgerInputChange = async (value) => {
    if (value == 0) {
        DappObject.isAvax = false;
    } else if (value == 1) {
        DappObject.isAvax = true;
    }
}