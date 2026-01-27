// Copyright 2024, Andrew Caya <andrewscaya@yahoo.ca>
// Copyright 2024, Jean-Thomas Caya

import { GetContract, FlareAbis, FlareLogos, updateCurrentAccountStatus, updateCurrentBalancesStatus } from "./flare-utils";
import { wait, checkConnection, showTokenIdentifiers, resetDappObjectState } from "./dapp-utils.js";
import { downloadMetamask, showAlreadyDelegated, setCurrentAppState, setCurrentPopup, closeCurrentPopup, setupLedgerOption, togglePopup, setupDappContainerUI, setupMobileNav, setMabelMessages } from "./dapp-ui.js";
import { injectedProviderDropdown, walletConnectEVMParams, injectedProvider } from "./dapp-globals.js";
import { handleAccountsChanged, handleChainChanged, handleChainChangedStake, ConnectWalletClick } from "./dapp-wallet.js";
import { setupWrapPage } from "./dapp-wrap.js";
import { setupDelegatePage } from "./dapp-delegate.js";
import { setupRewardsPage } from "./dapp-claim.js";
import { setupTransferPage, setupStakePage, setupStakeRewardsPage } from "./dapp-staking.js";
import { setupTransportConnect } from "./dapp-ledger.js";
import { ConnectWalletClickFassets, FAssetInfo, hasSnapsSupport } from "./dapp-fassets.js";

// ALL MODULES.

window.DappObject = {
    // Network index (1 = flare, 2 = songbird, other = coston)
    selectedNetworkIndex: 1,
    // Handling VA popups
    latestPopupTimeoutId: undefined,
    // Handling Accounts
    isHandlingOperation: false,
    isAccountConnected: false,
    // Logos
    costonLogo: FlareLogos.costonLogo,
    flrLogo: FlareLogos.flrLogo,
    sgbLogo: FlareLogos.sgbLogo,
    // FLR ABis
    ercAbi: FlareAbis.WNat,
    voterWhitelisterAbi: FlareAbis.VoterWhitelister,
    distributionAbiLocal: FlareAbis.DistributionToDelegators,
    ftsoRewardAbiLocal: FlareAbis.FtsoRewardManager,
    rewardManagerAbiLocal: FlareAbis.RewardManager,
    addressBinderAbiLocal: FlareAbis.AddressBinder,
    validatorRewardAbiLocal: FlareAbis.ValidatorRewardManager,
    systemsManagerAbiLocal: FlareAbis.FlareSystemsManager,
    fassetTokenAbi: FlareAbis.FAssetToken,
    // Bools that determine whether or not we should let the user proceed
    wrapBool: true,
    claimBool: false,
    fdClaimBool: false,
    isRealValue: false,
    isAmount2Active: false,
    transferBool: true,
    hasV1Rewards: false,
	hasV2Rewards: false,
    hasFtsoRewards: false,
    metamaskInstalled: false,
    isPopupActive: false,
    // Array that stores the latest reward epoch on all RewardManager contracts with null padding on index 0.
    rewardManagerData: [undefined],
    latestRewardEpochId: 0,
    // Chosen Wallet (-1 = null, 0 = Metamask, 1 = Ledger, 2 = WalletConnect, 3 = Crypto.com)
    walletIndex: -1,
    // Signature used for non-EVM transactions
    signatureStaking: "",
    // Injected Providers
    providerList: [],
    browserWalletLogo: '',
    // Ledger Variables
    unPrefixedAddr: "",
    publicKey: "",
    ledgerAddrArray: [],
    ledgerSelectedIndex: "",
    isAvax: true,
    // Chosen EVM Provider that inherits from EthereumProvider
    chosenEVMProvider: undefined,
    // Staking Variables
    selectedAddress: "",
    selectedDateTime: "",
    StakeMaxDate: "",
    StakeMinDate: "",
    // FAssets Variables
    chosenFAsset: "",
    secondaryWalletIndex: -1,
    secondaryAddr: "",
    ledgerSecondaryArray: [],
}

window.cachedValues = {
    balance: "",
    tokenBalance: "",
    pBalance: "",
    delegateDropdown: undefined,
    currentFassetPage: ""
}

export async function getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier, flrAddr) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var selectedNetwork = document.getElementById("SelectedNetwork");
            rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
            chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
            networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
            flrAddr = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-registrycontract');
            tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
            wrappedTokenIdentifier = "W" + tokenIdentifier;

            var object = {}

            object.selectedNetwork = selectedNetwork;
            object.rpcUrl = rpcUrl;
            object.chainIdHex = chainidhex;
            object.networkValue = networkValue;
            object.tokenIdentifier = tokenIdentifier;
            object.wrappedTokenIdentifier = wrappedTokenIdentifier;
            object.flrAddr = flrAddr

            resolve(object);
        }, 200);
    })
}

export async function createSelectedNetwork(DappObject) {
    return new Promise((resolve) => {
        setTimeout(async () => {
            var networkSelectBox = document.getElementById('SelectedNetwork');

            for (const property in dappNetworks) {
                var option = document.createElement("option");
                option.value = dappNetworks[property].id;
                option.text = dappNetworks[property].chainidentifier;
                option.setAttribute('data-chainname', dappNetworks[property].chainname);
                option.setAttribute('data-chainidhex', '0x' + dappNetworks[property].chainid.toString(16));
                option.setAttribute('data-rpcurl', dappNetworks[property].rpcurl);
                option.setAttribute('data-publicrpcurl', dappNetworks[property].publicrpcurl);
                option.setAttribute('data-registrycontract', dappNetworks[property].registrycontract);

                networkSelectBox.appendChild(option);
            }

            networkSelectBox.options[DappObject.selectedNetworkIndex - 1].setAttribute('selected', 'selected');
            networkSelectBox.options.selectedIndex = DappObject.selectedNetworkIndex - 1;

            if (DappObject.walletIndex === 0) {    
                if (!injectedProvider) {
                    DappObject.metamaskInstalled = false;
                    downloadMetamask();
                    resolve();
                } else {
                    DappObject.metamaskInstalled = true;

                    DappObject.chosenEVMProvider = injectedProvider;
                }
            } else if (DappObject.walletIndex === 1) {
                resolve();
            } else if (DappObject.walletIndex === 2) {
                if (DappObject.chosenEVMProvider === undefined) {
                    DappObject.chosenEVMProvider = await walletConnectProvider.init(walletConnectEVMParams);
                }

                if (!DappObject.chosenEVMProvider.session) {
                    try {
                        await DappObject.chosenEVMProvider.connect();

                        DappObject.isAccountConnected = true;
                    } catch (error) {
                        networkSelectBox.options[0].setAttribute('selected', 'selected');
                        networkSelectBox.options[1].removeAttribute('selected');
                        networkSelectBox.options.selectedIndex = 0;
                        resolve();
                    }
                }
            } else if (DappObject.walletIndex === 3) {
                if (DappObject.chosenEVMProvider === undefined) {
                    await cryptoComConnector.activate();

                    DappObject.chosenEVMProvider = await cryptoComConnector.getProvider();
                }
            }

            if (DappObject.walletIndex !== 1) {
                var chainIdHexPromise = await DappObject.chosenEVMProvider.request({method: 'eth_chainId'}).then(async function(chainIdHex) {
                    var realChainId;

                    realChainId = networkSelectBox.options[0].getAttribute('data-chainidhex');

                    for (var i = 0; i < networkSelectBox.options.length; i++) {
                        if (networkSelectBox.options[i].getAttribute('data-chainidhex') === chainIdHex) {
                            networkSelectBox.options[i].setAttribute('selected', 'selected');
                            networkSelectBox.options.selectedIndex = i;
                            realChainId = chainIdHex;
                        } else {
                            networkSelectBox.options[i].removeAttribute('selected');
                        }
                    }

                    if (DappObject.metamaskInstalled === true) {
                        try {
                            await DappObject.chosenEVMProvider.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        "chainId": realChainId,
                                        "rpcUrls": [networkSelectBox.options[networkSelectBox.selectedIndex].getAttribute('data-publicrpcurl')],
                                        "chainName": networkSelectBox.options[networkSelectBox.selectedIndex].getAttribute('data-chainname'),
                                        "iconUrls": [
                                            `https://portal.flare.network/token-logos/${networkSelectBox.options[networkSelectBox.selectedIndex].innerText}.svg`
                                        ],
                                        "nativeCurrency": {
                                            "name": `${networkSelectBox.options[networkSelectBox.selectedIndex].innerText}`,
                                            "symbol": `${networkSelectBox.options[networkSelectBox.selectedIndex].innerText}`,
                                            "decimals": 18
                                        }
                                    },
                                ],
                            });

                            if (DappObject.walletIndex === 0 && realChainId != chainIdHex) {
                                await DappObject.chosenEVMProvider.request({
                                    method: "wallet_switchEthereumChain",
                                    params: [
                                        {
                                        "chainId": realChainId
                                        }
                                    ]
                                    }).catch((error) => {
                                        throw error
                                    });
                            }
                        } catch (error) {
                            throw(error);
                        }
                    }
                });        
            }
            resolve();
        }, 200);
    })
}

function setInjectedInfo(info, provider) {
    if (!provider) {
        return
    } else {
        document.getElementById("injectedProviderName").innerText = info.name;

        document.getElementById("injectedProviderIcon").innerHTML = `<img src="${info.icon}" alt="${info.name}" />`;

        DappObject.browserWalletLogo = `<img src="${info.icon}" alt="${info.name}" />`;
    }
}

async function setupInjectedProviderOption() {
    var $select = $('#chosenProvider').selectize({
        maxItems: 1,
        valueField: 'id',
        labelField: 'title',
        searchField: ["title"],
        render: {
            item: function (item, escape) {
                return (
                "<div>" +
                (item.title
                    ? `<span class="addr-wrap">` + escape(item.title) + "</span>"
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
            onInjectedInputChange(value);
        },
        create: false,
        dropdownParent: "body",
    });

    var control = $select[0].selectize;

    control.clearOptions();

    return control;
}

var onInjectedInputChange = async (value) => {
    if (DappObject.providerList.length > 0) {
        injectedProvider = DappObject.providerList[value].provider;

        setInjectedInfo(DappObject.providerList[value].info, DappObject.providerList[value].provider);
    }
}

async function eip6963Listener(event) {
    DappObject.providerList = [...new Set(DappObject.providerList)];

    let count;

    if (DappObject.providerList.length <= 0) {
        // if there is only 1 Provider, we do not show the dropdown
        DappObject.providerList.push(event.detail);

        if (DappObject.providerList[0].info.name.toLowerCase().includes("crypto.com")) {
            DappObject.providerList = [];
        }

        count = DappObject.providerList.length;

        onInjectedInputChange(0);
    } else if (DappObject.providerList.length == 1) {
        // if there are 2 Providers, we inject both into the dropdown
        injectedProviderDropdown = await setupInjectedProviderOption();

        DappObject.providerList.push(event.detail);

        DappObject.providerList = DappObject.providerList.filter(function (item) {
            return !item.info.name.toLowerCase().includes("crypto.com");
        });

        count = DappObject.providerList.length;

        injectedProviderDropdown.addOption({
            id: count - 1,
            title: DappObject.providerList[count - 1].info.name,
        });

        injectedProviderDropdown.addOption({
            id: count - 2,
            title: DappObject.providerList[count - 2].info.name,
        });

        injectedProviderDropdown.setValue([count - 1]);
    } else {
        // if there are > 2 Providers, we inject the new provider into the dropdown
        DappObject.providerList.push(event.detail);

        DappObject.providerList = DappObject.providerList.filter(function (item) {
            return !item.info.name.toLowerCase().includes("crypto.com");
        });

        count = DappObject.providerList.length;

        injectedProviderDropdown.addOption({
            id: count - 1,
            title: DappObject.providerList[count - 1].info.name,
        });

        injectedProviderDropdown.setValue([count - 1]);
    }
}

// INIT

window.dappInit = async (option, stakingOption) => {
    window.dappOption = option;

    window.dappStakingOption = stakingOption;

    setupDappContainerUI();

    closeCurrentPopup();

    if (dappLanguage === "fr_FR") {
        $.datepicker.setDefaults( $.datepicker.regional['fr'] );
        
        $.timepicker.setDefaults($.timepicker.regional['fr']);
    }

    new Odometer({el: document.getElementById("balanceInfo"), value: 0, format: odometerFormat});
    new Odometer({el: document.getElementById("wnatInfo"), value: 0, format: odometerFormat});
    new Odometer({el: document.getElementById("pBalanceInfo"), value: 0, format: odometerFormat});

    // Removes the navbar's staking option for Browser Wallets

    // if (DappObject.walletIndex !== -1 && DappObject.walletIndex !== 1) {
    //     document.getElementById("navbar-stake-item").style.display = "none";
    // } else {
    //     document.getElementById("navbar-stake-item").style.display = "block";
    // }

    document.getElementById("currentWallet")?.addEventListener("click", togglePopup);

    setupMobileNav(option, stakingOption);

    clearTimeout(DappObject.latestPopupTimeoutId);

    checkConnection();

    await setupTransportConnect(dappOption, dappStakingOption, DappObject);

    if (option === 1 || option === '1') {
        // WRAP PAGE
        await setupWrapPage(DappObject, handleClick);
    } else if (option === 2 || option === '2') {
        // DELEGATE PAGE
        await setupDelegatePage(DappObject, handleClick, option);
    } else if (option === 3 || option === '3') {
        // REWARDS PAGE
        await setupRewardsPage(DappObject, handleClick, option);
    } else if (option === 4 || option === '4') {

        if (stakingOption !== undefined && stakingOption !== 4 && stakingOption !== 5) {
            // switch to Flare
            if (DappObject.walletIndex !== 1) {
                try {
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
                        }).catch((error) => {
                            throw error
                        });
                } catch (error) {
                    // console.log(error);
                }
            }
        }

        var handleClick;

        if (typeof stakingOption === 'undefined') {
            // SELECT WALLET PAGE

            document.getElementById("wrapTab")?.classList.remove("selected");
            document.getElementById("delegateTab")?.classList.remove("selected");
            document.getElementById("rewardsTab")?.classList.remove("selected");
            document.getElementById("stakeTab")?.classList.remove("selected");

            document.getElementById("wrapTab")?.classList.add("disabled");
            document.getElementById("delegateTab")?.classList.add("disabled");
            document.getElementById("rewardsTab")?.classList.add("disabled");
            document.getElementById("stakeTab")?.classList.add("disabled");

            try {
                // Network is Flare by default.
                DappObject.selectedNetworkIndex = 1;

                // We reset the provider instance
                DappObject.chosenEVMProvider = undefined

                // We say that the account is connected so that we can navigate from page to page.
                DappObject.isAccountConnected = true;

                // Setup the Ledger App dropdown
                DappObject.isAvax = false;

                DappObject.isPopupActive = false;

                await setupLedgerOption();

                // Setup the CurrentAccount modal

                updateCurrentAccountStatus("0x00000000", DappObject.selectedNetworkIndex, false, -1, "P-000000000000");
                updateCurrentBalancesStatus(0, 0, 0);

                // Reset the injected Provider settings
                injectedProviderDropdown = undefined;

                DappObject.providerList = [];

                injectedProvider = window.ethereum;

                document.getElementById("chosenProvider").style.display = "none";

                window.removeEventListener('eip6963:announceProvider', eip6963Listener);

                // listen for the EIP-6963 events emitted by Providers
                window.addEventListener('eip6963:announceProvider', eip6963Listener);
            
                window.dispatchEvent(new CustomEvent('eip6963:requestProvider'));

                await resetDappObjectState(DappObject);

                DappObject.walletIndex = -1;
                DappObject.secondaryWalletIndex = -1;

                document.getElementById("ContinueMetamask")?.addEventListener("click", async () => {
                    document.cookie = "ftsocan_browser-wallet=true;";
                    DappObject.walletIndex = 0;
                    updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
                    getDappPage("Wrap");
                });
                document.getElementById("ContinueLedger")?.addEventListener("click", async () => {
                    getDappPage("WalletLedger");
                });
                document.getElementById("ContinueWalletConnect")?.addEventListener("click", async () => {
                    DappObject.walletIndex = 2;
                    updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
                    DappObject.chosenEVMProvider = await walletConnectProvider.init(walletConnectEVMParams);
                    getDappPage("Wrap");
                });

                document.getElementById("ContinueCryptoCom")?.addEventListener("click", async () => {
                    DappObject.walletIndex = 3;
                    updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
                    await cryptoComConnector.activate();
                    DappObject.chosenEVMProvider = await cryptoComConnector.getProvider();
                    getDappPage("Wrap");
                });

                await setCurrentAppState("Null");

                await setMabelMessages(dappStrings['dapp_mabel_selectwallet1'], 
                dappStrings['dapp_mabel_selectwallet2']  + ' ' + DappObject.providerList[0].info.name + ' ' + dappStrings['dapp_mabel_selectwallet3'] + ' ' + DappObject.providerList[0].info.name + dappStrings['dapp_mabel_selectwallet4'],
                9000);
            } catch (error) {
                // console.log(error);
            }
        } else if (stakingOption === 4) {
            // //Metamask
            // DappObject.isAccountConnected = true;

            // await setCurrentAppState("Null");

            // document.getElementById("ContinueAnyway")?.addEventListener("click", async () => {

            // });

            // document.getElementById("GoBack")?.addEventListener("click", async () => {
            //     getDappPage("Wallet");
            // });

            // await setCurrentPopup(dappStrings['dapp_mabel_metamask'], true);
        } else if (stakingOption === 5) {
            // LEDGER PAGE

            DappObject.isAccountConnected = true;

            await setCurrentAppState("Null");

            if (!("usb" in navigator) && !("hid" in navigator)) {
                document.getElementById("ledgerContent").innerHTML = '<div class="top"><div class="wrap-box" style="height: auto !important; text-align: center !important; padding: 20px !important;"><div class="row"><div class="col-md-12"><span style="color: #383a3b; font-size: 25px; font-weight: bold;"><span class="fa fa-warning"></span> ' + dappStrings['dapp_wallet_warning'] + '</span></div></div><div class="row"><div class="col-md-12"><div style="font-size: 12px; width:100%; white-space: pre-wrap;">' + dappStrings['dapp_mabel_ledger1'] + '</div></div></div></div></div><div class="row"><div class="col-sm-12"><button id="GoBack" class="connect-wallet" style="float: none; margin-left: auto; margin-right: auto;"><i class="connect-wallet-text" id="ConnectWalletText">' + dappStrings['dapp_wallet_back'] + '</i></button></div></div>';

                await setCurrentPopup(dappStrings['dapp_mabel_ledger1'], true);
            } else {
                let requiredApp;

                if (DappObject.isAvax === true) {
                    requiredApp = "Avalanche";

                    document.getElementById("appName").innerText = "Avalanche App";
                } else {
                    requiredApp = "Flare Network";

                    document.getElementById("appName").innerText = "Flare Network App";
                }

                await setCurrentAppState("Connecting");

                await getLedgerApp(requiredApp).then(async result => {
                    switch (result) {
                        case "Success":
                            await wait(3000);
    
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
                            break
                        case "Failed: App not Installed":
                            await setCurrentAppState("Alert");

                            await setMabelMessages(undefined, dappStrings['dapp_mabel_ledger2'] + ' ' + requiredApp + ' ' + dappStrings['dapp_mabel_ledger3'], 1000)
    
                            throw new Error("Ledger Avalanche App not installed!");
                            break
                        case "Failed: User Rejected":
                            break
                    }
                });
            }

            document.getElementById("GoBack")?.addEventListener("click", async () => {
                getDappPage("Wallet");
            });
        } else if (stakingOption === 1) {
            // TRANSFER PAGE
            await setupTransferPage(DappObject, handleClick);
        } else if (stakingOption === 2) {
            // STAKE PAGE
            await setupStakePage(DappObject, handleClick);
        } else if (stakingOption === 3) {
            // STAKE REWARDS PAGE
            await setupStakeRewardsPage(DappObject, handleClick);
        }

        if (DappObject.walletIndex !== 1 && DappObject.walletIndex !== -1) {
            DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                handleAccountsChanged(accounts, DappObject, dappOption, stakingOption);
            });

            DappObject.chosenEVMProvider.on("chainChanged", async () => {
                handleChainChangedStake(DappObject);
            });
        }
    }
    
    if (option === 5 || option === '5') {
        if (DappObject.walletIndex !== 1 && DappObject.walletIndex !== -1) {
            DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                handleAccountsChanged(accounts, DappObject, dappOption, stakingOption);
            });

            DappObject.chosenEVMProvider.on("chainChanged", async () => {
                handleChainChanged(DappObject);
            });
        }

        var handleClick;

        console.log(DappObject.chosenEVMProvider);
 
        if (stakingOption === 7) {
            // SECONDARY WALLET
            document.getElementById("NativeName").innerHTML = FAssetInfo[DappObject.chosenFAsset].name;

            if (DappObject.walletIndex !== 0 || DappObject.chosenEVMProvider.isMetaMask !== true || (await hasSnapsSupport() === false)) {
                document.getElementById("metamaskOption").style.display = "none";
                document.getElementById("walletConnectOption").classList.remove("col-md-6");
            }

            document.getElementById("metamaskOption")?.addEventListener("click", async () => {
                DappObject.secondaryWalletIndex = 0;
                getDappPage(cachedValues.currentFassetPage);
            });

            document.getElementById("ledgerOption")?.addEventListener("click", async () => {
                DappObject.secondaryWalletIndex = 1;
                getDappPage(cachedValues.currentFassetPage);
            });

            document.getElementById("walletConnectOption")?.addEventListener("click", async () => {
                DappObject.secondaryWalletIndex = 2;
                getDappPage(cachedValues.currentFassetPage);
            });
        }

        if (stakingOption === 1) {
            DappObject.chosenFAsset = "";
 
            const btns = document.querySelectorAll('.fasset-clickable');

            btns.forEach(btn => {
                btn.addEventListener('click', event => {
                    DappObject.chosenFAsset = btn.id;

                    console.log(btn.id);

                    getDappPage('fassetsMintMint');
                });
            });             
         } else if (stakingOption === 2) {
            cachedValues.currentFassetPage = "fassetsMintMint";

            document.getElementById("FAssetName").innerHTML = FAssetInfo[DappObject.chosenFAsset].fasset;
            document.getElementById("NativeName").innerHTML = FAssetInfo[DappObject.chosenFAsset].name;
            document.getElementById("FromIcon").innerHTML = FAssetInfo[DappObject.chosenFAsset].icon;
            document.getElementById("ToIcon").innerHTML = FAssetInfo[DappObject.chosenFAsset].fassetIcon;
            document.getElementById("NativeAddress").innerHTML = FAssetInfo[DappObject.chosenFAsset].dummyAddress;

            document.getElementById("ConnectWallet")?.addEventListener("click", handleClick = async () => {
                ConnectWalletClickFassets(DappObject, 0, handleClick, undefined, undefined, undefined, undefined, DappObject.chosenFAsset);
            });

            document.getElementById("ConnectNative")?.addEventListener("click", async () => {
                getDappPage("secondaryWallet");
            });

            if (DappObject.walletIndex !== -1 || (DappObject.walletIndex === 1 && (Array.isArray(DappObject.ledgerAddrArray) && DappObject.ledgerAddrArray.length))) {
                document.getElementById("ConnectWallet")?.click();
            }
 
             // We check if the input is valid, then copy it to the wrapped tokens section.
             // document.querySelector("#AmountTo")?.addEventListener("input", function () {
             //     setTransferButton2(DappObject);
             //     copyTransferInput();
             // });
 
             // document.getElementById("TransferIcon")?.addEventListener("click", async () => {
             //     toggleTransferButton(DappObject, stakingOption);
             // });
 
             // document.getElementById("WrapButton")?.addEventListener("click", async () => {
             //     transferTokens(DappObject, stakingOption);
             // });
         }
    } else {
        DappObject.chosenFAsset = "";
    }

    // French Number formatting

    document.querySelectorAll(".odometer").forEach(odometer => {
        odometer.addEventListener('odometerdone', function(){
            document.querySelectorAll(".odometer-radix-mark").forEach(element => {
                if (dappLanguage === "fr_FR") {
                    element.innerText = ",";
                } else {
                    element.innerText = ".";
                }
            });
        });
    });
};