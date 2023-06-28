const provider = window.ethereum;
const selectedNetwork = document.getElementById('SelectedNetwork');
const delegatedFtsoElement = document.getElementById('after');
const ercAbi = human_standard_token_abi
const wnatAbi = wnat_flare_abi
const flrAbi = flare_abi
const voterWhitelisterAbi = voter_whitelister_abi
const csmAbi = claim_setup_abi
const ftsoRewardAbi = ftso_reward_abi
const sgbLogo = '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>'
const flrLogo = '<g id="layer1-3" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>'

//By default, the FLR settings will be loaded. Later we will check the dropdown to see
//which one is *actually* loaded, but by default it will be FLR. 

let tokenIdentifier = 'FLR';
let wrappedTokenIdentifier = 'WFLR';
let rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
let wrappedTokenAddr

//We call the FlareContractRegistry contract from the blockchain

let flrAddr = '0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019'

//Network value (if it has a value of 1) represents Flare, if not, it represents Songbird

let networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;

//These are calls for the svg classes to change the color on click of "Wrap/Unwrap"

let icon = document.getElementById("Icon");
document.getElementById('layer3').innerHTML = flrLogo

// set the correct Address based on chosen network
    
function showRpcUrl(rpcAddress) {
    document.getElementById('rpcAddress').innerText = rpcAddress;
}

function showTokenIdentifiers(WrappedToken) {
   document.getElementById('wrappedTokenIdentifier').innerText = WrappedToken;
}

function showAccountAddress(address) {
    document.getElementById('ConnectWallet').innerText = address;
}

// function showBalance(balanceAddress) {
//     document.getElementById('Balance').innerText = balanceAddress;
// }

function showTokenBalance(tokenBalanceAddress) {
    document.getElementById('TokenBalance').innerText = tokenBalanceAddress;
}

function round(num) {
    return +(Math.round(num + "e+4")  + "e-4");
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

if (networkValue == 1) {
    rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
    wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
    tokenIdentifier = 'FLR';
    wrappedTokenIdentifier = 'WFLR';
    document.getElementById('layer3').innerHTML = flrLogo
    
    showTokenIdentifiers(wrappedTokenIdentifier)
    showRpcUrl(rpcUrl);
} else {
    rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
    wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';
    tokenIdentifier = 'SGB';
    wrappedTokenIdentifier = 'WSGB';
    document.getElementById('layer3').innerHTML = sgbLogo
    
    showTokenIdentifiers(wrappedTokenIdentifier)
    showRpcUrl(rpcUrl);
}

// Reshowing RPC, token identifiers, and checking if the input field is valid, just in case.

showTokenIdentifiers(wrappedTokenIdentifier)
showRpcUrl(rpcUrl);

//When the network is changed, we switch every value accordingly, and check if metamask is unlocked

selectedNetwork.onchange = async () => {

    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;

    if (networkValue == 1) {
        rpcUrl = 'https://flare-api.flare.network/ext/C/rpc';
        wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
        tokenIdentifier = 'FLR';
        wrappedTokenIdentifier = 'WFLR';
        document.getElementById('layer3').innerHTML = flrLogo
        
        showTokenIdentifiers(wrappedTokenIdentifier)
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
                        
                    // showBalance(web3.utils.fromWei(balance, "ether"))

                    //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                    
                    const convertedTokenBalance = web3.utils.fromWei(tokenBalance, "ether")

                    showTokenBalance(round(convertedTokenBalance))
                    console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
                } else {
                    alert('You are not connected!')
                }
            } catch (error) {
                // User denied or Error
                console.log(error);
            }
        }
    } else {
        rpcUrl = 'https://songbird-api.flare.network/ext/bc/C/rpc';
        wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';
        tokenIdentifier = 'SGB';
        wrappedTokenIdentifier = 'WSGB';
        document.getElementById('layer3').innerHTML = sgbLogo
        
        showTokenIdentifiers(wrappedTokenIdentifier)
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
                        
                    // showBalance(web3.utils.fromWei(balance, "ether"))

                    //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                    const convertedTokenBalance = web3.utils.fromWei(tokenBalance, "ether")

                    showTokenBalance(round(convertedTokenBalance))
                    console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);
                } else {
                    alert('You are not connected!')
                }
            } catch (error) {
                // User denied or Error
                console.log(error);
            }
        }
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
        let flareContract = new web3.eth.Contract(flrAbi, flrAddr);

        const SmartContracts = await flareContract.methods.getAllContracts().call();
        const contractList = SmartContracts[1];
        let ftsoRewardAddr
        let csmAddr
        let voterWhitelisterAddr

        if (rpcUrl == 'https://flare-api.flare.network/ext/C/rpc') {
        //    ftsoRewardAddr = contractList[13]
            ftsoRewardAddr = '0x13F7866568dC476cC3522d17C23C35FEDc1431C5'
        
        //    csmAddr = contractList[21];
            csmAddr = '0xD56c0Ea37B848939B59e6F5Cda119b3fA473b5eB'

            voterWhitelisterAddr = '0x072A199670fAD8883c7A92D108dFA56828EfCE87'

            wrappedTokenAddr = '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d';
        } else {
        //    ftsoRewardAddr = contractList[0]
        ftsoRewardAddr = '0x85627d71921AE25769f5370E482AdA5E1e418d37'

        //    csmAddr = contractList[18];
            csmAddr = '0xDD138B38d87b0F95F6c3e13e78FFDF2588F1732d'

            voterWhitelisterAddr = '0x6Ce15a3aDd04d1A4C575B6be19674D6bb11Ba614'
            
            wrappedTokenAddr = '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED';

        }

        let ftsoRewardContract = new web3.eth.Contract(ftsoRewardAbi, ftsoRewardAddr);
        let csmContract = new web3.eth.Contract(csmAbi, csmAddr);
        let voterWhitelisterContract = new web3.eth.Contract(voterWhitelisterAbi, voterWhitelisterAddr);
        let tokenContract = new web3.eth.Contract(ercAbi, wrappedTokenAddr);
        let wnatContract = new web3.eth.Contract(wnatAbi, wrappedTokenAddr)

        try {
             
             // Request account access if needed
             const accounts = (await provider.send('eth_requestAccounts')).result;
             // Accounts now exposed, use them
             const account = accounts[0] // We currently only ever provide a single account,
                                         // but the array gives us some room to grow.
             showAccountAddress(account);

             //Request balance from the Blockchain

             const balance = await web3.eth.getBalance(account);
                
            //  showBalance(web3.utils.fromWei(balance, "ether"))

             //Request ERC-20 token balance (WFLR or WSGB) from the Blockchain

             const tokenBalance = await tokenContract.methods.balanceOf(account).call();

             const convertedTokenBalance = web3.utils.fromWei(tokenBalance, "ether")

             showTokenBalance(round(convertedTokenBalance))

             const ftsoList = await voterWhitelisterContract.methods.getFtsoWhitelistedPriceProviders(0).call();

             const ftsoJsonList = JSON.stringify(ftsoList)

             const delegatesOfUser = await wnatContract.methods.delegatesOf(account).call();

             const delegatedFtsos = delegatesOfUser[0]

             var insert = '';

             if (delegatedFtsos.length == 0) {
                alert('The FTSO you have delegated to is invalid!');
             }

             for (var i = 0; i < delegatedFtsos.length; i++ ) {

                if (ftsoJsonList.includes(delegatedFtsos[i])) {
                    insert += `<div class="wrapBox"><img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" class="delegatedIcon" id="delegatedIcon"/><div class="tokenIdentifier"><span id="delegatedName"></span></div></div>`;
                    delegatedFtsoElement.innerHTML = insert;
                    console.log(`Ftso `, i,` is valid!`)
                } else {
                    alert('The FTSO you have delegated to is invalid!');

                    break
                }
            }
             
            console.log(`Account `, account,` has `, balance,` tokens, and `, tokenBalance,` wrapped tokens.`);

            console.log(`Ftso list: `, delegatedFtsos);
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
        // showBalance(balance);
        showTokenBalance(tokenBalance);
    });
}