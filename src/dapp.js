// Simple math function.

async function showSpinner(doSomething) {
    $.confirm({
        escapeKey: true,
        backgroundDismiss: false,
        icon: 'fa fa-spinner fa-spin',
        title: 'Loading...',
        content: 'We are processing your transaction. <br />Please wait...',
        theme: 'material',
        type: 'dark',
        typeAnimated: true,
        draggable: false,
        buttons: {
            ok: {
                isHidden: true, // hide the button
            },
        },
        onContentReady: async function() {
            await doSomething();
            this.close();
        }
    });
}

async function showConfirm(txHash) {
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
            },
        },
        onContentReady: async function() {
            this.setContentAppend(txHash);
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

function showFail() {
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
            },
        },
        onContentReady: function() {
            this.showLoading(true);
            this.hideLoading(true);
        }
    });
}

function hideSpinner() {
    $.LoadingOverlay("hide");
}

var selectedNetwork = document.getElementById("SelectedNetwork");
var flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
var rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
var chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
var networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
var connectWalletBool = false;
var downloadMetamaskFlag = false;