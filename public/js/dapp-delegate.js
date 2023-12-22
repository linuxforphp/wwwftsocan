"use strict";

(() => {
    // dapp_claim.js
    var dappUrlBaseAddr = document.getElementById("MainSection").getAttribute('data-urlbaseaddr');
    var voterWhitelisterAbiLocal = voterWhitelisterAbi;
    var ftso1 = document.getElementById("ftso-1");
    var ftso2 = document.getElementById("ftso-2");
    var isRealValue = false;
    // var icon = document.getElementById("Icon");
    var claimBool = false;
    var amount1 = document.getElementById("Amount1");
    var amount2 = document.getElementById("Amount2");
    var isAmount2Active = false;

    // When the Connect Wallet button is clicked, we connect the wallet, and if it
    // has already been clicked, we copy the public address to the clipboard.
    if (!provider && downloadMetamaskFlag === false) {
        downloadMetamaskFlag = true;
        downloadMetamask();
    } else {
        document.getElementById("ConnectWallet").addEventListener("click", async () => {
            if (connectWalletBool === false) {
                connectWalletBool = true;
                let web32 = new Web3(rpcUrl);
                let flareContract = new web32.eth.Contract(flrAbi, flrAddr);

                try {
                    const SmartContracts = await flareContract.methods.getAllContracts().call();
                    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
                    let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);
                    const accounts = (await provider.send("eth_requestAccounts")).result;
                    const account = accounts[0];
                    showAccountAddress(account);
                    const balance = await web32.eth.getBalance(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                } catch (error) {
                    // console.log(error);
                }
            } else {
                navigator.clipboard.writeText(document.getElementById("ConnectWalletText").innerText);
                connectWalletBool = true;
                let web32 = new Web3(rpcUrl);
                let flareContract = new web32.eth.Contract(flrAbi, flrAddr);

                try {
                    const SmartContracts = await flareContract.methods.getAllContracts().call();
                    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
                    let tokenContract = new web32.eth.Contract(wnatAbi, wrappedTokenAddr);
                    const accounts = (await provider.send("eth_requestAccounts")).result;
                    const account = accounts[0];
                    showAccountAddress(account);
                    const balance = await web32.eth.getBalance(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                } catch (error) {
                    // console.log(error);
                }
            }
        });
    }

    if (typeof accounts !== 'undefined' && accounts !== []) {
        provider.on("accountsChanged", async (accounts) => {
            if (accounts.length !== 0) {
                const account = accounts[0];
                showAccountAddress(account);
            } else {
                document.getElementById("ConnectWalletText").innerText = 'Connect Wallet';
                connectWalletBool = false;
            }
        });
    }

    document.querySelector("#Amount1").addEventListener("input", isInput1);
    document.querySelector("#Amount2").addEventListener("input", isInput2);

    if (!provider && downloadMetamaskFlag === false) {
        downloadMetamaskFlag = true;
        downloadMetamask();
    } else {
        document.getElementById("ClaimButton").addEventListener("click", async () => {
            if (!isRealValue) {
                $.alert("Please enter valid value");
            } else {
                let web32 = new Web3(rpcUrl);
                let flareContract = new web32.eth.Contract(flrAbi, flrAddr);

                web32.setProvider(provider);

                const value1 = amount1.value;
                const value2 = amount1.value;

                const percent1 = value1.replace(/[^0-9]/g, '');
                const percent2 = value2.replace(/[^0-9]/g, '');

                const bips1 = Number(percent1) * 100;
                const bips2 = Number(percent2) * 100;

                var addr1 = ftso1?.options[ftso1.selectedIndex]?.getAttribute('data-addr');
                var addr2 = ftso2?.options[ftso2.selectedIndex]?.getAttribute('data-addr');

                var transactionHashes

                try {
                    const SmartContracts = await flareContract.methods.getAllContracts().call();
                    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], "WNat");
                    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
                    let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
                    const accounts = await provider.request({method: 'eth_requestAccounts'});
                    const account = accounts[0];

                    const transactionParameters = {
                        from: account,
                        to: wrappedTokenAddr,
                        data: tokenContract.methods.undelegateAll().encodeABI(),
                    };

                    const transactionParameters2 = {
                        from: account,
                        to: wrappedTokenAddr,
                        data: tokenContract.methods.delegate(addr1, bips1).encodeABI(),
                    };

                    showSpinner(async () => {
                        await provider.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters],
                        })
                        .then((txHash) => showConfirm(txHash))
                        .catch((error) => showFail());
                    });

                    showSpinner(async () => {
                        await provider.request({
                            method: 'eth_sendTransaction',
                            params: [transactionParameters2],
                        })
                        .then((txHash) => showConfirm(txHash))
                        .catch((error) => showFail());
                    });

                    if (isAmount2Active) {
                        const transactionParameters3 = {
                            from: account,
                            to: wrappedTokenAddr,
                            data: tokenContract.methods.delegate(addr2, bips2).encodeABI(),
                        };

                        showSpinner(async () => {
                            await provider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters3],
                            })
                                .then((txHash) => showConfirm(txHash))
                                .catch((error) => showFail());
                        });
                    }
                } catch (error) {
                }
            }
        })
    }
})();
