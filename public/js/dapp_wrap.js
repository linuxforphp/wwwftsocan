const provider = window.ethereum;
const selectedNetwork = document.getElementById('SelectedNetwork');
const ercAbi = human_standard_token_abi
const flrAbi = flare_abi
const sgbLogo = '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>'
const flrLogo = '<g id="layer1-2" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>'

//By default, the FLR settings will be loaded. Later we will check the dropdown to see
//which one is *actually* loaded, but by default it will be FLR. 

let tokenIdentifier = 'FLR';
let wrappedTokenIdentifier = 'WFLR';
let rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
let wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';

//We call the FlareContractRegistry contract from the blockchain

let flrAddr = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019'

//Network value (if it has a value of 1) represents Flare, if not, it represents Songbird

let networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;

//If wrapbool is true, The "Wrap" contract will be executed, if it is false, "Unwrap" will be executed.

let WrapBool = true

//if isrealvalue is true, the "Wrap" button will be clickable, if not, it will not.

let IsRealValue = false

//These are calls for the svg classes to change the color on click of "Wrap/Unwrap"

let fromIcon = document.getElementById("FromIcon");
let toIcon = document.getElementById("ToIcon");
document.getElementById('layer2').innerHTML = flrLogo
document.getElementById('layer3').innerHTML = flrLogo

// set the correct Address based on chosen network
    
function showRpcUrl(rpcAddress) {
     document.getElementById('rpcAddress').innerText = rpcAddress;
}

function showTokenIdentifiers(Token, WrappedToken) {
    document.getElementById('tokenIdentifier').innerText = Token;
    document.getElementById('wrappedTokenIdentifier').innerText = WrappedToken;
}

// Switching everything on click of Wrap/Unwrap

async function switchIconColor() {

    if (document.getElementById('wrapUnwrap').value != "true") {
        document.getElementById('wrapUnwrap').value = "true"
        fromIcon.style.color = "#000"
        toIcon.style.color = "rgb(219 39 119)"
        document.getElementById('Wrap').style.color = "#383a3b"
        document.getElementById('Unwrap').style.color = "#8f8f8f"
        showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier)
        WrapBool = false


        if (!provider) {
            alert('MetaMask is not installed, please install it.');
        } else {
            console.log('isMetaMask=', provider.isMetaMask);

            let web3 = new Web3(rpcUrl);
            let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
            try {

                // Here we are not asking for the account, because it should already be in cache if the
                // the wallet is unlocked.

                const isUnlocked = isWalletUnlocked();

                if (isUnlocked != "false") {

                    const accounts = (await provider.send('eth_requestAccounts')).result;
                
                    const account = accounts[0] // We currently only ever provide a single account,
                                                // but the array gives us some room to grow.
                    showAccountAddress(account);

                    //Request balance from the Blockchain

                    const balance = await web3.eth.getBalance(account);

                    //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                    showTokenBalance(web3.utils.fromWei(balance, "ether"))
                    showBalance(web3.utils.fromWei(tokenBalance, "ether"))
                    console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
                } else {
                    alert('You are not connected!')
                }
            }catch (error) {
                // User denied or Error
                console.log(error);
        }
    }
    if (document.getElementById('AmountFrom').value < 1 | !isNumber(document.getElementById('AmountFrom').value)) {
        document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f"
        document.getElementById('WrapButton').style.cursor = "auto"
        document.getElementById('WrapButton').innerText = "Enter Amount"
        IsRealValue = false
    } else {
        document.getElementById('WrapButton').style.backgroundColor = "#fd000f"
        document.getElementById('WrapButton').style.cursor = "pointer"
        IsRealValue = true
        if (WrapBool == true) {
            document.getElementById('WrapButton').innerText = "Wrap"
        } else {
            document.getElementById('WrapButton').innerText = "Unwrap"
        }
    }
    } else {
        document.getElementById('wrapUnwrap').value = "false"
        fromIcon.style.color = "rgb(219 39 119)"
        toIcon.style.color = "#000"
        document.getElementById('Wrap').style.color = "#8f8f8f"
        document.getElementById('Unwrap').style.color = "#383a3b"
        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        WrapBool = true

        if (!provider) {
            alert('MetaMask is not installed, please install it.');
        } else {
            console.log('isMetaMask=', provider.isMetaMask);

            let web3 = new Web3(rpcUrl);
            let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
            try {

                // Here we are not asking for the account, because it should already be in cache if the
                // the wallet is unlocked.

                const isUnlocked = isWalletUnlocked();

                if (isUnlocked != "false") {

                    const accounts = (await provider.send('eth_requestAccounts')).result;
                
                    const account = accounts[0] // We currently only ever provide a single account,
                                                // but the array gives us some room to grow.
                    showAccountAddress(account);

                    //Request balance from the Blockchain

                    const balance = await web3.eth.getBalance(account);

                    //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                    showTokenBalance(web3.utils.fromWei(tokenBalance, "ether"))
                    showBalance(web3.utils.fromWei(balance, "ether"))
                    console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
                } else {
                    alert('You are not connected!')
                }
            }catch (error) {
                // User denied or Error
                console.log(error);
        }
    }    
    if (document.getElementById('AmountFrom').value < 1 | !isNumber(document.getElementById('AmountFrom').value)) {
        document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f"
        document.getElementById('WrapButton').style.cursor = "auto"
        document.getElementById('WrapButton').innerText = "Enter Amount"
        IsRealValue = false
    } else {
        document.getElementById('WrapButton').style.backgroundColor = "#fd000f"
        document.getElementById('WrapButton').style.cursor = "pointer"
        IsRealValue = true
        if (WrapBool == true) {
            document.getElementById('WrapButton').innerText = "Wrap"
        } else {
            document.getElementById('WrapButton').innerText = "Unwrap"
        }
    }
}
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

//Checking if Metamask wallet is unlocked

async function isWalletUnlocked() {
    const Web3provider = new ethers.providers.Web3Provider(window.ethereum);

    let unlocked;

    try {
        const accounts = await Web3provider.listAccounts();

        unlocked = accounts.length > 0;
    } catch (e) {
        unlocked = false;
    }

    return unlocked;
}

//Checking if the "AmountFrom" input is greater than 1

function isInput() {
    if (document.getElementById('AmountFrom').value < 1 | !isNumber(document.getElementById('AmountFrom').value)) {
        document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f"
        document.getElementById('WrapButton').style.cursor = "auto"
        document.getElementById('WrapButton').innerText = "Enter Amount"
        IsRealValue = false
    } else {
        document.getElementById('WrapButton').style.backgroundColor = "#fd000f"
        document.getElementById('WrapButton').style.cursor = "pointer"
        IsRealValue = true
        if (WrapBool == true) {
            document.getElementById('WrapButton').innerText = "Wrap"
        } else {
            document.getElementById('WrapButton').innerText = "Unwrap"
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
    if (isNumber(document.getElementById('AmountFrom').value)) {
        document.getElementById('AmountTo').value = document.getElementById('AmountFrom').value
    } else {
        document.getElementById('AmountTo').value = null
    }

}

if (networkValue == 1) {
    rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
    wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
    tokenIdentifier = 'FLR';
    wrappedTokenIdentifier = 'WFLR';
    document.getElementById('layer2').innerHTML = flrLogo
    document.getElementById('layer3').innerHTML = flrLogo

    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
    showRpcUrl(rpcUrl);
} else {
    rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
    wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';
    tokenIdentifier = 'SGB';
    wrappedTokenIdentifier = 'WSGB';
    document.getElementById('layer2').innerHTML = sgbLogo
    document.getElementById('layer3').innerHTML = sgbLogo

    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
    showRpcUrl(rpcUrl);
}

// Reshowing RPC and token identifiers, just in case.

showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
showRpcUrl(rpcUrl);

//When the network is changed, we switch every value accordingly, and check if metamask is unlocked

selectedNetwork.onchange = async () => {

    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
        
    if (networkValue == 1) {
        rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
        wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
        tokenIdentifier = 'FLR';
        wrappedTokenIdentifier = 'WFLR';
        document.getElementById('layer2').innerHTML = flrLogo
        document.getElementById('layer3').innerHTML = flrLogo

        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        showRpcUrl(rpcUrl);

        // Getting Balance from switched Network if metamask is installed

        if (!provider) {
            alert('MetaMask is not installed, please install it.');
        } else {
            console.log('isMetaMask=', provider.isMetaMask);

            let web3 = new Web3(rpcUrl);
            let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
            try {

                // Here we are not asking for the account, because it should already be in cache if the
                // the wallet is unlocked.

                const isUnlocked = isWalletUnlocked();

                if (isUnlocked != "false") {

                    const accounts = (await provider.send('eth_requestAccounts')).result;
                
                    const account = accounts[0] // We currently only ever provide a single account,
                                                // but the array gives us some room to grow.
                    showAccountAddress(account);

                    //Request balance from the Blockchain

                    const balance = await web3.eth.getBalance(account);
                        
                    showBalance(web3.utils.fromWei(balance, "ether"))

                    //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                    showTokenBalance(web3.utils.fromWei(tokenBalance, "ether"))
                    console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
                } else {
                    alert('You are not connected!')
                }
            } catch (error) {
                // User denied or Error
                console.log(error);
            }
        }

        //Reseting Everything to "Wrap"

        document.getElementById('wrapUnwrap').value = "false"
        fromIcon.style.color = "rgb(219 39 119)"
        toIcon.style.color = "#000"
        document.getElementById('Wrap').style.color = "#8f8f8f"
        document.getElementById('Unwrap').style.color = "#383a3b"
        WrapBool = true
        if (document.getElementById('AmountFrom').value < 1 | !isNumber(document.getElementById('AmountFrom').value)) {
            document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f"
            document.getElementById('WrapButton').style.cursor = "auto"
            document.getElementById('WrapButton').innerText = "Enter Amount"
            IsRealValue = false
        } else {
            document.getElementById('WrapButton').style.backgroundColor = "#fd000f"
            document.getElementById('WrapButton').style.cursor = "pointer"
            IsRealValue = true
            if (WrapBool == true) {
                document.getElementById('WrapButton').innerText = "Wrap"
            } else {
                document.getElementById('WrapButton').innerText = "Unwrap"
            }
        }
    } else {
        rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
        wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';
        tokenIdentifier = 'SGB';
        wrappedTokenIdentifier = 'WSGB';
        document.getElementById('layer2').innerHTML = sgbLogo
        document.getElementById('layer3').innerHTML = sgbLogo

        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        showRpcUrl(rpcUrl);

        //Same here

        if (!provider) {
            alert('MetaMask is not installed, please install it.');
        } else {
            console.log('isMetaMask=', provider.isMetaMask);

            let web3 = new Web3(rpcUrl);
            let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
            try {

                // Here we are not asking for the account, because it should already be in cache if the
                // "connectWallet" button has been pressed.

                const isUnlocked = isWalletUnlocked();

                if (isUnlocked != "false") {

                    const accounts = (await provider.send('eth_requestAccounts')).result;
                    
                    const account = accounts[0] // We currently only ever provide a single account,
                                                // but the array gives us some room to grow.
                    showAccountAddress(account);

                    //Request balance from the Blockchain

                    const balance = await web3.eth.getBalance(account);
                        
                    showBalance(web3.utils.fromWei(balance, "ether"))

                    //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                    showTokenBalance(web3.utils.fromWei(tokenBalance, "ether"))
                    console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
                } else {
                    alert('You are not connected!')
                }
            } catch (error) {
                // User denied or Error
                console.log(error);
            }
        }
        //Reseting Everything to "Wrap"

        document.getElementById('wrapUnwrap').value = "false"
        fromIcon.style.color = "rgb(219 39 119)"
        toIcon.style.color = "#000"
        document.getElementById('Wrap').style.color = "#8f8f8f"
        document.getElementById('Unwrap').style.color = "#383a3b"
        WrapBool = true
        if (document.getElementById('AmountFrom').value < 1 | !isNumber(document.getElementById('AmountFrom').value)) {
            document.getElementById('WrapButton').style.backgroundColor = "#8f8f8f"
            document.getElementById('WrapButton').style.cursor = "auto"
            document.getElementById('WrapButton').innerText = "Enter Amount"
            IsRealValue = false
        } else {
            document.getElementById('WrapButton').style.backgroundColor = "#fd000f"
            document.getElementById('WrapButton').style.cursor = "pointer"
            IsRealValue = true
            if (WrapBool == true) {
                document.getElementById('WrapButton').innerText = "Wrap"
            } else {
                document.getElementById('WrapButton').innerText = "Unwrap"
            }
        }
    }
}

// Checking if Metamask is installed to determine if "ConnectWallet" should be clickable.

if (!provider) {
    alert('MetaMask is not installed, please install it.');
} else {
    console.log('isMetaMask=', provider.isMetaMask);
    // A) Set provider in web3.js
     // B) Use provider object directly
     document.getElementById('ConnectWallet').addEventListener('click', async () => {
        let web3 = new Web3(rpcUrl);
        let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
        let flareContract = new web3.eth.Contract(flrAbi, flrAddr);
        try {
             
             // Request account access if needed
             const accounts = (await provider.send('eth_requestAccounts')).result;
             // Accounts now exposed, use them
             const account = accounts[0] // We currently only ever provide a single account,
                                         // but the array gives us some room to grow.
             showAccountAddress(account);

             //Request balance from the Blockchain

             const balance = await web3.eth.getBalance(account);
                
             showBalance(web3.utils.fromWei(balance, "ether"))

             //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

             const tokenBalance = await tokenContract.methods.balanceOf(account).call();

             showTokenBalance(web3.utils.fromWei(tokenBalance, "ether"))

             const SmartContracts = await flareContract.methods.getAllContracts().call();
             
            console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
            console.log(`Smart contract list: `, SmartContracts);
             // Send ETH
             // provider.send(
             //     'eth_sendTransaction',
             //     [{
            //         from: account,
             //         to: account,
             //         gas: "0x76c0", // 30400
             //         gasPrice: '0x9184e72a',
             //         value: '0x9184e72a000', // 10000000000000 wei = 0.00001 ETH
             //         data: '0x123'
             //     }]
             // );
        } catch (error) {
            // User denied or Error
            console.log(error);
        }
    });
    provider.on('accountsChanged', function (accounts, balance, tokenBalance) {
        console.log('accountsChanged', accounts, balance, tokenBalance);
        const account = accounts[0];
        showAccountAddress(account);
        showBalance(balance);
        showTokenBalance(tokenBalance);
    });
}

// Wrap-Unwrap Button

document.getElementById('wrapUnwrap').addEventListener('click', async () => {
    switchIconColor();
});

//Wrap tokens button
document.querySelector("#AmountFrom").addEventListener("input", isInput);
document.querySelector("#AmountFrom").addEventListener("input", copyInput);