// Copyright 2024, Andrew Caya <andrewscaya@yahoo.ca>
// Copyright 2024, Jean-Thomas Caya

import { GetContract, FlareAbis, FlareLogos, updateCurrentAccountStatus, updateCurrentBalancesStatus } from "./flare-utils";
import { wait, checkConnection, showTokenIdentifiers, resetDappObjectState } from "./dapp-utils.js";
import { downloadMetamask, showAlreadyDelegated, setCurrentAppState, setCurrentPopup, closeCurrentPopup, setupLedgerOption, togglePopup } from "./dapp-ui.js";
import { injectedProviderDropdown, walletConnectEVMParams, injectedProvider } from "./dapp-globals.js";
import { handleAccountsChanged, handleChainChanged, handleChainChangedStake, ConnectWalletClick } from "./dapp-wallet.js";
import { toggleWrapButton, setWrapButton, copyWrapInput, wrapTokens } from "./dapp-wrap.js";
import { getDelegatedBips, isDelegateInput1, delegate } from "./dapp-delegate.js";
import { claimRewards, claimFdRewards } from "./dapp-claim.js";
import { ConnectPChainClickStake, toggleTransferButton, setTransferButton, setTransferButton2, copyTransferInput, transferTokens, stake, claimStakingRewards } from "./dapp-staking.js";
import { handleTransportConnect } from "./dapp-ledger.js";

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
}

window.cachedValues = {
    balance: "",
    tokenBalance: "",
    pBalance: "",
}

async function getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier, flrAddr) {
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

async function createSelectedNetwork(DappObject) {
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

    closeCurrentPopup();

    if (dappLanguage === "fr_FR") {
        $.datepicker.setDefaults( $.datepicker.regional['fr'] );
        
        $.timepicker.setDefaults($.timepicker.regional['fr']);
    }

    // Removes the navbar's staking option for Browser Wallets

    // if (DappObject.walletIndex !== -1 && DappObject.walletIndex !== 1) {
    //     document.getElementById("navbar-stake-item").style.display = "none";
    // } else {
    //     document.getElementById("navbar-stake-item").style.display = "block";
    // }

    document.getElementById("currentWallet")?.addEventListener("click", togglePopup);

    $("#wrapTab").off();
    $("#delegateTab").off();
    $("#rewardsTab").off();
    $("#stakeTab").off();

    if (option == 4 && (stakingOption == undefined || stakingOption == 4 || stakingOption == 5)) {
        // Do nothing;    
    } else {
       $("#wrapTab")?.on("click", function () {
            getDappPage(1);
        });
        $("#delegateTab")?.on("click", function () {
            getDappPage(2);
        });
        $("#rewardsTab")?.on("click", function () {
            getDappPage(3);
        });
        $("#stakeTab")?.on("click", function () {
            getDappPage(5);
        });
    }

    clearTimeout(DappObject.latestPopupTimeoutId);

    checkConnection();

    window.dappOption = option;

    window.dappStakingOption = stakingOption;

    if (("usb" in navigator) && !("hid" in navigator) || ("usb" in navigator) && ("hid" in navigator)) {
        window.chosenNavigator = navigator.usb;
    } else if (("hid" in navigator) && !("usb" in navigator)) {
        window.chosenNavigator = navigator.hid;
    }

    if (("usb" in navigator) || ("hid" in navigator)) {
        // USB Connect Event

        chosenNavigator?.addEventListener('connect', async event => {
            // console.log("Connected!");
            if ((dappOption === 4 && typeof dappStakingOption === 'undefined') || (dappOption === 4 && dappStakingOption === 4) || DappObject.isHandlingOperation === true) {
                
            } else {
                await handleTransportConnect(chosenNavigator, DappObject, dappOption, dappStakingOption);
            }
        });

        // USB Disconnect Event
            
        chosenNavigator?.addEventListener('disconnect', async event => {
            // console.log("Disconnected!");
            if ((dappOption === 4 && typeof dappStakingOption === 'undefined') || (dappOption === 4 && dappStakingOption === 4) || DappObject.isHandlingOperation === true) {
                
            } else {
                await handleTransportConnect(chosenNavigator, DappObject, dappOption, dappStakingOption);
            }
        });
    }

    if (option === 1 || option === '1') {
        // WRAP PAGE
        document.getElementById("wrapTab")?.classList.add("selected");
        document.getElementById("delegateTab")?.classList.remove("selected");
        document.getElementById("rewardsTab")?.classList.remove("selected");
        document.getElementById("stakeTab")?.classList.remove("selected");

        let selectedNetwork = document.getElementById("SelectedNetwork");
        let chainidhex;
        let rpcUrl;
        let networkValue;
        let tokenIdentifier;
        let wrappedTokenIdentifier;
        var wrapUnwrapButton = document.getElementById("wrapUnwrap");
        var fromIcon = document.getElementById("FromIcon");
        var toIcon = document.getElementById("ToIcon");
        document.getElementById("layer2").innerHTML = DappObject.flrLogo;
        document.getElementById("layer3").innerHTML = DappObject.flrLogo;

        let balanceElement = document.getElementById("Balance");
        let tokenBalanceElement = document.getElementById("TokenBalance");

        new Odometer({el: balanceElement, value: 0});
        new Odometer({el: tokenBalanceElement, value: 0});

        await createSelectedNetwork(DappObject).then( async () => {
            getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

                showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);

                document.getElementById("ConnectWallet")?.addEventListener("click", handleClick = async () => {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, (dappOption - 1), handleClick);
                });
            
                // We check if the input is valid, then copy it to the wrapped tokens section.
                document.querySelector("#AmountFrom")?.addEventListener("input", function () {
                    setWrapButton(DappObject);
                    copyWrapInput();
                });
            
                document.getElementById("wrapUnwrap")?.addEventListener("click", async () => {
                    toggleWrapButton(DappObject, object.tokenIdentifier, object.wrappedTokenIdentifier, object.rpcUrl, object.flrAddr);
                });
            
                // If the input is valid, we wrap on click of "WrapButton".
                document.getElementById("WrapButton")?.addEventListener("click", async () => {
                    wrapTokens(object, DappObject);
                });

                if (DappObject.ledgerSelectedIndex !== "") {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 0, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                } else {
                    document.getElementById("ConnectWallet")?.click();
                }

                // When the Connect Wallet button is clicked, we connect the wallet, and if it
                // has already been clicked, we copy the public address to the clipboard.
                if (object.networkValue === '1') {
                    document.getElementById("layer2").innerHTML = DappObject.flrLogo;
                    document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                } else if (object.networkValue === '2') {
                    document.getElementById("layer2").innerHTML = DappObject.sgbLogo;
                    document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                } else {
                    document.getElementById("layer2").innerHTML = DappObject.costonLogo;
                    document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                }

                object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex]?.innerHTML;
                object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
                setWrapButton(DappObject);

                //When Selected Network Changes, alert Metamask
                selectedNetwork.onchange = async () => {
                    object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
                    object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
                    object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

                    DappObject.selectedNetworkIndex = Number(object.networkValue);

                    if (object.networkValue === '1') {
                        document.getElementById("layer2").innerHTML = DappObject.flrLogo;
                        document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                    } else if (object.networkValue === '2') {
                        document.getElementById("layer2").innerHTML = DappObject.sgbLogo;
                        document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                    } else {
                        document.getElementById("layer2").innerHTML = DappObject.costonLogo;
                        document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                    }

                    object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex]?.innerHTML;
                    object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                    showTokenIdentifiers(object.tokenIdentifier, object.wrappedTokenIdentifier);
                    DappObject.wrapBool = false;
                    wrapUnwrapButton.value = "false";
                    fromIcon.style.color = "#fd000f";
                    toIcon.style.color = "#000";
                    document.getElementById("Wrap").style.color = "#fd000f";
                    document.getElementById("Unwrap").style.color = "#383a3b";
                    document.getElementById("wrapUnwrap")?.click();

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    // Alert Metamask to switch.
                    try {
                        if (DappObject.walletIndex !== 1) {
                            const realChainId = await DappObject.chosenEVMProvider.request({method: 'eth_chainId'});

                            if (realChainId != object.chainIdHex) {
                                await DappObject.chosenEVMProvider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            "chainId": object.chainIdHex,
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
                                        "chainId": object.chainIdHex
                                        }
                                    ]
                                    }).catch(async (error) => {
                                        throw(error);
                                    });
                            }
                        }

                        ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 0, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                    } catch (error) {
                        // console.log(error);
                    }
                    
                    setWrapButton(DappObject);
                }

                if (DappObject.walletIndex !== 1) {
                    DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                        handleAccountsChanged(accounts, DappObject, dappOption, undefined, object.rpcUrl, object.flrAddr);
                    });

                    DappObject.chosenEVMProvider.on("chainChanged", async () => {
                        handleChainChanged(DappObject);
                    });

                    if (DappObject.walletIndex === 2) {
                        DappObject.chosenEVMProvider.on("disconnect", async () => {
                            getDappPage(4);
                        });
                    }
                }
            });
        });
    } else if (option === 2 || option === '2') {
        // DELEGATE PAGE
        document.getElementById("wrapTab")?.classList.remove("selected");
        document.getElementById("delegateTab")?.classList.add("selected");
        document.getElementById("rewardsTab")?.classList.remove("selected");
        document.getElementById("stakeTab")?.classList.remove("selected");

        let selectedNetwork = document.getElementById("SelectedNetwork");
        let rpcUrl;
        let chainidhex;
        let networkValue;

        await createSelectedNetwork(DappObject).then( async () => {
            getSelectedNetwork(rpcUrl, chainidhex, networkValue).then(async (object) => {

                document.getElementById("ConnectWallet")?.addEventListener("click", handleClick = async () => {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, (option - 1), handleClick);
                });
            
                document.getElementById("Amount1")?.addEventListener('input', async function () {
                    await isDelegateInput1(DappObject);
            
                    var str = this.value;
                    var suffix = "%";
            
                    if (str.search(suffix) === -1) {
                        str += suffix;
                    }
            
                    var actualLength = str.length - suffix.length;
            
                    if (actualLength === 0) {
                        this.value = str.substring(0, actualLength);
            
                        this.setSelectionRange(actualLength, actualLength);
                    } else {
                        this.value = str.substring(0, actualLength) + suffix;
            
                        // Set cursor position.
                        this.setSelectionRange(actualLength, actualLength);
                    }
                });
            
                document.getElementById("ClaimButton")?.addEventListener("click", async () => {
                    let web32 = new Web3(object.rpcUrl);

                    DappObject.isHandlingOperation = true;
            
                    try {
                        const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                        const account = DappObject.selectedAddress;
            
                        const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();
                        const delegatedFtsos = delegatesOfUser[0];
            
                        let ftsoNames = [];
            
                        fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
                        .then(res => res.json())
                        .then(FtsoInfo => {
                            FtsoInfo.providers.sort((a, b) => a.name > b.name ? 1 : -1);
            
                            var indexNumber;
            
                            for (var f = 0; f < FtsoInfo.providers.length; f++) {
                                indexNumber = f;
            
                                for (var i = 0; i < delegatedFtsos.length; i++) {
                                    if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                                        if (typeof ftsoNames[0] !== "undefined" && ftsoNames[0] !== null) {
                                            ftsoNames[1] = FtsoInfo.providers[indexNumber].name;
                                        } else {
                                            ftsoNames[0] = FtsoInfo.providers[indexNumber].name;
                                        }
                                    }
                                }
                            }

                            let delegatedBips = getDelegatedBips();
            
                            if (delegatedFtsos.length === 2 || delegatedBips === 100 || document.getElementById("ClaimButton").innerText === dappStrings['dapp_undelegate']) {
                                showAlreadyDelegated(ftsoNames, object, DappObject);
                            } else {
                                delegate(object, DappObject);
                            }

                            DappObject.isHandlingOperation = false;
                        });
                    } catch(error) {
                        DappObject.isHandlingOperation = false;

                        // console.log(error);
                    }
                });

                if (DappObject.ledgerSelectedIndex !== "") {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 1, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                } else {
                    document.getElementById("ConnectWallet")?.click();
                }

                await isDelegateInput1(DappObject);

                selectedNetwork.onchange = async () => {
                    object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                    object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                    object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                    DappObject.selectedNetworkIndex = Number(object.networkValue);

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    // Alert Metamask to switch.
                    try {
                        if (DappObject.walletIndex !== 1) {
                            const realChainId = await DappObject.chosenEVMProvider.request({method: 'eth_chainId'});

                            if (realChainId != object.chainIdHex) {
                                await DappObject.chosenEVMProvider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            "chainId": object.chainIdHex,
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
                                        "chainId": object.chainIdHex
                                        }
                                    ]
                                    }).catch(async (error) => {
                                        throw(error);
                                    });
                            }                    
                        }

                        ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 1, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                    } catch (error) {
                        // console.log(error);
                    }
                };

                if (DappObject.walletIndex !== 1) {
                    DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                        handleAccountsChanged(accounts, DappObject, dappOption, undefined, object.rpcUrl, object.flrAddr);
                    });

                    DappObject.chosenEVMProvider.on("chainChanged", async () => {
                        handleChainChanged(DappObject);
                    });

                    if (DappObject.walletIndex === 2) {
                        DappObject.chosenEVMProvider.on("disconnect", async () => {
                            getDappPage(4);
                        });
                    }
                }
            });
        });
    } else if (option === 3 || option === '3') {
        // REWARDS PAGE
        document.getElementById("wrapTab")?.classList.remove("selected");
        document.getElementById("delegateTab")?.classList.remove("selected");
        document.getElementById("rewardsTab")?.classList.add("selected");
        document.getElementById("stakeTab")?.classList.remove("selected");

        let tokenBalanceElement = document.getElementById("TokenBalance");

        new Odometer({el: tokenBalanceElement, value: 0});

        let selectedNetwork = document.getElementById("SelectedNetwork");
        let chainidhex;
        let rpcUrl;
        let networkValue;
        let tokenIdentifier;
        let wrappedTokenIdentifier;
        document.getElementById('layer3').innerHTML = DappObject.flrLogo;

        await createSelectedNetwork(DappObject).then( async () => {
            getSelectedNetwork(rpcUrl, chainidhex, networkValue, tokenIdentifier, wrappedTokenIdentifier).then(async (object) => {

                showTokenIdentifiers(null, object.wrappedTokenIdentifier);

                document.getElementById("ConnectWallet")?.addEventListener("click", handleClick = async () => {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, (option - 1), handleClick);
                });
            
                document.getElementById("ClaimButton")?.addEventListener("click", async () => {
                    if (DappObject.claimBool === true) {
                        await claimRewards(object, DappObject);
                    }
                });
            
                document.getElementById("ClaimFdButton")?.addEventListener("click", async () => {
                    if (DappObject.fdClaimBool === true) {
                        await claimFdRewards(object, DappObject);
                    }
                });

                if (DappObject.ledgerSelectedIndex !== "") {
                    ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 2, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                } else {
                    document.getElementById("ConnectWallet")?.click();
                }

                if (object.networkValue === '1') {
                    document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                } else if (object.networkValue === '2') {
                    document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                } else {
                    document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                }

                selectedNetwork.onchange = async () => {
                    object.rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-rpcurl');
                    object.chainIdHex = selectedNetwork?.options[selectedNetwork.selectedIndex]?.getAttribute('data-chainidhex');
                    object.networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex]?.value;

                    DappObject.selectedNetworkIndex = Number(object.networkValue);

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    if (object.networkValue === '1') {
                        document.getElementById("layer3").innerHTML = DappObject.flrLogo;
                    } else if (object.networkValue === '2') {
                        document.getElementById("layer3").innerHTML = DappObject.sgbLogo;
                    } else {
                        document.getElementById("layer3").innerHTML = DappObject.costonLogo;
                    }
                    
                    object.tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex]?.innerHTML;
                    object.wrappedTokenIdentifier = "W" + object.tokenIdentifier;
                    showTokenIdentifiers(null, object.wrappedTokenIdentifier);

                    // Alert Metamask to switch.
                    try {
                        if (DappObject.walletIndex !== 1) {
                            const realChainId = await DappObject.chosenEVMProvider.request({method: 'eth_chainId'});

                            if (realChainId != object.chainIdHex) {
                                await DappObject.chosenEVMProvider.request({
                                    method: 'wallet_addEthereumChain',
                                    params: [
                                        {
                                            "chainId": object.chainIdHex,
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
                                        "chainId": object.chainIdHex
                                        }
                                    ]
                                    }).catch(async (error) => {
                                        throw(error);
                                    });
                            }
                        }

                        ConnectWalletClick(object.rpcUrl, object.flrAddr, DappObject, 2, undefined, undefined, DappObject.selectedAddress, DappObject.ledgerSelectedIndex);
                    } catch (error) {
                        // console.log(error);
                    }
                };

                if (DappObject.walletIndex !== 1) {
                    DappObject.chosenEVMProvider.on("accountsChanged", async (accounts) => {
                        handleAccountsChanged(accounts, DappObject, dappOption, undefined, object.rpcUrl, object.flrAddr);
                    });

                    DappObject.chosenEVMProvider.on("chainChanged", async () => {
                        handleChainChanged(DappObject);
                    });

                    if (DappObject.walletIndex === 2) {
                        DappObject.chosenEVMProvider.on("disconnect", async () => {
                            getDappPage(4);
                        });
                    }
                }
            });
        });
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
                        getDappPage(1);
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

            try {
                // Network is Flare by default.
                DappObject.selectedNetworkIndex = 1;

                // We reset the provider instance
                DappObject.chosenEVMProvider = undefined

                // We say that the account is connected so that we can navigate from page to page.
                DappObject.isAccountConnected = true;

                // Setup the Ledger App dropdown
                DappObject.isAvax = false;

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

                document.getElementById("ContinueMetamask")?.addEventListener("click", async () => {
                    document.cookie = "ftsocan_browser-wallet=true;";
                    DappObject.walletIndex = 0;
                    updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
                    getDappPage(1);
                });
                document.getElementById("ContinueLedger")?.addEventListener("click", async () => {
                    getDappPage(9);
                });
                document.getElementById("ContinueWalletConnect")?.addEventListener("click", async () => {
                    DappObject.walletIndex = 2;
                    updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
                    DappObject.chosenEVMProvider = await walletConnectProvider.init(walletConnectEVMParams);
                    getDappPage(1);
                });

                document.getElementById("ContinueCryptoCom")?.addEventListener("click", async () => {
                    DappObject.walletIndex = 3;
                    updateCurrentAccountStatus("", null, false, DappObject.walletIndex);
                    await cryptoComConnector.activate();
                    DappObject.chosenEVMProvider = await cryptoComConnector.getProvider();
                    getDappPage(1);
                });

                await setCurrentAppState("Null");

                await setCurrentPopup(dappStrings['dapp_mabel_selectwallet1'], true);

                clearTimeout(DappObject.latestPopupTimeoutId);

                DappObject.latestPopupTimeoutId = setTimeout( async () => {
                    await setCurrentPopup(dappStrings['dapp_mabel_selectwallet2']  + ' ' + DappObject.providerList[0].info.name + ' ' + dappStrings['dapp_mabel_selectwallet3'] + ' ' + DappObject.providerList[0].info.name + ' ' + dappStrings['dapp_mabel_selectwallet4'], true);
                }, 9000);
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
            //     getDappPage(4);
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
                                getDappPage(1);
                            });
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
                            break
                    }
                });
            }

            document.getElementById("GoBack")?.addEventListener("click", async () => {
                getDappPage(4);
            });
        } else if (stakingOption === 1) {
            // TRANSFER PAGE
            document.getElementById("wrapTab")?.classList.remove("selected");
            document.getElementById("delegateTab")?.classList.remove("selected");
            document.getElementById("rewardsTab")?.classList.remove("selected");
            document.getElementById("stakeTab")?.classList.add("selected");

            let balanceElement = document.getElementById("Balance");
            let tokenBalanceElement = document.getElementById("TokenBalance");

            new Odometer({el: balanceElement, value: 0,});
            new Odometer({el: tokenBalanceElement, value: 0});

            document.getElementById("ConnectPChain")?.addEventListener("click", handleClick = async () => {
                ConnectPChainClickStake(DappObject, handleClick);
            });

            if (DappObject.walletIndex !== -1 || (DappObject.walletIndex === 1 && (Array.isArray(DappObject.ledgerAddrArray) && DappObject.ledgerAddrArray.length))) {
                document.getElementById("ConnectPChain")?.click();
            }

            // We check if the input is valid, then copy it to the wrapped tokens section.
            document.querySelector("#AmountFrom")?.addEventListener("input", function () {
                setTransferButton(DappObject);
                copyWrapInput();
            });

            document.querySelector("#AmountTo")?.addEventListener("input", function () {
                setTransferButton2(DappObject);
                copyTransferInput();
            });

            document.getElementById("TransferIcon")?.addEventListener("click", async () => {
                toggleTransferButton(DappObject, stakingOption);
            });

            document.getElementById("WrapButton")?.addEventListener("click", async () => {
                transferTokens(DappObject, stakingOption);
            });
        } else if (stakingOption === 2) {
            // STAKE PAGE
            document.getElementById("wrapTab")?.classList.remove("selected");
            document.getElementById("delegateTab")?.classList.remove("selected");
            document.getElementById("rewardsTab")?.classList.remove("selected");
            document.getElementById("stakeTab")?.classList.add("selected");

            document.getElementById("ConnectPChain")?.addEventListener("click", handleClick = async () => {
                ConnectPChainClickStake(DappObject, handleClick);
            });

            if (DappObject.walletIndex !== -1 || (DappObject.walletIndex === 1 && (Array.isArray(DappObject.ledgerAddrArray) && DappObject.ledgerAddrArray.length))) {
                document.getElementById("ConnectPChain")?.click();
            }

            document.getElementById("WrapButton")?.addEventListener("click", async () => {
                if (DappObject.isRealValue === false) {
                    await setCurrentPopup(dappStrings['dapp_mabel_stake_error1'], true);
                } else {
                    stake(DappObject, stakingOption);
                }
            });
        } else if (stakingOption === 3) {
            // STAKE REWARDS PAGE
            document.getElementById("wrapTab")?.classList.remove("selected");
            document.getElementById("delegateTab")?.classList.remove("selected");
            document.getElementById("rewardsTab")?.classList.remove("selected");
            document.getElementById("stakeTab")?.classList.add("selected");

            let tokenBalanceElement = document.getElementById("TokenBalance");

            new Odometer({el: tokenBalanceElement, value: 0});

            document.getElementById("ConnectPChain")?.addEventListener("click", handleClick = async () => {
                ConnectPChainClickStake(DappObject, handleClick);
            });

            if (DappObject.walletIndex !== -1 || (DappObject.walletIndex === 1 && (Array.isArray(DappObject.ledgerAddrArray) && DappObject.ledgerAddrArray.length))) {
                document.getElementById("ConnectPChain")?.click();
            }

            document.getElementById("ClaimButton")?.addEventListener("click", async () => {
                if (DappObject.claimBool === true) {
                    claimStakingRewards(DappObject, stakingOption);
                }
            });
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
};