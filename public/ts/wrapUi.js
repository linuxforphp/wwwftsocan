var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WrapDataProvider } from '../../lib/WrapDataProvider';
let web3;
let provider = window.ethereum;
let RpcUrl = '';
let WrappedNativeContract;
let Account;
let Balance;
let TokenBalance;
let wrapDataProvider = new WrapDataProvider;
let dataProvider = wrapDataProvider.DATAPROVIDER;
let isFlare = wrapDataProvider.IS_FLR;
let sgb_logo = wrapDataProvider.SGB_LOGO;
let flr_logo = wrapDataProvider.FLR_LOGO;
let tokenIdentifier = 'FLR';
let wrappedTokenIdentifier = 'WFLR';
// @ts-ignore
wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance);
let selectedNetwork = (document.getElementById('SelectedNetwork'));
let wrapUnwrapButton = (document.getElementById('wrapUnwrap'));
let amountFrom = (document.getElementById('AmountFrom'));
let amountTo = (document.getElementById('AmountTo'));
//Network value (if it has a value of 1) represents Flare, if not, it represents Songbird
let networkValue = selectedNetwork === null || selectedNetwork === void 0 ? void 0 : selectedNetwork.options[selectedNetwork.selectedIndex].value;
//If wrapbool is true, The "Wrap" contract will be executed, if it is false, "Unwrap" will be executed.
let WrapBool = true;
//If ConnectWalletBool is true, the "ConnectWallet" button has already been pressed, so it will do nothing.
let ConnectWalletBool = false;
//if isrealvalue is true, the "Wrap" button will be clickable, if not, it will not.
let IsRealValue = false;
//These are calls for the svg classes to change the color on click of "Wrap/Unwrap"
let fromIcon = document.getElementById("FromIcon");
let toIcon = document.getElementById("ToIcon");
document.getElementById('layer2').innerHTML = flr_logo;
document.getElementById('layer3').innerHTML = flr_logo;
// set the correct Address based on chosen network
function showRpcUrl(rpcAddress) {
    document.getElementById('rpcAddress').innerText = rpcAddress;
}
function showTokenIdentifiers(Token, WrappedToken) {
    document.getElementById('tokenIdentifier').innerText = Token;
    document.getElementById('wrappedTokenIdentifier').innerText = WrappedToken;
}
// Rounding Balance
function round(num) {
    //@ts-ignore
    return +(Math.round(num + "e+4") + "e-4");
}
//Functions to show everything about "X" account
function showAccountAddress(address) {
    document.getElementById('ConnectWallet').innerText = address;
}
function showBalance(balanceAddress) {
    document.getElementById('Balance').innerText = balanceAddress;
}
function showTokenBalance(tokenBalanceAddress) {
    document.getElementById('TokenBalance').innerText = tokenBalanceAddress;
}
//Checking if the "AmountFrom" input is greater than 1
function isInput() {
    if (Number(amountFrom.value) < 1 || !isNumber(Number(amountFrom.value))) {
        document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f";
        document.getElementById('WrapButton').style.cursor = "auto";
        document.getElementById('WrapButton').innerText = "Enter Amount";
        IsRealValue = false;
    }
    else {
        document.getElementById('WrapButton').style.backgroundColor = "#fd000f";
        document.getElementById('WrapButton').style.cursor = "pointer";
        IsRealValue = true;
        if (WrapBool == true) {
            document.getElementById('WrapButton').innerText = "Wrap";
        }
        else {
            document.getElementById('WrapButton').innerText = "Unwrap";
        }
    }
}
//Copying the amount from "AmountFrom" to "AmountTo" if it is a number of any kind
function isNumber(value) {
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
        amountTo.value = amountFrom.value;
    }
    else {
        amountTo.value = '';
    }
}
if (Number(networkValue) == 1) {
    isFlare = true;
    wrapDataProvider.CheckNetwork(RpcUrl, isFlare);
    tokenIdentifier = 'FLR';
    wrappedTokenIdentifier = 'WFLR';
    document.getElementById('layer2').innerHTML = flr_logo;
    document.getElementById('layer3').innerHTML = flr_logo;
    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    showRpcUrl(RpcUrl);
}
else {
    isFlare = false;
    wrapDataProvider.CheckNetwork(RpcUrl, isFlare);
    tokenIdentifier = 'SGB';
    wrappedTokenIdentifier = 'WSGB';
    document.getElementById('layer2').innerHTML = sgb_logo;
    document.getElementById('layer3').innerHTML = sgb_logo;
    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    showRpcUrl(RpcUrl);
}
// Reshowing RPC, token identifiers, and checking if the input field is valid, just in case.
showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
showRpcUrl(RpcUrl);
isInput();
//When the network is changed, we switch every value accordingly, and check if metamask is unlocked
selectedNetwork.onchange = () => __awaiter(void 0, void 0, void 0, function* () {
    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
    if (Number(networkValue) == 1) {
        isFlare = true;
        wrapDataProvider.CheckNetwork(RpcUrl, isFlare);
        tokenIdentifier = 'FLR';
        wrappedTokenIdentifier = 'WFLR';
        document.getElementById('layer2').innerHTML = flr_logo;
        document.getElementById('layer3').innerHTML = flr_logo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        showRpcUrl(RpcUrl);
        wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance);
        //Reseting Everything to "Wrap"
        wrapUnwrapButton.value = "false";
        fromIcon.style.color = "rgb(219 39 119)";
        toIcon.style.color = "#000";
        document.getElementById('Wrap').style.color = "#8f8f8f";
        document.getElementById('Unwrap').style.color = "#383a3b";
        WrapBool = true;
        // If Amount From is NaN, or smaller than 1, We do not allow the user to Wrap. 
        if (Number(amountFrom.value) < 1 || !isNumber(Number(amountFrom.value))) {
            document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f";
            document.getElementById('WrapButton').style.cursor = "auto";
            document.getElementById('WrapButton').innerText = "Enter Amount";
            IsRealValue = false;
        }
        else {
            document.getElementById('WrapButton').style.backgroundColor = "#fd000f";
            document.getElementById('WrapButton').style.cursor = "pointer";
            IsRealValue = true;
            if (WrapBool == true) {
                document.getElementById('WrapButton').innerText = "Wrap";
            }
            else {
                document.getElementById('WrapButton').innerText = "Unwrap";
            }
        }
    }
    else {
        isFlare = false;
        wrapDataProvider.CheckNetwork(RpcUrl, isFlare);
        tokenIdentifier = 'SGB';
        wrappedTokenIdentifier = 'WSGB';
        document.getElementById('layer2').innerHTML = sgb_logo;
        document.getElementById('layer3').innerHTML = sgb_logo;
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
        showRpcUrl(RpcUrl);
        wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance);
        //Reseting Everything to "Wrap"
        wrapUnwrapButton.value = "false";
        fromIcon.style.color = "rgb(219 39 119)";
        toIcon.style.color = "#000";
        document.getElementById('Wrap').style.color = "#8f8f8f";
        document.getElementById('Unwrap').style.color = "#383a3b";
        WrapBool = true;
        // If Amount From is NaN, or smaller than 1, We do not allow the user to Wrap. 
        if (Number(amountFrom.value) < 1 || !isNumber(Number(amountFrom.value))) {
            document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f";
            document.getElementById('WrapButton').style.cursor = "auto";
            document.getElementById('WrapButton').innerText = "Enter Amount";
            IsRealValue = false;
        }
        else {
            document.getElementById('WrapButton').style.backgroundColor = "#fd000f";
            document.getElementById('WrapButton').style.cursor = "pointer";
            IsRealValue = true;
            if (WrapBool == true) {
                document.getElementById('WrapButton').innerText = "Wrap";
            }
            else {
                document.getElementById('WrapButton').innerText = "Unwrap";
            }
        }
    }
});
// Checking if Metamask is installed to determine if "ConnectWallet" should be clickable.
document.getElementById('ConnectWallet').addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    if (ConnectWalletBool == false) {
        ConnectWalletBool = true;
        wrapDataProvider.runWrapDataProvider(web3, provider, RpcUrl, isFlare, WrappedNativeContract, Account, Balance, TokenBalance);
        console.log(`Account `, Account, ` has `, Balance, ` tokens, and `, TokenBalance, ` wrapped tokens.`);
    }
    else {
        navigator.clipboard.writeText(document.getElementById('ConnectWallet').innerText);
        alert('Copied!');
    }
}));
