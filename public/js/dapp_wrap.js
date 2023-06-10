const provider = window.ethereum;
const selectedNetwork = document.getElementById('SelectedNetwork');
const ercAbi = human_standard_token_abi
const sgbLogo = '<polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon>'
const flrLogo = '<path d="M22.36,180.09a22.37,22.37,0,1,0,22.37,22.37A22.36,22.36,0,0,0,22.36,180.09ZM0,43.31a1.53,1.53,0,0,0,1.54,1.57H179.51A44.88,44.88,0,0,0,224.37,1.57,1.53,1.53,0,0,0,222.83,0h-178A44.87,44.87,0,0,0,0,43.31Zm0,90.05a1.53,1.53,0,0,0,1.54,1.57H112.34A44.89,44.89,0,0,0,157.2,91.62a1.53,1.53,0,0,0-1.54-1.57H44.88A44.87,44.87,0,0,0,0,133.36Z"></path>'
let tokenIdentifier = 'FLR';
let wrappedTokenIdentifier = 'WFLR';
let rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
let wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
let networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
document.getElementById('layer1-2').innerHTML = flrLogo
document.getElementById('layer1-3').innerHTML = flrLogo

// set the correct Address based on chosen network
    
function showRpcUrl(rpcAddress) {
     document.getElementById('rpcAddress').innerText = rpcAddress;
}

function showTokenIdentifiers(Token, WrappedToken) {
    document.getElementById('tokenIdentifier').innerText = Token;
    document.getElementById('wrappedTokenIdentifier').innerText = WrappedToken;
}

if (networkValue == 1) {
    rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
    wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
    tokenIdentifier = 'FLR';
    wrappedTokenIdentifier = 'WFLR';
    document.getElementById('layer1-2').innerHTML = flrLogo
    document.getElementById('layer1-3').innerHTML = flrLogo

    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
    showRpcUrl(rpcUrl);
} else {
    rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
    wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';
    tokenIdentifier = 'SGB';
    wrappedTokenIdentifier = 'WSGB';
    document.getElementById('layer1-2').innerHTML = sgbLogo
    document.getElementById('layer1-3').innerHTML = sgbLogo

    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
    showRpcUrl(rpcUrl);
}

showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
showRpcUrl(rpcUrl);

selectedNetwork.onchange = () => {

    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
        
    if (networkValue == 1) {
        rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
        wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
        tokenIdentifier = 'FLR';
        wrappedTokenIdentifier = 'WFLR';
        document.getElementById('layer1-2').innerHTML = flrLogo
        document.getElementById('layer1-3').innerHTML = flrLogo

        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        showRpcUrl(rpcUrl);
    } else {
        rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
        wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';
        tokenIdentifier = 'SGB';
        wrappedTokenIdentifier = 'WSGB';
        document.getElementById('layer1-2').innerHTML = sgbLogo
        document.getElementById('layer1-3').innerHTML = sgbLogo

        showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier)
        showRpcUrl(rpcUrl);
    }
}

// Checking if Metamask is installed

if (!provider) {
    alert('MetaMask is not installed, please install it.');
} else {
    console.log('isMetaMask=', provider.isMetaMask);
    // A) Set provider in web3.js
     // B) Use provider object directly
     document.getElementById('ConnectWallet').addEventListener('click', async () => {
        let web3 = new Web3(rpcUrl);
        let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
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
            console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
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
    function showAccountAddress(address) {
        document.getElementById('address').innerText = address;
    }

    function showBalance(balanceAddress) {
        document.getElementById('Balance').innerText = balanceAddress;
    }

    function showTokenBalance(tokenBalanceAddress) {
        document.getElementById('TokenBalance').innerText = tokenBalanceAddress;
    }

    // Wrap-Unwrap Button

    document.getElementById('wrapUnwrap').addEventListener('click', async () => {
        
    });

}