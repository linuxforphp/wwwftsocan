"use strict";
(() => {
    // dapp_claim.js
    var delegatedFtsoElement = document.getElementById('after');
    var distributionAbiLocal = distributionAbi
    var voterWhitelisterAbiLocal = voterWhitelisterAbi
    var ftsoRewardAbiLocal = ftsoRewardAbi
    var sgbLogo = '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>';
    var flrLogo = '<g id="layer1-2" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>';
    var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
    var wrappedTokenIdentifier = "W" + tokenIdentifier;
    var checkBox = document.getElementById("RewardsCheck");
    var icon = document.getElementById("Icon");
    var claimBool = false
    var fdClaimBool = false
    document.getElementById('layer3').innerHTML = flrLogo

    // show the current token identifiers

    function showTokenIdentifiers(wrappedToken) {
        document.getElementById('wrappedTokenIdentifier').innerText = wrappedToken;
    }

    // function to remove by id or class name

    const remove = (sel) => document.querySelectorAll(sel).forEach(el => el.remove());

    // switch claim button to claimable

    function switchButtonColor() {
        document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        claimBool = true;
        document.getElementById('ClaimButton').style.cursor = "pointer"
    }

    function switchButtonColorBack() {
        document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        claimBool = false;
        document.getElementById('ClaimButton').style.cursor = "auto"
    }

    function switchFdButtonColor() {
        document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        fdClaimBool = true;
        document.getElementById('ClaimFdButton').style.cursor = "pointer"
    }

    function switchFdButtonColorBack() {
        document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        fdClaimBool = false;
        document.getElementById('ClaimFdButton').style.cursor = "auto"
    }

    // show current rewards

    function showFdRewards(Rewards) {
        document.getElementById('ClaimFdButtonText').innerText = Rewards;
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

    // if network value is 1, FLR, if it is 2, SGB.
    function isNetworkValue(networkValue) {
        if (networkValue === 1 || networkValue === 4) {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = flrLogo

            showTokenIdentifiers(wrappedTokenIdentifier)
        } else {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = sgbLogo

            showTokenIdentifiers(wrappedTokenIdentifier)
        }
    }

    isNetworkValue(networkValue);
    showTokenIdentifiers(wrappedTokenIdentifier);

    selectedNetwork.onchange = async () => {
        rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
        chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
        networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

        if (networkValue === 1 || networkValue === 4) {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = flrLogo;

            showTokenIdentifiers(wrappedTokenIdentifier);
        } else {
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = 'W' + tokenIdentifier;
            document.getElementById('layer3').innerHTML = sgbLogo;

            showTokenIdentifiers(wrappedTokenIdentifier);
        }

        //Alert Metamask to switch

        if (!provider) {
            alert("MetaMask is not installed, please install it.");
        } else {
            console.log("isMetaMask=", provider.isMetaMask);
            try {
                await provider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{chainId: chainidhex}],
                })
            } catch (error) {
                console.log(error);
            }
        }

        //If we have already logged in the account, show new results, else, do nothing

        if (connectWalletBool === false) {
            if (!provider) {
                alert("MetaMask is not installed, please install it.");
            } else {
                console.log("isMetaMask=", provider.isMetaMask);
                let web32 = new Web3(rpcUrl);
                let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
                try {
                    const isUnlocked = isWalletUnlocked();
                    if (await isUnlocked !== "false") {
                        const SmartContracts = await flareContract.methods.getAllContracts().call();
                        const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                        const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

                        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                        const accounts = (await provider.send("eth_requestAccounts")).result;
                        const account = accounts[0];
                        showAccountAddress(account);
                        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                        showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                        console.log(`Account `, account, ` has `, tokenBalance, ` wrapped tokens.`);
                    } else {
                        alert("You are not connected!");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };

    // When the Connect Wallet button is clicked, we connect the wallet (duh), and if it
    // has already been clicked, we copy the public address to the clipboard.

    if (!provider) {
        alert("MetaMask is not installed, please install it.");
    } else {
        console.log("isMetaMask=", provider.isMetaMask);
        document.getElementById("ConnectWallet").addEventListener("click", async () => {
            if (connectWalletBool === false) {
                connectWalletBool = true;
                let web32 = new Web3(rpcUrl);
                let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
                try {
                    const SmartContracts = await flareContract.methods.getAllContracts().call();
                    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
                    const DistributionDelegatorsIndex = getKeyByValue(Object.values(SmartContracts)[0], "DistributionToDelegators");
                    const DistributionDelegatorsAddr = SmartContracts[1][DistributionDelegatorsIndex];
                    const ftsoRewardIndex = getKeyByValue(Object.values(SmartContracts)[0], "FtsoRewardManager");
                    const ftsoRewardAddr = SmartContracts[1][ftsoRewardIndex];
                    const voterWhitelistIndex = getKeyByValue(Object.values(SmartContracts)[0], "VoterWhitelister");
                    const voterWhitelistAddr = SmartContracts[1][voterWhitelistIndex];

                    let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);

                    let DistributionDelegatorsContract = new web32.eth.Contract(distributionAbiLocal, DistributionDelegatorsAddr);

                    let ftsoRewardContract = new web32.eth.Contract(ftsoRewardAbiLocal, ftsoRewardAddr);

                    let voterWhitelistContract = new web32.eth.Contract(voterWhitelisterAbiLocal, voterWhitelistAddr);

                    const accounts = (await provider.send("eth_requestAccounts")).result;
                    const account = accounts[0];
                    showAccountAddress(account);
                    const balance = await web32.eth.getBalance(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));

                    showFdRewards(0.0);
                    showRewards(0.0);

                    //Changing the color of Claim button

                    if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
                        switchButtonColor();
                    } else {
                        switchButtonColorBack();
                    }

                    if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1) {
                        switchButtonColor();
                    } else {
                        switchButtonColorBack();
                    }

                    remove(".wrapBoxFTSO");

                    // Getting which FTSO(s) the user has delegated to, the percentage of wnat he has
                    // delegated,and the logo of said FTSO(s).

                    const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();

                    const ftsoJsonList = JSON.stringify(ftsoList);

                    const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();

                    const delegatedFtsos = delegatesOfUser[0];

                    const BipsJson = delegatesOfUser[1];

                    const Bips = BipsJson[0] / 100n;

                    let insert = '';

                    fetch('https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json')
                        .then(res => res.json())
                        .then(FtsoInfo => {
                            for (var i = 0; i < delegatedFtsos.length; i++) {

                                let indexNumber;

                                if (ftsoJsonList.includes(delegatedFtsos[i]) || delegatedFtsos.length === 0) {
                                    for (var f = 0; f < FtsoInfo.providers.length; f++) {
                                        if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                                            indexNumber = f;

                                            insert += `<div class="wrapBoxFTSO"><div class="wrapBoxContent"><img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegatedIcon" id="delegatedIcon"/><div class="ftsoIdentifier"><span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span></div><div class="Wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
                                            delegatedFtsoElement.innerHTML = insert;
                                            console.log(`Ftso `, i, ` is valid!`);
                                            console.log(Bips);
                                            console.log(FtsoInfo.providers[indexNumber].name);
                                        }
                                    }
                                } else {
                                    alert('The FTSO you have delegated to is invalid!');
                                    break;
                                }
                            }
                        })

                    // Getting the unclaimed Rewards and affecting the Claim button

                    const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();

                    let unclaimedAmount = 0;

                    let l;

                    for (var k = 0; k < epochsUnclaimed.length; k++) {
                        l = await ftsoRewardContract.methods.getStateOfRewards(account, epochsUnclaimed[k]).call();
                        unclaimedAmount += Number(l[1]);
                    }

                    const convertedRewards = web32.utils.fromWei(unclaimedAmount, "ether");

                    console.log(`Ftso list: `, delegatedFtsos);

                    console.log(Number(epochsUnclaimed[0]));

                    let claimableAmountFd;

                    const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

                    for (var m = 0; m < claimableMonths.length; m++) {
                        claimableAmountFd += await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, Number(claimableMonths[m])).call();
                    }


                    var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

                    //Changing the color of Claim buttons

                    if (Number(round(convertedRewards)) >= 1 && Number(round(convertedRewards)) < bucketTotal) {
                        showRewards(round(convertedRewards));
                        switchButtonColor();
                    } else {
                        switchButtonColorBack();
                    }

                    var fdBucketTotal = await web32.eth.getBalance(DistributionDelegatorsAddr);

                    if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1 && Number(document.getElementById('ClaimFdButtonText').innerText) < fdBucketTotal) {
                        showFdRewards(String(round(web32.utils.fromWei(claimableAmountFd, "ether"))));
                        switchFdButtonColor();
                    } else {
                        switchFdButtonColorBack();
                    }

                    console.log(`Account `, account, ` has `, balance, ` tokens `, tokenBalance, ` wrapped tokens, and `, unclaimedAmount, ` unclaimed tokens.`);
                    console.log(`Smart contract list: `, SmartContracts);
                } catch (error) {
                    console.log(error);
                }
            } else {

                connectWalletBool = true;
                let web32 = new Web3(rpcUrl);
                let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
                try {
                    const SmartContracts = await flareContract.methods.getAllContracts().call();
                    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
                    const DistributionDelegatorsIndex = getKeyByValue(Object.values(SmartContracts)[0], "DistributionToDelegators");
                    const DistributionDelegatorsAddr = SmartContracts[1][DistributionDelegatorsIndex];
                    const ftsoRewardIndex = getKeyByValue(Object.values(SmartContracts)[0], "FtsoRewardManager");
                    const ftsoRewardAddr = SmartContracts[1][ftsoRewardIndex];
                    const voterWhitelistIndex = getKeyByValue(Object.values(SmartContracts)[0], "VoterWhitelister");
                    const voterWhitelistAddr = SmartContracts[1][voterWhitelistIndex];

                    let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);

                    let DistributionDelegatorsContract = new web32.eth.Contract(distributionAbiLocal, DistributionDelegatorsAddr);

                    let ftsoRewardContract = new web32.eth.Contract(ftsoRewardAbiLocal, ftsoRewardAddr);

                    let voterWhitelistContract = new web32.eth.Contract(voterWhitelisterAbiLocal, voterWhitelistAddr);

                    const accounts = (await provider.send("eth_requestAccounts")).result;
                    const account = accounts[0];
                    showAccountAddress(account);
                    const balance = await web32.eth.getBalance(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));

                    showFdRewards(0.0);
                    showRewards(0.0);

                    //Changing the color of Claim button

                    if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
                        switchButtonColor();
                    } else {
                        switchButtonColorBack();
                    }

                    if (Number(document.getElementById('ClaimFdButtonText').innerText) >= 1) {
                        switchButtonColor();
                    } else {
                        switchButtonColorBack();
                    }

                    remove(".wrapBoxFTSO");

                    // Getting which FTSO(s) the user has delegated to, the percentage of wnat he has
                    // delegated,and the logo of said FTSO(s).

                    const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();

                    const ftsoJsonList = JSON.stringify(ftsoList);

                    const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();

                    const delegatedFtsos = delegatesOfUser[0];

                    const BipsJson = delegatesOfUser[1];

                    const Bips = BipsJson[0] / 100n;

                    let insert = '';

                    fetch('https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json')
                        .then(res => res.json())
                        .then(FtsoInfo => {
                            for (var i = 0; i < delegatedFtsos.length; i++) {

                                let indexNumber;

                                if (ftsoJsonList.includes(delegatedFtsos[i]) || delegatedFtsos.length === 0) {
                                    for (var f = 0; f < FtsoInfo.providers.length; f++) {
                                        if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                                            indexNumber = f;

                                            insert += `<div class="wrapBoxFTSO" data-addr"${delegatedFtsos[i]}"><div class="wrapBoxContent"><img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegatedIcon" id="delegatedIcon"/><div class="ftsoIdentifier"><span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span></div><div class="Wrapper"><span id="TokenBalance">${Bips}%</span></div></div></div>`;
                                            delegatedFtsoElement.innerHTML = insert;
                                            console.log(`Ftso `, i, ` is valid!`);
                                            console.log(Bips);
                                            console.log(FtsoInfo.providers[indexNumber].name);
                                        }
                                    }
                                } else {
                                    alert('The FTSO you have delegated to is invalid!');
                                    break;
                                }
                            }
                        })

                    // Getting the unclaimed Rewards and affecting the Claim button

                    const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();

                    let unclaimedAmount = 0;

                    let l;

                    for (var k = 0; k < epochsUnclaimed.length; k++) {
                        l = await ftsoRewardContract.methods.getStateOfRewards(account, epochsUnclaimed[k]).call();
                        unclaimedAmount += Number(l[1])
                    }

                    const convertedRewards = web32.utils.fromWei(unclaimedAmount, "ether");

                    console.log(`Ftso list: `, delegatedFtsos);

                    console.log(Number(epochsUnclaimed[0]));

                    var claimableAmountFd;

                    const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

                    for (var m = 0; m < claimableMonths.length; m++) {
                        claimableAmountFd += await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, claimableMonths[m]).call();
                    }

                    var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

                    var fdBucketTotal = await web32.eth.getBalance(DistributionDelegatorsAddr);

                    //Changing the color of Claim buttons

                    if (Number(round(convertedRewards)) >= 1 && Number(round(convertedRewards)) < bucketTotal) {
                        showRewards(round(convertedRewards));
                        switchButtonColor();
                    } else {
                        showRewards(0.0);
                        switchButtonColorBack();
                    }

                    if (Number(round(web32.utils.fromWei(claimableAmountFd, "ether"))) >= 1 && Number(round(web32.utils.fromWei(claimableAmountFd, "ether"))) < fdBucketTotal) {
                        showFdRewards(String(round(web32.utils.fromWei(claimableAmountFd, "ether"))));
                        switchFdButtonColor();
                    } else {
                        showFdRewards(0.0);
                        switchFdButtonColorBack();
                    }

                    console.log(`Account `, account, ` has `, balance, ` tokens `, tokenBalance, ` wrapped tokens, and `, unclaimedAmount, ` unclaimed tokens.`);
                    console.log(`Smart contract list: `, SmartContracts);
                } catch (error) {
                    console.log(error);
                }
            }
        });
        provider.on("accountsChanged", function (accounts, balance, tokenBalance) {
            console.log("accountsChanged", accounts, balance, tokenBalance);
            const account = accounts[0];
            showAccountAddress(account);
            showTokenBalance(round(web3.utils.fromWei(tokenBalance, "ether")));
        });
    }

    provider.on("accountsChanged", async (accounts) => {
        console.log("accountsChanged");
        if (accounts.length !== 0) {
            let web32 = new Web3(rpcUrl);
            let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
            try {
                const SmartContracts = await flareContract.methods.getAllContracts().call();
                const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

                const account = accounts[0];
                showAccountAddress(account);
                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } catch (error) {
                console.log(error)
            }
        } else {
            document.getElementById("ConnectWalletText").innerText = 'Connect Wallet'
            showTokenBalance(0.0);
            showRewards(0.0);
            showFdRewards(0.0);
            switchButtonColorBack();
            switchFdButtonColorBack();
            connectWalletBool = false
        }
    });

    if (!provider) {
        alert("MetaMask is not installed, please install it.");
    } else {
        console.log("isMetaMask=", provider.isMetaMask);
        document.getElementById("ClaimButton").addEventListener("click", async () => {
            let web32 = new Web3(rpcUrl);
            let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
            try {
                const accounts = (await provider.send("eth_requestAccounts")).result;
                const account = accounts[0];

                const SmartContracts = await flareContract.methods.getAllContracts().call();
                const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                const ftsoRewardIndex = getKeyByValue(Object.values(SmartContracts)[0], "FtsoRewardManager");
                const ftsoRewardAddr = SmartContracts[1][ftsoRewardIndex];
                let ftsoRewardContract = new web32.eth.Contract(ftsoRewardAbiLocal, ftsoRewardAddr);

                const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();

                var transactionParameters

                for (var p = 0; p < epochsUnclaimed.length; p++) {
                    if (checkBox.checked) {
                        transactionParameters = {
                            from: account,
                            to: ftsoRewardAddr,
                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[p]), true).encodeABI(),
                        };
                    } else {
                        transactionParameters = {
                            from: account,
                            to: ftsoRewardAddr,
                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[p]), false).encodeABI(),
                        };
                    }

                    await provider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    });
                }

                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                showRewards(0.0);
                switchButtonColorBack();
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } catch (error) {
                console.log(error);
            }
        })
    }

    if (!provider) {
        alert("MetaMask is not installed, please install it.");
    } else {
        console.log("isMetaMask=", provider.isMetaMask);
        document.getElementById("ClaimFdButton").addEventListener("click", async () => {
            let web32 = new Web3(rpcUrl);
            let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
            try {
                const accounts = (await provider.send("eth_requestAccounts")).result;
                const account = accounts[0];

                const SmartContracts = await flareContract.methods.getAllContracts().call();
                const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

                let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

                const DistributionDelegatorsIndex = getKeyByValue(Object.values(SmartContracts)[0], "DistributionToDelegators");
                const DistributionDelegatorsAddr = SmartContracts[1][DistributionDelegatorsIndex];
                let DistributionDelegatorsContract = new web32.eth.Contract(distributionAbiLocal, DistributionDelegatorsAddr);

                const ClaimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

                var transactionParameters

                for (var i = 0; i < ClaimableMonths.length; i++) {
                    if (checkBox.checked) {
                        transactionParameters = {
                            from: account,
                            to: DistributionDelegatorsAddr,
                            data: DistributionDelegatorsContract.methods.claim(account, account, ClaimableMonths[i], true).encodeABI(),
                        };
                    } else {
                        transactionParameters = {
                            from: account,
                            to: DistributionDelegatorsAddr,
                            data: DistributionDelegatorsContract.methods.claim(account, account, ClaimableMonths[i], false).encodeABI(),
                        };
                    }

                    await provider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                }

                showFdRewards(0.0);
                switchFdButtonColorBack();
                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } catch (error) {
                console.log(error);
            }
        })
    }
})();
