const provider = window.ethereum;
const selectedNetwork = document.getElementById('SelectedNetwork');
const ercAbi = human_standard_token_abi
let rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
let wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
let networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
    
function showRpcUrl(rpcAddress) {
     document.getElementById('rpcAddress').innerText = rpcAddress;
}

if (networkValue == 1) {
    rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
    wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';

     showRpcUrl(rpcUrl);
} else {
     rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
     wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';

     showRpcUrl(rpcUrl);
}

showRpcUrl(rpcUrl);

selectedNetwork.onchange = () => {

    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
        
    if (networkValue == 1) {
         rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
         wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';

        showRpcUrl(rpcUrl);
    } else {
        rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
        wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';

        showRpcUrl(rpcUrl);
    }
}

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

             const balance = await web3.eth.getBalance(account);
                
             showBalance(balance)

             const tokenBalance = await tokenContract.methods.balanceOf(account).call();

             showTokenBalance(tokenBalance)
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
}