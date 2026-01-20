import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos, updateCurrentAccountStatus, updateCurrentBalancesStatus } from "./flare-utils";
import { wait, round, isNumber, checkConnection, showConnectedAccountAddress, remove, resetDappObjectState } from "./dapp-utils.js";
import { setCurrentAppState, setCurrentPopup, closeCurrentPopup, showSignatureSpinner } from "./dapp-ui.js";
import { walletConnectEVMParams } from "./dapp-globals.js";
import { ConnectWalletDelegate } from "./dapp-delegate.js";
import { switchClaimButtonColor, switchClaimButtonColorBack, switchClaimFdButtonColor, switchClaimFdButtonColorBack, showClaimRewards, showFdRewards, ConnectWalletRewards } from "./dapp-claim.js";
import { message, RefreshStakingPage } from "./dapp-staking.js";
import { ethers } from "./ethers.js";
import { ConnectWalletSetupLedger } from "./dapp-ledger.js";
import { ConnectWalletWrap } from "./dapp-wrap.js";

export async function handleAccountsChanged(accounts, DappObject, pageIndex = 1, stakingOption, rpcUrl, flrAddr, autoRefresh) {
    DappObject.signatureStaking = "";
    DappObject.selectedAddress = "";

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
            getDappPage("Wrap");
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
            getDappPage("Wrap");
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
            // --- If this is the first time connecting... ---
            if (DappObject.walletIndex === 1) {
                // Ledger
                if (typeof addressIndex === "undefined" || addressIndex === "") {
                    await ConnectWalletSetupLedger(requiredApp, selectize, account, flrPublicKey, rpcUrl, flrAddr, pageIndex, HandleClick, DappObject);
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
                // EIP-1193 Wallets (Browser Wallets, WalletConnect, ect.)
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

                if (DappObject.selectedAddress === "") {
                    const accounts = await DappObject.chosenEVMProvider.request({method: 'eth_requestAccounts'});
                
                    account = accounts[0];
                } else {
                    account = DappObject.selectedAddress;
                }

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
            // --- If there are passed values, we use them instead. ---

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
                // To fix JavaScript misclicks when using Ledger.
                DappObject.isHandlingOperation = false;

            } else if ((DappObject.walletIndex === 1 && (addressIndex && addressIndex !== "")) || DappObject.walletIndex !== -1) {
                // --- Begin Function ---

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
                        // WRAP PAGE
                        await ConnectWalletWrap(account, prefixedPchainAddress, DappObject, balance, tokenBalance, web32);
                    } else if (pageIndex === 1) {
                        // DELEGATE PAGE
                        await ConnectWalletDelegate(account, prefixedPchainAddress, rpcUrl, flrAddr, web32, DappObject);
                    } else if (pageIndex === 2) {
                        // CLAIM PAGE
                        await ConnectWalletRewards(rpcUrl, flrAddr, web32, DappObject, account, prefixedPchainAddress, tokenBalance);
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