import { ExternalProvider } from "@ethersproject/providers";
import Web3 from 'web3';
import { DataProvider } from '../../lib/DataProvider';
import { WrapDataProvider } from '../../lib/WrapDataProvider';

let web3: Web3;
let provider: ExternalProvider | undefined = window.ethereum;
let RpcUrl: string = '';
let WrappedNativeContract: any;
let Account: any;
let Balance: any;
let TokenBalance:any;

let wrapDataProvider: WrapDataProvider = new WrapDataProvider

let dataProvider: DataProvider = wrapDataProvider.DATAPROVIDER

let isFlare: boolean = wrapDataProvider.IS_FLR

let sgb_logo = wrapDataProvider.SGB_LOGO

let flr_logo = wrapDataProvider.FLR_LOGO

let tokenIdentifier: string = 'FLR';
let wrappedTokenIdentifier: string = 'WFLR';

// @ts-ignore
wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance)

let selectedNetwork = (document.getElementById('SelectedNetwork')) as HTMLSelectElement;
let wrapUnwrapButton = (document.getElementById('wrapUnwrap')) as HTMLButtonElement;
let amountFrom = (document.getElementById('AmountFrom')) as HTMLInputElement;
let amountTo = (document.getElementById('AmountTo')) as HTMLInputElement;

//Network value (if it has a value of 1) represents Flare, if not, it represents Songbird

let networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

//If wrapbool is true, The "Wrap" contract will be executed, if it is false, "Unwrap" will be executed.

let WrapBool = true

//If ConnectWalletBool is true, the "ConnectWallet" button has already been pressed, so it will do nothing.

let ConnectWalletBool: boolean = false

//if isrealvalue is true, the "Wrap" button will be clickable, if not, it will not.

let IsRealValue: boolean = false

//These are calls for the svg classes to change the color on click of "Wrap/Unwrap"

let fromIcon = document.getElementById("FromIcon");
let toIcon = document.getElementById("ToIcon");

document.getElementById('layer2')!.innerHTML = flr_logo
document.getElementById('layer3')!.innerHTML = flr_logo

// set the correct Address based on chosen network
    
function showRpcUrl(rpcAddress: string) {
    document.getElementById('rpcAddress')!.innerText = rpcAddress;
}

function showTokenIdentifiers(Token: any, WrappedToken:any) {
   document.getElementById('tokenIdentifier')!.innerText = Token;
   document.getElementById('wrappedTokenIdentifier')!.innerText = WrappedToken;
}

// Rounding Balance

function round(num: any) {
    //@ts-ignore
    return +(Math.round(num + "e+4")  + "e-4");
}

//Functions to show everything about "X" account

function showAccountAddress(address: string) {
    document.getElementById('ConnectWallet')!.innerText = address;
}

function showBalance(balanceAddress:any) {
    document.getElementById('Balance')!.innerText = balanceAddress;
}

function showTokenBalance(tokenBalanceAddress:any) {
    document.getElementById('TokenBalance')!.innerText = tokenBalanceAddress;
}

//Checking if the "AmountFrom" input is greater than 1

function isInput() {
    if (Number(amountFrom.value) < 1 || !isNumber(Number(amountFrom.value))) {
        document.getElementById('WrapButton')!.style.backgroundColor = "#8f8f8f"
        document.getElementById('WrapButton')!.style.cursor = "auto"
        document.getElementById('WrapButton')!.innerText = "Enter Amount"
        IsRealValue = false
    } else {
        document.getElementById('WrapButton')!.style.backgroundColor = "#fd000f"
        document.getElementById('WrapButton')!.style.cursor = "pointer"
        IsRealValue = true
        if (WrapBool == true) {
            document.getElementById('WrapButton')!.innerText = "Wrap"
        } else {
            document.getElementById('WrapButton')!.innerText = "Unwrap"
        }
    }
}

//Copying the amount from "AmountFrom" to "AmountTo" if it is a number of any kind

function isNumber(value: number) {
    if ((undefined === value) || (null === value)) {
        return false;
    }
    if (typeof value == 'number') {
        return true;
    }
    return !isNaN(value - 0);
}

function copyInput() {
    if (isNumber(Number(amountFrom.value))) {
        amountTo.value = amountFrom.value
    } else {
        amountTo.value = ''
    }

}

if (Number(networkValue) == 1) { 
    isFlare = true
    wrapDataProvider.CheckNetwork(RpcUrl, isFlare)
    tokenIdentifier = 'FLR';
    wrappedTokenIdentifier = 'WFLR';
    document.getElementById('layer2')!.innerHTML = flr_logo
    document.getElementById('layer3')!.innerHTML = flr_logo

    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
    showRpcUrl(RpcUrl);
} else {
    isFlare = false
    wrapDataProvider.CheckNetwork(RpcUrl, isFlare)
    tokenIdentifier = 'SGB';
    wrappedTokenIdentifier = 'WSGB';
    document.getElementById('layer2')!.innerHTML = sgb_logo
    document.getElementById('layer3')!.innerHTML = sgb_logo

    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
    showRpcUrl(RpcUrl);
}

// Reshowing RPC, token identifiers, and checking if the input field is valid, just in case.

showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
showRpcUrl(RpcUrl);
isInput();

//When the network is changed, we switch every value accordingly, and check if metamask is unlocked

selectedNetwork.onchange = async () => {

    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
        
    if (Number(networkValue) == 1) {
        isFlare = true
        wrapDataProvider.CheckNetwork(RpcUrl, isFlare)
        tokenIdentifier = 'FLR';
        wrappedTokenIdentifier = 'WFLR';
        document.getElementById('layer2')!.innerHTML = flr_logo
        document.getElementById('layer3')!.innerHTML = flr_logo

        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        showRpcUrl(RpcUrl);

        wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance)
        
        //Reseting Everything to "Wrap"

        wrapUnwrapButton.value = "false"
        fromIcon!.style.color = "rgb(219 39 119)"
        toIcon!.style.color = "#000"
        document.getElementById('Wrap')!.style.color = "#8f8f8f"
        document.getElementById('Unwrap')!.style.color = "#383a3b"
        WrapBool = true

        // If Amount From is NaN, or smaller than 1, We do not allow the user to Wrap. 

        if (Number(amountFrom.value) < 1 || !isNumber(Number(amountFrom.value))) {
            document.getElementById('WrapButton')!.style.backgroundColor = "#8f8f8f"
            document.getElementById('WrapButton')!.style.cursor = "auto"
            document.getElementById('WrapButton')!.innerText = "Enter Amount"
            IsRealValue = false
        } else {
            document.getElementById('WrapButton')!.style.backgroundColor = "#fd000f"
            document.getElementById('WrapButton')!.style.cursor = "pointer"
            IsRealValue = true
            if (WrapBool == true) {
                document.getElementById('WrapButton')!.innerText = "Wrap"
            } else {
                document.getElementById('WrapButton')!.innerText = "Unwrap"
            }
        }
    } else {
        isFlare = false
        wrapDataProvider.CheckNetwork(RpcUrl, isFlare)
        tokenIdentifier = 'SGB';
        wrappedTokenIdentifier = 'WSGB';
        document.getElementById('layer2')!.innerHTML = sgb_logo
        document.getElementById('layer3')!.innerHTML = sgb_logo

        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        showRpcUrl(RpcUrl);

        wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance)

        //Reseting Everything to "Wrap"

        wrapUnwrapButton.value = "false"
        fromIcon!.style.color = "rgb(219 39 119)"
        toIcon!.style.color = "#000"
        document.getElementById('Wrap')!.style.color = "#8f8f8f"
        document.getElementById('Unwrap')!.style.color = "#383a3b"
        WrapBool = true

        // If Amount From is NaN, or smaller than 1, We do not allow the user to Wrap. 

        if (Number(amountFrom.value) < 1 || !isNumber(Number(amountFrom.value))) {
            document.getElementById('WrapButton')!.style.backgroundColor = "#8f8f8f"
            document.getElementById('WrapButton')!.style.cursor = "auto"
            document.getElementById('WrapButton')!.innerText = "Enter Amount"
            IsRealValue = false
        } else {
            document.getElementById('WrapButton')!.style.backgroundColor = "#fd000f"
            document.getElementById('WrapButton')!.style.cursor = "pointer"
            IsRealValue = true
            if (WrapBool == true) {
                document.getElementById('WrapButton')!.innerText = "Wrap"
            } else {
                document.getElementById('WrapButton')!.innerText = "Unwrap"
            }
        }
    }
}

// Checking if Metamask is installed to determine if "ConnectWallet" should be clickable.

document.getElementById('ConnectWallet')!.addEventListener('click', async () => {
    if (ConnectWalletBool == false) {
        ConnectWalletBool = true
        wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance)
        console.log(`Account `, Account,` has `, Balance,` tokens, and `, TokenBalance,` wrapped tokens.`);
    } else {
        navigator.clipboard.writeText(document.getElementById('ConnectWallet')!.innerText);
        alert('Copied!')
    }
});