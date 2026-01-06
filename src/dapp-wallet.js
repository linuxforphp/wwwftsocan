import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos, updateCurrentAccountStatus, updateCurrentBalancesStatus } from "./flare-utils";
import { wait, round, isNumber, checkConnection, showConnectedAccountAddress, remove, resetDappObjectState } from "./dapp-utils.js";
import { setCurrentAppState, setCurrentPopup, closeCurrentPopup, showSignatureSpinner } from "./dapp-ui.js";
import { walletConnectEVMParams } from "./dapp-globals.js";
import { populateFtsos, isDelegateInput1 } from "./dapp-delegate.js";
import { getDelegatedProviders, getRewardClaimWithProofStructs, switchClaimButtonColor, switchClaimButtonColorBack, switchClaimFdButtonColor, switchClaimFdButtonColorBack, showClaimRewards, showFdRewards, getV1Rewards, getV2Rewards, getFlareDropRewards } from "./dapp-claim.js";
import { message, RefreshStakingPage } from "./dapp-staking.js";
import { ethers } from "./ethers.js";

export async function handleAccountsChanged(accounts, DappObject, pageIndex = 1, stakingOption, rpcUrl, flrAddr, autoRefresh) {
    DappObject.signatureStaking = "";

    if (pageIndex === 1 || pageIndex === '1') {
        if ((isNumber(accounts.length) && accounts.length > 0) || autoRefresh === true) {
            ConnectWalletClick(rpcUrl, flrAddr, DappObject, 0);
        } else {
            updateCurrentAccountStatus("0x00000000", DappObject.selectedNetworkIndex, false, -1, "P-000000000000");
            updateCurrentBalancesStatus(0, 0, 0);
            document.getElementById("ConnectWalletText").innerText = dappStrings["dapp_connect"];
            showBalance(0);
            showTokenBalance(0);

            setCurrentAppState("Null");
        }
    } else if (pageIndex === 2 || pageIndex === '2') {
        if ((isNumber(accounts.length) && accounts.length > 0) || autoRefresh === true) {
            ConnectWalletClick(rpcUrl, flrAddr, DappObject, 1);
        } else {
            updateCurrentAccountStatus("0x00000000", DappObject.selectedNetworkIndex, false, -1, "P-000000000000");
            updateCurrentBalancesStatus(0, 0, 0);
            document.getElementById("ConnectWalletText").innerText = dappStrings["dapp_connect"];
            document.getElementById("ClaimButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
            document.getElementById("ClaimButton").style.cursor = "auto";
            document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_enteramount'];
            DappObject.isRealValue = false;

            setCurrentAppState("Null");
        }
    } else if (pageIndex === 3 || pageIndex === '3') {
        remove(".wrap-box-ftso");

        if ((isNumber(accounts.length) && accounts.length > 0) || autoRefresh === true) {
            ConnectWalletClick(rpcUrl, flrAddr, DappObject, 2);
        } else {
            updateCurrentAccountStatus("0x00000000", DappObject.selectedNetworkIndex, false, -1, "P-000000000000");
            updateCurrentBalancesStatus(0, 0, 0);
            document.getElementById("ConnectWalletText").innerText = dappStrings["dapp_connect"];
            showTokenBalance(0);
            showConnectedAccountAddress('0x0');
            showFdRewards(0);
            switchClaimFdButtonColorBack();
            showClaimRewards(0);
            switchClaimButtonColorBack();

            setCurrentAppState("Null");
        }
    } else if (pageIndex === 4 && stakingOption !== 5) {
        if ((isNumber(accounts.length) && accounts.length > 0) || autoRefresh === true) {
            RefreshStakingPage(DappObject);
        } else {
            updateCurrentAccountStatus("0x00000000", DappObject.selectedNetworkIndex, false, -1, "P-000000000000");
            updateCurrentBalancesStatus(0, 0, 0);
            document.getElementById("ConnectWalletText").innerText = dappStrings["dapp_connect"];

            showBalance(0);
            showTokenBalance(0);

            setCurrentAppState("Null");
        }
    } else if (pageIndex === 4 && stakingOption === 5) {
        await setCurrentAppState("Connected");

        await setCurrentPopup(dappStrings['dapp_mabel_connected'], false);

        document.getElementById("ContinueAnyway")?.classList.add("connect-wallet");

        document.getElementById("ContinueAnyway")?.classList.remove("claim-button");

        document.getElementById("ContinueAnyway")?.addEventListener("click", async () => {
            document.cookie = "ftsocan_browser-wallet=false;";
            DappObject.walletIndex = 1;
            updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
            getDappPage(1);
        });

        DappObject.isHandlingOperation = false;
    }
}

export async function handleChainChanged(DappObject) {
    try {
        if (DappObject.walletIndex !== 1 && DappObject.walletIndex !== -1) {
            var chainIdHexPromise = await DappObject.chosenEVMProvider.request({method: 'eth_chainId'}).then(async function(chainIdHex) {
                var realChainId;
    
                var changeEvent = new Event("change");
    
                var selectedNetwork = document.getElementById("SelectedNetwork");
    
                realChainId = selectedNetwork.options[0].getAttribute('data-chainidhex');
    
                for (var i = 0; i < selectedNetwork?.options.length; i++) {
                    if (selectedNetwork?.options[i].getAttribute('data-chainidhex') === String(chainIdHex)) {
                        selectedNetwork.options[i].setAttribute('selected', 'selected');
                        selectedNetwork.options.selectedIndex = i;
                        realChainId = chainIdHex;
                        selectedNetwork.dispatchEvent(changeEvent);
                    } else {
                        selectedNetwork.options[i].removeAttribute('selected');
                    }
                }

                if (realChainId != chainIdHex) {
                    await DappObject.chosenEVMProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                "chainId": realChainId,
                                "rpcUrls": [selectedNetwork.options[selectedNetwork.selectedIndex].getAttribute('data-publicrpcurl')],
                                "chainName": selectedNetwork.options[selectedNetwork.selectedIndex].getAttribute('data-chainname'),
                                "iconUrls": [
                                    `https://portal.flare.network/token-logos/${selectedNetwork.options[selectedNetwork.selectedIndex].innerText}.svg`
                                ],
                                "nativeCurrency": {
                                    "name": `${selectedNetwork.options[selectedNetwork.selectedIndex].innerText}`,
                                    "symbol": `${selectedNetwork.options[selectedNetwork.selectedIndex].innerText}`,
                                    "decimals": 18
                                }
                            },
                        ],
                    });

                    await DappObject.chosenEVMProvider.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                            "chainId": realChainId
                            }
                        ]
                        }).catch(async (error) => {
                            throw(error);
                        });
                }
            });
        }

        document.getElementById("ConnectWallet")?.click();
    } catch (error) {
        // console.log(error);
    }
}

export async function handleChainChangedStake(DappObject) {
    if (DappObject.walletIndex !== 1) {
        let flareParamsArray;

        for (const property in dappNetworks) {
            if (dappNetworks[property].chainidentifier == "FLR") {
                flareParamsArray = dappNetworks[property];
            }
        }

        try {
            await DappObject.chosenEVMProvider.request({
                method: 'wallet_addEthereumChain',
                params: [
                    {
                        "chainId": '0x' + flareParamsArray.chainid.toString(16),
                        "rpcUrls": [flareParamsArray.publicrpcurl],
                        "chainName": flareParamsArray.chainname,
                        "iconUrls": [
                            `https://portal.flare.network/token-logos/${flareParamsArray.chainidentifier}.svg`
                        ],
                        "nativeCurrency": {
                            "name": flareParamsArray.chainidentifier,
                            "symbol": flareParamsArray.chainidentifier,
                            "decimals": 18
                        }
                    },
                ],
            });
        } catch (error) {
            getDappPage(1);
        }

        await DappObject.chosenEVMProvider.request({
            method: "wallet_switchEthereumChain",
            params: [
                {
                "chainId": "0xe"
                }
            ]
            }).catch(async (error) => {
                throw(error);
            });
    }
}

export async function ConnectWalletClick(rpcUrl, flrAddr, DappObject, pageIndex, HandleClick, PassedPublicKey, PassedEthAddr, addressIndex) {
    DappObject.isHandlingOperation = true;

    clearTimeout(DappObject.latestPopupTimeoutId);

    checkConnection();

    await setCurrentAppState("Connecting");

    await setCurrentPopup(dappStrings['dapp_mabel_connecting'], true);

    DappObject.isAccountConnected = false;

    // Fast loading.

    updateCurrentAccountStatus("", DappObject.selectedNetworkIndex, false);

    document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';

    if (pageIndex === 0) {
        DappObject.wrapBool = (document.getElementById("wrapUnwrap").value === 'true');

        showBalance(undefined, DappObject.wrapBool);
        showTokenBalance(undefined, DappObject.wrapBool);
    } else if (pageIndex === 1) {
        // showAccountAddress(PassedEthAddr);
    } else if (pageIndex === 2) {
        // showAccountAddress(PassedEthAddr);
        showFdRewards('<i class="fa fa-spinner fa-spin"></i>');
        showClaimRewards('<i class="fa fa-spinner fa-spin"></i>');
        showTokenBalance(undefined);
        showConnectedAccountAddress(PassedEthAddr);
    }
    
    let web32 = new Web3(rpcUrl);

    try {
        let flrPublicKey;

        let account;

        let selectize;

        if (addressIndex && addressIndex !== "") {
            DappObject.ledgerSelectedIndex = addressIndex;
        }

        let requiredApp;

        if (DappObject.isAvax === true) {
            requiredApp = "Avalanche";
        } else {
            requiredApp = "Flare Network";
        }

        if (!PassedPublicKey) {
            if (DappObject.walletIndex === 1) {
                if (typeof addressIndex === "undefined" || addressIndex === "") {
                    await getLedgerApp(requiredApp).then(async result => {
                        switch (result) {
                            case "Success":
                                await wait(3000);
        
                                if (!Array.isArray(DappObject.ledgerAddrArray) || !DappObject.ledgerAddrArray.length) {
                                    let addresses;
        
                                    // console.log("Fetching Addresses... ETH");
        
                                    if (GetNetworkName(rpcUrl) === "flare") {
                                        addresses = await getLedgerAddresses("flare", DappObject.isAvax);
                                    } else if (GetNetworkName(rpcUrl) === "songbird") {
                                        addresses = await getLedgerAddresses("songbird", DappObject.isAvax);
                                    }
        
                                    let insert = [];
        
                                    for (let i = 0; i < addresses.length; i++) {
                                        insert[i] = {
                                            id: i,
                                            title: addresses[i].ethAddress,
                                            pubkey: addresses[i].publicKey,
                                        };
                                    }
        
                                    DappObject.ledgerAddrArray = insert;
                                }
        
                                // console.log(DappObject.ledgerAddrArray);
        
                                document.getElementById("ConnectWalletText").innerHTML = '<select id="select-account" class="connect-wallet-text" placeholder="' + dappStrings['dapp_select_wallet'] + '"></select>'
        
                                var onInputChange = async (value) => {
                                    let addressBox = document.querySelector("span.title.connect-wallet-text");
                                    let ethaddr = addressBox.getAttribute('data-ethkey');
                                    let pubKey = addressBox.getAttribute('data-pubkey');
                                    
                                    flrPublicKey = pubKey;
        
                                    account = ethaddr;
        
                                    DappObject.selectedAddress = account;
        
                                    DappObject.ledgerSelectedIndex = value;
        
                                    let unprefixed;
        
                                    if (GetNetworkName(rpcUrl) === "flare") {
                                        unprefixed = await publicKeyToBech32AddressString(flrPublicKey, "flare");
                                    } else if (GetNetworkName(rpcUrl) === "songbird") {
                                        unprefixed = await publicKeyToBech32AddressString(flrPublicKey, "songbird");
                                    }
        
                                    DappObject.unPrefixedAddr = unprefixed;
        
                                    ConnectWalletClick(rpcUrl, flrAddr, DappObject, pageIndex, HandleClick, flrPublicKey, ethaddr, value);
                                }
        
                                var $select = $('#select-account').selectize({
                                    maxItems: 1,
                                    valueField: 'id',
                                    labelField: 'title',
                                    searchField: ["title"],
                                    options: DappObject.ledgerAddrArray,
                                    render: {
                                        item: function (item, escape) {
                                            return (
                                            "<div>" +
                                            (item.title
                                                ? `<span class="title connect-wallet-text" data-pubkey=${item.pubkey} data-ethkey=${item.title}>` + escape(item.title) + "</span>"
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
                                        onInputChange(value);
                                    },
                                    create: false,
                                    dropdownParent: "body",
                                });
        
                                selectize = $select[0].selectize;
        
                                if (HandleClick) {
                                    document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
                                }
        
                                if (DappObject.ledgerSelectedIndex !== "") {
                                    selectize.setValue([Number(DappObject.ledgerSelectedIndex)]);
                                } else {
                                    await setCurrentPopup(dappStrings['dapp_mabel_selectaccount'], true);
                                }
        
                                let addressDropdown = document.querySelector(".selectize-input");
                                let publicKey = addressDropdown?.childNodes[0]?.childNodes[0]?.getAttribute('data-pubkey');
                                    
                                flrPublicKey = publicKey;
                                break
                            case "Failed: App not Installed":
                                await setCurrentAppState("Alert");
        
                                clearTimeout(DappObject.latestPopupTimeoutId);
        
                                DappObject.latestPopupTimeoutId = setTimeout( async () => {
                                    await setCurrentPopup(dappStrings['dapp_mabel_ledger2'] + ' ' + requiredApp + ' ' + dappStrings['dapp_mabel_ledger3'], true);
                                }, 1000);
        
                                throw new Error("Ledger Avalanche App not installed!");
                                break
                            case "Failed: User Rejected":
                                ConnectWalletClick(rpcUrl, flrAddr, DappObject, pageIndex, HandleClick);
                                break
                        }
                    });
                } else {
                    account = PassedEthAddr;
                    
                    if (HandleClick) {
                        document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
                    }

                    await setCurrentAppState("Connected");

                    closeCurrentPopup();

                    // await setCurrentPopup("Connected to account: " + account.slice(0, 17));

                    DappObject.isAccountConnected = true;
                }
            } else {
                if (DappObject.walletIndex === 0) { 
                    if (DappObject.chosenEVMProvider === undefined) {
                        DappObject.chosenEVMProvider = window.ethereum;
                    }
                } else if (DappObject.walletIndex === 2) {
                    if (DappObject.chosenEVMProvider === undefined) {
                        DappObject.chosenEVMProvider = await walletConnectProvider.init(walletConnectEVMParams);
                    }
        
                    if (!DappObject.chosenEVMProvider.session) {
                        await DappObject.chosenEVMProvider.connect();
                    }
                } else if (DappObject.walletIndex === 3) {
                    if (DappObject.chosenEVMProvider === undefined) {
                        await cryptoComConnector.activate();

                        DappObject.chosenEVMProvider = await cryptoComConnector.getProvider();
                    }
                }

                const accounts = await DappObject.chosenEVMProvider.request({method: 'eth_requestAccounts'});
                
                account = accounts[0];

                if (DappObject.signatureStaking === "") {
        
                    if (DappObject.isPopupActive == false) {
                        let signSpinner = await showSignatureSpinner();

                        const signature = await DappObject.chosenEVMProvider.request({
                            "method": "personal_sign",
                            "params": [
                                message,
                                account
                            ]
                        }).catch((error) => async function() {
                            signSpinner.close();

                            throw error;
                        });

                        DappObject.signatureStaking = signature;

                        DappObject.isPopupActive = false;

                        signSpinner.close();
                    } else {
                        return;
                    }
                }

                await setCurrentAppState("Connected");

                closeCurrentPopup();

                // await setCurrentPopup("Connected to account: " + account.slice(0, 17));

                DappObject.isAccountConnected = true;

                flrPublicKey = await GetPublicKey(account, message, DappObject.signatureStaking);
            }
        } else {
            account = PassedEthAddr;
            flrPublicKey = PassedPublicKey;

            if (HandleClick) {
                document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
            }

            await setCurrentAppState("Connected");

            closeCurrentPopup();

            // await setCurrentPopup("Connected to account: " + account.slice(0, 17));

            DappObject.isAccountConnected = true;
        }

        if (!flrPublicKey) {
            flrPublicKey = DappObject.publicKey;
        }

        if (flrPublicKey) {
            if (DappObject.walletIndex === 1 && (typeof addressIndex == "undefined" || addressIndex === "")) {
                DappObject.isHandlingOperation = false;
            } else if ((DappObject.walletIndex === 1 && (addressIndex && addressIndex !== "")) || DappObject.walletIndex !== -1) {
                DappObject.selectedAddress = account;

                let prefixedPchainAddress;

                let PchainBalanceBigInt = BigInt(0);

                if (GetNetworkName(rpcUrl) === "flare") {
                    const addressBinderAddr = await GetContract("AddressBinder", rpcUrl, flrAddr);

                    const AddressBinderContract = new web32.eth.Contract(DappObject.addressBinderAbiLocal, addressBinderAddr);

                    const ethAddressString = await publicKeyToEthereumAddressString(flrPublicKey);

                    const CchainAddr = ethers.utils.getAddress(ethAddressString);

                    const PchainAddr = await publicKeyToBech32AddressString(flrPublicKey, "flare");

                    DappObject.unPrefixedAddr = PchainAddr;

                    DappObject.selectedAddress = account;

                    DappObject.publicKey = flrPublicKey;
                        
                    const addressPchain = await AddressBinderContract.methods.cAddressToPAddress(CchainAddr).call();

                    if (addressPchain !== "0x0000000000000000000000000000000000000000") {

                        prefixedPchainAddress = "P-" + PchainAddr;

                        const PchainBalanceObject = await getPchainBalanceOf(prefixedPchainAddress);

                        PchainBalanceBigInt = BigInt(PchainBalanceObject.balance);
                    }

                    updateCurrentAccountStatus(DappObject.selectedAddress, 1, true, undefined, prefixedPchainAddress);
                } else if (GetNetworkName(rpcUrl) === "songbird") {
                    updateCurrentAccountStatus(DappObject.selectedAddress, 2, true, undefined);
                }

                const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
                let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                const balance = await web32.eth.getBalance(account);
                const tokenBalance = await tokenContract.methods.balanceOf(account).call();

                updateCurrentBalancesStatus(web32.utils.fromWei(balance, "ether"), web32.utils.fromWei(tokenBalance, "ether"), web32.utils.fromWei(PchainBalanceBigInt, "gwei"));

                try {
                    if (pageIndex === 0) {
                        showAccountAddress(account, prefixedPchainAddress);
        
                        if (DappObject.wrapBool === true) {
                            showBalance(round(web32.utils.fromWei(balance, "ether")));
                            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                        } else {
                            showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                            showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
                        }

                        await setCurrentPopup(dappStrings['dapp_mabel_wrap1'], true);

                        clearTimeout(DappObject.latestPopupTimeoutId);

                        DappObject.latestPopupTimeoutId = setTimeout( async () => {
                            await setCurrentPopup(dappStrings['dapp_mabel_wrap2'], true);
                        }, 15000);
                    } else if (pageIndex === 1) {
                        let delegatedIcon1 = document.getElementById("delegatedIcon1");
                        delegatedIcon1.src = dappUrlBaseAddr + 'img/FLR.svg';
        
                        await isDelegateInput1(DappObject);

                        await setCurrentPopup(dappStrings['dapp_mabel_delegate1'], true);

                        clearTimeout(DappObject.latestPopupTimeoutId);

                        DappObject.latestPopupTimeoutId = setTimeout( async () => {
                            await setCurrentPopup(dappStrings['dapp_mabel_delegate2'], true);
                        }, 15000);
        
                        try {
                            showAccountAddress(account, prefixedPchainAddress);
                            await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);
                        } catch (error) {
                            throw error;
                        }
                    } else if (pageIndex === 2) {
                        var networkSelectBox = document.getElementById('SelectedNetwork');

                        let rewardManagerAddr = await GetContract("RewardManager", rpcUrl, flrAddr);

                        let oldRewardManagerAddr;

                        let rewardManagerContract;

                        let rewardManagerAddrArray = [rewardManagerAddr];

                        let rewardManagerContractArray = [];

                        for (let i = 0; i < rewardManagerAddrArray.length; i++) {
                            try {
                                rewardManagerContract = new web32.eth.Contract(DappObject.rewardManagerAbiLocal, rewardManagerAddrArray[i]);

                                rewardManagerContractArray[i] = rewardManagerContract;

                                oldRewardManagerAddr = await rewardManagerContract.methods.oldRewardManager().call();

                                if (oldRewardManagerAddr !== "0x0000000000000000000000000000000000000000") {
                                    rewardManagerAddrArray[i + 1] = oldRewardManagerAddr;
                                }
                            } catch (error) {
                                // console.log(error);
                            }
                        }
        
                        try {
                            const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", rpcUrl, flrAddr);
                            const ftsoRewardAddr = await GetContract("FtsoRewardManager", rpcUrl, flrAddr);

                            const systemsManagerAddr = await GetContract("FlareSystemsManager", rpcUrl, flrAddr);
                            let DistributionDelegatorsContract = new web32.eth.Contract(DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
                            let ftsoRewardContract = new web32.eth.Contract(DappObject.ftsoRewardAbiLocal, ftsoRewardAddr);
                            let flareSystemsManagerContract = new web32.eth.Contract(DappObject.systemsManagerAbiLocal, systemsManagerAddr);
        
                            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                            showConnectedAccountAddress(account);
        
                            // Changing the color of Claim button.
                            if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
                                switchClaimButtonColor();
                                
                                DappObject.claimBool = true;
                            } else {
                                switchClaimButtonColorBack();
        
                                DappObject.claimBool = false;
                            }
        
                            if (Number(document.getElementById('ClaimFdButtonText').innerText) > 0) {
                                switchClaimFdButtonColor();
                                
                                DappObject.fdClaimBool = true;
                            } else {
                                switchClaimFdButtonColorBack();
        
                                DappObject.fdClaimBool = false;
                            }
        
                            remove(".wrap-box-ftso");
        
                            await getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject);

                            showAccountAddress(account, prefixedPchainAddress);
        
                            // Getting the unclaimed Rewards and affecting the Claim button.
                            const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
                            let unclaimedAmount = BigInt(0);
                            let unclaimedAmountv2;
                            let l;

                            let network = GetNetworkName(rpcUrl);

                            unclaimedAmount += await getV1Rewards(epochsUnclaimed, network, account, ftsoRewardContract, l);

                            if (unclaimedAmount > BigInt(0)) {
                                DappObject.hasV1Rewards = true;
                            } else {
                                DappObject.hasV1Rewards = false;
                            }

                            if (rewardsOverrideConfig[network].V2Check === true && rewardManagerContractArray?.length) {
                                unclaimedAmount += await getV2Rewards(unclaimedAmountv2, network, account, DappObject, flareSystemsManagerContract, rewardManagerContractArray);
                            } else {
                                DappObject.hasV2Rewards = false;

                                DappObject.hasFtsoRewards = false;
                            }
                            
                            const convertedRewards = web32.utils.fromWei(unclaimedAmount, "ether").split('.');
                            
                            // Changing the color of Claim button.
                            showClaimRewards(convertedRewards[0] + "." + convertedRewards[1].slice(0, 2));
        
                            if (networkSelectBox.options[networkSelectBox.selectedIndex].innerText === "FLR") {
                                let claimableAmountFd = BigInt(0);

                                claimableAmountFd += await getFlareDropRewards(account, DistributionDelegatorsContract);
                                
                                const convertedRewardsFd = web32.utils.fromWei(claimableAmountFd, "ether").split('.');
        
                                // Changing the color of FlareDrop Claim button.
                                showFdRewards(convertedRewardsFd[0] + "." + convertedRewardsFd[1].slice(0, 2));
        
                                if (Number(document.getElementById('ClaimFdButtonText').innerText) > 0) {
                                    switchClaimFdButtonColor();
        
                                    DappObject.fdClaimBool = true;
                                } else {
                                    switchClaimFdButtonColorBack();
        
                                    DappObject.fdClaimBool = false;
                                }
                            } else {
                                showFdRewards(0);
                            }
        
                            if (Number(document.getElementById('ClaimButtonText').innerText) > 0) {
                                switchClaimButtonColor();
        
                                DappObject.claimBool = true;
                            } else {
                                showClaimRewards(0);
                                switchClaimButtonColorBack();
        
                                DappObject.claimBool = false;
                            }

                            await setCurrentPopup(dappStrings['dapp_mabel_claim1'], true);

                            clearTimeout(DappObject.latestPopupTimeoutId);

                            DappObject.latestPopupTimeoutId = setTimeout( async () => {
                                await setCurrentPopup(dappStrings['dapp_mabel_claim2'], true);
                            }, 15000);
                        } catch (error) {
                            // console.log(error);
                        }
                    }

                    DappObject.isHandlingOperation = false;
                } catch (error) {
                    throw error
                }
            }
        } else {
            document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);

            DappObject.isHandlingOperation = false;
        }
    } catch (error) {
        // console.log(error);

        document.getElementById("ConnectWalletText").innerText = dappStrings["dapp_connect"];

        await resetDappObjectState(DappObject);

        var ClickHandler;

        if (HandleClick) {
            document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
        }

        document.getElementById("ConnectWallet")?.addEventListener("click", ClickHandler = async () => {
            ConnectWalletClick(rpcUrl, flrAddr, DappObject, pageIndex, ClickHandler);
        });
    }
}