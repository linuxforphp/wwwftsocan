import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";
import { ethers } from "./ethers.js";
import { wait, unPrefix0x, round, isNumber, checkConnection, checkTxStake, showConnectedAccountAddress, resetDappObjectState } from "./dapp-utils.js";
import { showSpinner, showConfirmationSpinnerTransfer, showConfirmationSpinnerStake, showConfirmStake, showFailStake, showBindPAddress, setCurrentAppState, setCurrentPopup, closeCurrentPopup, showValidatorInvalid } from "./dapp-ui.js";
import { walletConnectEVMParams } from "./dapp-globals.js";
import { switchClaimButtonColor, switchClaimButtonColorBack, showClaimRewards } from "./dapp-claim.js";
import { LedgerEVMSingleSign } from "./dapp-ledger.js";

export async function ConnectPChainClickStake(DappObject, HandleClick, PassedPublicKey, PassedEthAddr, addressIndex) {
    DappObject.isHandlingOperation = true;

    clearTimeout(DappObject.latestPopupTimeoutId);

    checkConnection();

    await setCurrentAppState("Connecting");

    await setCurrentPopup("Connecting...", true);

    DappObject.isAccountConnected = false;

    // console.log("PassedPublicKey:");
    // console.log(PassedPublicKey);
    // console.log(!PassedPublicKey);

    if (!PassedPublicKey) {
        document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    }

    let rpcUrl = "https://sbi.flr.ftsocan.com/ext/C/rpc";

    let flrAddr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

    let web32 = new Web3(rpcUrl);

    let message = "You are enabling the FTSOCAN DApp to access your accounts PUBLIC key to derive your P-Chain address. Additionally, you are acknowledging the risks involved with staking on Flare and the usage of the MetaMask 'eth_sign' functionality. \n\nWE ARE NOT RESPONSIBLE FOR ANY LOSSES OF FUNDS AFTER STAKING. CONTINUE AT YOUR OWN RISK!";

    try {
        let flrPublicKey;

        let account;

        let selectize;

        if (addressIndex) {
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
                await getLedgerApp(requiredApp).then(async result => {
                    switch (result) {
                        case "Success":
                            await wait(3000);
    
                            if (!Array.isArray(DappObject.ledgerAddrArray) || !DappObject.ledgerAddrArray.length) {
                                // console.log("Fetching Addresses... P-Chain");
                                let addresses = await getLedgerAddresses("flare", DappObject.isAvax);
        
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
        
                            document.getElementById("ConnectWalletText").innerHTML = '<select id="select-account" class="connect-wallet-text" placeholder="Select Account"></select>';
    
                            if (!document.querySelector("span.title.connect-wallet-text")) {
                                var onInputChange = async (value) => {
                                    let addressBox = document.querySelector("span.title.connect-wallet-text");
                                    let ethaddr = addressBox.getAttribute('data-ethkey');
                                    let pubKey = addressBox.getAttribute('data-pubkey');
                                    
                                    flrPublicKey = pubKey;
        
                                    // console.log("flrPublicKey: ");
                                    // console.log(flrPublicKey);
            
                                    account = ethaddr;
            
                                    DappObject.selectedAddress = account;
            
                                    DappObject.ledgerSelectedIndex = value;
            
                                    let unprefixed = await publicKeyToBech32AddressString(flrPublicKey, "flare");
            
                                    DappObject.unPrefixedAddr = unprefixed;
             
                                    ConnectPChainClickStake(DappObject, HandleClick, flrPublicKey, ethaddr, value);
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
                                    document.getElementById("ConnectPChain").removeEventListener("click", HandleClick);
                                }
            
                                if (DappObject.ledgerSelectedIndex !== "") {
                                    selectize.setValue([Number(DappObject.ledgerSelectedIndex)]);
                                } else {
                                    await setCurrentPopup("Please select an account.", true);
                                }
                            } else {
                                let addressDropdown = document.querySelector("span.title.connect-wallet-text");
                                
                                let publicKey = addressDropdown?.getAttribute('data-pubkey');
                                    
                                flrPublicKey = publicKey;
                            }
                            break
                        case "Failed: App not Installed":
                            await setCurrentAppState("Alert");
    
                            clearTimeout(DappObject.latestPopupTimeoutId);
    
                            DappObject.latestPopupTimeoutId = setTimeout( async () => {
                                await setCurrentPopup("Whoops! Looks like you do not have the Avalanche App installed on your Ledger device! Please install it and come back again later!", true);
                            }, 1000);
    
                            throw new Error("Ledger Avalanche App not installed!");
                            break
                        case "Failed: User Rejected":
                            ConnectPChainClickStake(DappObject, HandleClick);
                            break
                    }
                });
            } else {
                if (DappObject.walletIndex === 2) {
                    if (DappObject.chosenEVMProvider === undefined) {
                        DappObject.chosenEVMProvider = await walletConnectProvider.init(walletConnectEVMParams);
                    }
        
                    if (!DappObject.chosenEVMProvider.session) {
                        await DappObject.chosenEVMProvider.connect();
                    }
        
                    if (!DappObject.chosenEVMProvider.session.namespaces.eip155.methods.includes("eth_sign")) {                       
                        let signSpinner = $.confirm({
                            escapeKey: false,
                            backgroundDismiss: false,
                            icon: 'fa fa-spinner fa-spin',
                            title: 'Loading...',
                            content: "Sorry!<br /> Your wallet does not support 'eth_sign'!<br /> You will not be able to stake using the FTSOCAN DApp.",
                            theme: 'material',
                            type: 'dark',
                            typeAnimated: true,
                            draggable: false,
                            buttons: {
                                ok: {
                                    action: function () {
                                        getDappPage(4);
                                    },
                                },
                            },
                            onContentReady: async function () {
                            }
                        });
        
                        return
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
    
                    let signSpinner = $.confirm({
                        escapeKey: false,
                        backgroundDismiss: false,
                        icon: 'fa fa-spinner fa-spin',
                        title: 'Loading...',
                        content: 'Waiting for signature confirmation. <br />Remember to turn on "eth_sign"...',
                        theme: 'material',
                        type: 'dark',
                        typeAnimated: true,
                        draggable: false,
                        buttons: {
                            ok: {
                                isHidden: true, // hide the button
                            },
                        },
                        onContentReady: async function () {
                        }
                    });
    
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
    
                    signSpinner.close();
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
                document.getElementById("ConnectPChain").removeEventListener("click", HandleClick);
            }

            await setCurrentAppState("Connected");

            closeCurrentPopup();

            // await setCurrentPopup("Connected to account: " + account.slice(0, 17));

            DappObject.isAccountConnected = true;
        }

        // console.log(flrPublicKey);

        if (flrPublicKey) {
            const addressBinderAddr = await GetContract("AddressBinder", rpcUrl, flrAddr);

            const AddressBinderContract = new web32.eth.Contract(DappObject.addressBinderAbiLocal, addressBinderAddr);

            const ethAddressString = await publicKeyToEthereumAddressString(flrPublicKey);

            const CchainAddr = ethers.utils.getAddress(ethAddressString);

            const PchainAddr = await publicKeyToBech32AddressString(flrPublicKey, "flare");

            DappObject.unPrefixedAddr = PchainAddr;

            DappObject.selectedAddress = account;

            const PchainAddrEncoded = await publicKeyToPchainEncodedAddressString(flrPublicKey);
                
            const addressPchain = await AddressBinderContract.methods.cAddressToPAddress(CchainAddr).call();

            if (addressPchain !== "0x0000000000000000000000000000000000000000") {

                const prefixedPchainAddress = "P-" + PchainAddr;

                const PchainBalanceObject = await getPchainBalanceOf(prefixedPchainAddress);

                const PchainBalanceBigInt = BigInt(PchainBalanceObject.balance);

                const balance = await web32.eth.getBalance(account);

                let addressBox = document.querySelector("span.title.connect-wallet-text");

                if (DappObject.walletIndex === 1) {          
                    addressBox.innerText = prefixedPchainAddress;
                } else {
                    showAccountAddress(prefixedPchainAddress);
                }

                if (dappStakingOption === 1) {
                    if (DappObject.transferBool === true) {
                        showBalance(round(web32.utils.fromWei(balance, "ether")));

                        showPchainBalance(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));
                    } else {
                        showBalance(round(web32.utils.fromWei(PchainBalanceBigInt, "gwei")));

                        showPchainBalance(round(web32.utils.fromWei(balance, "ether")));
                    }

                    await setCurrentPopup("This is the 'Transfer' page, where you can transfer your FLR tokens from the C-Chain to the P-Chain, to enable you to stake to a validator node and earn passive income!", true);

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    DappObject.latestPopupTimeoutId = setTimeout( async () => {
                        await setCurrentPopup("First, choose if you would like to send your tokens from, or to the P-Chain by clicking on the arrow button. Then, input the amount of tokens you would like to transfer. Don't forget to keep some FLR for gas fees!", true);
                    }, 15000);
                } else if (dappStakingOption === 2) {
                    let delegatedIcon1 = document.getElementById("delegatedIcon1");
                    delegatedIcon1.src = dappUrlBaseAddr + 'img/FLR.svg';
                
                    try {                 
                        customInput(PchainBalanceBigInt, DappObject);
                    
                        await populateValidators();
                    } catch (error) {
                        // console.log(error);
                    }

                    await setCurrentPopup("This is the 'Stake' page, where you can stake your FLR tokens (at least 50,000) to a validator node and earn passive income!", true);

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    DappObject.latestPopupTimeoutId = setTimeout( async () => {
                        await setCurrentPopup("First, choose a validator from the dropdown list. Then, enter for how many days you would like to stake in the calendar, because your FLR will be locked until that date. Finally, enter the amount you would like to stake to that validator (at least 50,000).", true);
                    }, 15000);
                } else if (dappStakingOption === 3) {
                    const ValidatorRewardAddr = await GetContract("ValidatorRewardManager", rpcUrl, flrAddr);

                    const ValidatorRewardContract = new web32.eth.Contract(DappObject.validatorRewardAbiLocal, ValidatorRewardAddr);

                    const StakeAmounts = await getStakeOf(DappObject.unPrefixedAddr);

                    showPchainBalance(round(web32.utils.fromWei(StakeAmounts.staked, "gwei")));
                    showStakeRewards(0);
                    showConnectedAccountAddress(prefixedPchainAddress.slice(0, 20) + "...");

                    // Changing the color of Claim button.
                    if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
                        switchClaimButtonColor();
                        
                        DappObject.claimBool = true;
                    } else {
                        switchClaimButtonColorBack();

                        DappObject.claimBool = false;
                    }

                    // Getting the unclaimed Rewards and affecting the Claim button.
                    const RewardStates = await ValidatorRewardContract.methods.getStateOfRewards(DappObject.selectedAddress).call();

                    let totalReward = RewardStates[0];
                    let claimedReward = RewardStates[1];

                    let unclaimedAmount = totalReward - claimedReward;

                    const convertedRewards = web32.utils.fromWei(unclaimedAmount, "ether").split('.');

                    // console.log(unclaimedAmount);
                    
                    // Changing the color of Claim button.
                    showClaimRewards(convertedRewards[0] + "." + convertedRewards[1].slice(0, 2));

                    // Changing the color of Claim button.
                    if (Number(document.getElementById('ClaimButtonText').innerText) >= 1) {
                        switchClaimButtonColor();
                        
                        DappObject.claimBool = true;
                    } else {
                        switchClaimButtonColorBack();

                        DappObject.claimBool = false;
                    }

                    await setCurrentPopup("This is the 'Claim' page, where you can claim the FLR tokens that you have earned by staking to a validator node.", true);

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    DappObject.latestPopupTimeoutId = setTimeout( async () => {
                        await setCurrentPopup("If you have any rewards, the bottom button will become red and contain the amount of rewards you have earned. You only need to click it to begin the claiming process!", true);
                    }, 15000);
                }

                DappObject.isHandlingOperation = false;
            } else {
                await showBindPAddress(AddressBinderContract, web32, account, flrPublicKey, PchainAddrEncoded, DappObject, dappStakingOption);
            }
        } else {
            document.getElementById("ConnectPChain").removeEventListener("click", HandleClick);

            DappObject.isHandlingOperation = false;
        }
    } catch (error) {
        // console.log(error);

        document.getElementById("ConnectWalletText").innerText = "Connect to P-Chain";

        await resetDappObjectState(DappObject);

        var ClickHandler;

        if (HandleClick) {
            document.getElementById("ConnectPChain").removeEventListener("click", HandleClick);
        }

        document.getElementById("ConnectPChain")?.addEventListener("click", ClickHandler = async () => {
            ConnectPChainClickStake(DappObject, ClickHandler);
        });
    }
}

export function createCalendar(DappObject) {
    $.widget('ui.spinner', $.ui.spinner, {
        _buttonHtml: function() {
          return '<span class="ui-spinner-button ui-spinner-up">' +
            '<i class="fa fa-solid fa-angle-up"></i>' +
          '</span>' +
          '<span class="ui-spinner-button ui-spinner-down">' +
            '<i class="fa fa-solid fa-angle-down"></i></span>';
        }
    });

    const now = new Date();

    const validatorMinDate = new Date(Number(DappObject.StakeMinDate) * 1000);

    let minimumDate;

    if (Math.sign(now - validatorMinDate) === 1) {
        minimumDate = now;
    } else {
        minimumDate = validatorMinDate;
    }

    minimumDate.setDate(minimumDate.getDate() + 15);

    const maximumDate = new Date(Number(DappObject.StakeMaxDate) * 1000);

    var prevMaxDate = $('#calendar').datepicker( "option", "maxDate" );

    var OnSelectCalendar = async (selectedDateTime) => {
        if (selectedDateTime !== '') {
            let dateArray = selectedDateTime.split(' ');
            DappObject.selectedDateTime = dateArray[0] + "T" + dateArray[1];
            isStakeInput1(DappObject);
        }
    }

    if (prevMaxDate !== maximumDate && prevMaxDate !== null) {
        $('#calendar').datepicker( "option", "maxDate", maximumDate );
        $('#calendar').datepicker( "option", "minDate", minimumDate );
    } else {
        $('#calendar').datetimepicker({
            showAnim: "drop",
            minDate: minimumDate,
            maxDate: maximumDate,
            selectOtherMonths: true,
            hideIfNoPrevNext: true,
            controlType: 'select',
            oneLine: true,
            dateFormat: 'yy-mm-dd',
            timeFormat: 'HH:mm',
            currentText: "MAX",
            onClose: function (selectedDateTime, inst) {
                OnSelectCalendar(selectedDateTime);
            },
            beforeShow: function( inst ) {
                setTodayCalendarButton(inst);

                inst.selectedDay = maximumDate.getDate();
                inst.drawMonth = inst.selectedMonth = maximumDate.getMonth();
                inst.drawYear = inst.selectedYear = maximumDate.getFullYear();
                $('#calendar').datepicker('setDate', minimumDate);
            },
            onChangeMonthYear: function( year, month, inst ) {
                setTodayCalendarButton(inst);
            }
        });
    }

    $('#calendar').datepicker('setDate', minimumDate);
}

export function setTodayCalendarButton(inst) {
    setTimeout(function(){
        var buttonPane = $(".ui-datepicker-buttonpane");

        const maximumDate = new Date(Number(DappObject.StakeMaxDate) * 1000);
        
        var btn = $("<button id='calendarMax' type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all'>MAX</button>");
        
        btn.off("click").on("click", function () {
            inst.selectedDay = maximumDate.getDate();
            inst.drawMonth = inst.selectedMonth = maximumDate.getMonth();
            inst.drawYear = inst.selectedYear = maximumDate.getFullYear();
            $('#calendar').datepicker('setDate', maximumDate);
        });
        
        // Check if buttonPane has that button
        
        if( buttonPane.has('#calendarMax').length == 0 ) {
            btn.appendTo( buttonPane );
        }
    }, 1 );
}

export async function RefreshStakingPage(DappObject, stakingOption) {
    DappObject.isHandlingOperation = true;

    setCurrentAppState("Connecting");

    setCurrentPopup("Connecting...", true);

    ConnectPChainClickStake(DappObject);
}

export async function GetPublicKey(address, message, signature) {
    const messageHash = ethers.utils.hashMessage(message);
    const recoveredPublicKey = ethers.utils.recoverPublicKey(messageHash, signature);

    // To confirm the signer's address, you can compute the Ethereum address from the recovered public key
    const recoveredAddress = ethers.utils.computeAddress(recoveredPublicKey);
  
    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
        return recoveredPublicKey;
    } else {
        throw new Error("Failed to verify signer.");
    }
}

export async function showPchainBalance(Pchainbalance) {
    document.getElementById("TokenBalance").innerText = Pchainbalance;
}

export async function toggleTransferButton(DappObject, stakingOption) {
    var transferIcon = document.getElementById("TransferIcon");

    var fromText = document.getElementById("FromText");
    var toText = document.getElementById("ToText");

    // Switching wrap/unwrap.
    if (DappObject.transferBool === true) {

        DappObject.transferBool = false;
        setTransferButton2(DappObject);

        fromText.style.color = "#000";
        toText.style.color = "#fd000f";
        fromText.innerText = "P";
        toText.innerText = "C";
    } else {
        DappObject.transferBool = true;
        setTransferButton(DappObject);

        fromText.style.color = "#fd000f";
        toText.style.color = "#000";
        fromText.innerText = "C";
        toText.innerText = "P";
    }

    RefreshStakingPage(DappObject, stakingOption);
}

// Is there a valid input?
export function setTransferButton(DappObject) {
    var wrapButton = document.getElementById("WrapButton");
    var wrapButtonText = document.getElementById("WrapButtonText");

    if (Number(document.getElementById("AmountFrom").value.replace(/[^0-9]/g, '')) < 1) {
        wrapButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        wrapButton.style.cursor = "auto";
        wrapButtonText.innerText = "Enter Amount";
        DappObject.isRealValue = false;
    } else {
        wrapButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        wrapButton.style.cursor = "pointer";
        DappObject.isRealValue = true;

        wrapButtonText.innerText = "Transfer Funds";
    }
}

export function setTransferButton2(DappObject) {
    var wrapButton = document.getElementById("WrapButton");
    var wrapButtonText = document.getElementById("WrapButtonText");

    if (Number(document.getElementById("AmountTo").value.replace(/[^0-9]/g, '')) < 1) {
        wrapButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        wrapButton.style.cursor = "auto";
        wrapButtonText.innerText = "Enter Amount";
        DappObject.isRealValue = false;
    } else {
        wrapButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        wrapButton.style.cursor = "pointer";
        DappObject.isRealValue = true;

        wrapButtonText.innerText = "Transfer Funds";
    }
}

// Copy the input.
export function copyTransferInput() {
    let amountFrom = document.getElementById("AmountFrom");
    let amountTo = document.getElementById("AmountTo");
    let newValue = ''
    
    if (isNumber(amountTo.value)) {
        newValue = amountTo.value;
    }

    amountFrom.value = newValue;
}

// Transfer button

export async function transferTokens(DappObject, stakingOption) {
    if (DappObject.isRealValue === false) {
        await setCurrentPopup('You need to enter a valid amount of tokens: a number that is not greater than your balance.', true);
    } else {
        DappObject.isHandlingOperation = true;

        let rpcUrl = "https://sbi.flr.ftsocan.com/ext/C/rpc";

        var web32 = new Web3(rpcUrl);

        try {
            var amountFrom = document.getElementById("AmountFrom");
            var amountTo = document.getElementById("AmountTo");
            const amountFromValue = amountFrom.value;

            if (!isNumber(amountFromValue)) {
                await setCurrentPopup('The amount you have entered is not a number!', true);
            } else {
                const amountFromValueInt = web32.utils.toWei(amountFromValue, "gwei");

                if (DappObject.transferBool === true) {
                    // C-chain to P-chain

                    const nonce = await web32.eth.getTransactionCount(DappObject.selectedAddress);

                    let cChainTransactionId;

                    let pChainTransactionId;

                    // export tokens C-Chain

                    try {
                        showConfirmationSpinnerTransfer(async (spinner) => {
                            try {
                                const cChainTxId = await exportTokensP(DappObject.unPrefixedAddr, DappObject.selectedAddress, undefined, nonce, amountFromValueInt, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                                    return new Promise((resolve, reject) => {
                                        // console.log("C Chain TX ID: " + result.txid);

                                        cChainTransactionId = result.txid;
                                        
                                        try {
                                            let status = waitCchainAtomicTxStatus(result.txid).then(value => {

                                                switch (value) {
                                                    case "Accepted":
                                                        spinner.$content.find('#ExportTxStatus').html('Accepted');
                                                        spinner.$content.find('#ExportTxIcon').removeClass();
                                                        spinner.$content.find('#ExportTxIcon').addClass("fa fa-solid fa-check");
                                                        setTimeout(() => {
                                                            resolve("Success");
                                                        }, 1500);
                                                        break
                                                    case "Dropped":
                                                        spinner.$content.find('#ExportTxStatus').html('Dropped');
                                                        spinner.$content.find('#ExportTxIcon').removeClass();
                                                        spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                        resolve("Failed");
                                                        spinner.close();
                                                        showFailStake(DappObject, stakingOption);
                                                        break
                                                    case "Unknown":
                                                        spinner.$content.find('#ExportTxStatus').html('Unknown');
                                                        spinner.$content.find('#ExportTxIcon').removeClass();
                                                        spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                        setTimeout(() => {
                                                            resolve("Unknown");
                                                        }, 1500);
                                                        break
                                                    default:
                                                        break
                                                }
                                            });
                                        } catch (error) {
                                            // console.log(error);
                                            throw error;
                                        }
                                    });
                                }).then(async result => {
                                    if (result == "Success" || result == "Unknown") {
                                        document.getElementById('ImportTxStatus').innerText = 'Please check your Wallet...';
                                        const pChainTxId = await importTokensP(DappObject.unPrefixedAddr, DappObject.selectedAddress, undefined, 1, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                                            // console.log("P Chain TX ID: " + result.txid);
            
                                            pChainTransactionId = result.txid;
                                            try {
                                                let status = waitCchainAtomicTxStatus(result.txid).then(value => {
        
                                                    switch (value) {
                                                        case "Accepted":
                                                            spinner.$content.find('#ExportTxStatus').html('Accepted');
                                                            spinner.$content.find('#ExportTxIcon').removeClass();
                                                            spinner.$content.find('#ExportTxIcon').addClass("fa fa-solid fa-check");
                                                            setTimeout(() => {
                                                                resolve("Success");
                                                            }, 1500);
                                                            break
                                                        case "Dropped":
                                                            spinner.$content.find('#ExportTxStatus').html('Dropped');
                                                            spinner.$content.find('#ExportTxIcon').removeClass();
                                                            spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                            resolve("Failed");
                                                            spinner.close();
                                                            showFailStake(DappObject, stakingOption);
                                                            break
                                                        case "Unknown":
                                                            spinner.$content.find('#ExportTxStatus').html('Unknown');
                                                            spinner.$content.find('#ExportTxIcon').removeClass();
                                                            spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                            setTimeout(() => {
                                                                resolve("Unknown");
                                                            }, 1500);
                                                            break
                                                        default:
                                                            break
                                                    }
                                                });
                                            } catch (error) {
                                                // console.log(error);
                                                throw error;
                                            }
                                        });
                                    }
                                }).then(async result => {
                                        if (result == "Success" || result == "Unknown") {
                                            document.getElementById('ImportTxStatus').innerText = 'Please check your Wallet...';
                                            const pChainTxId = await importTokensP(DappObject.unPrefixedAddr, DappObject.selectedAddress, undefined, 1, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                                                // console.log("P Chain TX ID: " + result.txid);
                
                                                pChainTransactionId = result.txid;
                                            
                                                try {
                                                    let status = waitPchainAtomicTxStatus(result.txid).then(value => {
                
                                                        switch (value) {
                                                            case "Committed":
                                                                spinner.$content.find('#ImportTxStatus').html('Committed');
                                                                spinner.$content.find('#ImportTxIcon').removeClass();
                                                                spinner.$content.find('#ImportTxIcon').addClass("fa fa-solid fa-check");
                                                                spinner.close();
                                                                showConfirmStake(DappObject, stakingOption, [cChainTransactionId,pChainTransactionId]);
                                                                break
                                                            case "Dropped":
                                                                spinner.$content.find('#ImportTxStatus').html('Dropped');
                                                                spinner.$content.find('#ImportTxIcon').removeClass();
                                                                spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                                spinner.close();
                                                                showFailStake(DappObject, stakingOption);
                                                                break
                                                            case "Unknown":
                                                                spinner.$content.find('#ImportTxStatus').html('Unknown');
                                                                spinner.$content.find('#ImportTxIcon').removeClass();
                                                                spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                                spinner.close();
                                                                showFailStake(DappObject, stakingOption);
                                                                break
                                                            default:
                                                                break
                                                        }
                                                    });
                                                } catch (error) {
                                                    // console.log(error);
                                                    throw error;
                                                }
                                            });
                                        };
                                    });
                            } catch (error) {
                                DappObject.isHandlingOperation = false;

                                showFailStake(DappObject, stakingOption);

                                throw error
                            }
                        });
                    } catch (error) {
                        // console.log("ERROR C-chain to P-chain");
                        throw error;
                    }
                } else {
                    // P-chain to C-chain

                    let cChainTransactionId;

                    let pChainTransactionId;

                    // export tokens P-Chain

                    try {
                        showConfirmationSpinnerTransfer(async (spinner) => {
                            try {
                                const pChainTxId = await exportTokensC(DappObject.unPrefixedAddr, DappObject.selectedAddress, undefined, amountFromValueInt, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                                    return new Promise((resolve, reject) => {
                                        // console.log("P Chain TX ID: " + result);

                                        pChainTransactionId = result;
                                    
                                        try {
                                            let status = waitPchainAtomicTxStatus(result).then(value => {

                                                switch (value) {
                                                    case "Committed":
                                                        spinner.$content.find('#ExportTxStatus').html('Committed');
                                                        spinner.$content.find('#ExportTxIcon').removeClass();
                                                        spinner.$content.find('#ExportTxIcon').addClass("fa fa-solid fa-check");
                                                        setTimeout(() => {
                                                            resolve("Success");
                                                        }, 1500);
                                                        break
                                                    case "Dropped":
                                                        spinner.$content.find('#ExportTxStatus').html('Dropped');
                                                        spinner.$content.find('#ExportTxIcon').removeClass();
                                                        spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                        resolve("Failed");
                                                        spinner.close();
                                                        showFailStake(DappObject, stakingOption);
                                                        break
                                                    case "Unknown":
                                                        spinner.$content.find('#ExportTxStatus').html('Unknown');
                                                        spinner.$content.find('#ExportTxIcon').removeClass();
                                                        spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                        setTimeout(() => {
                                                            resolve("Unknown");
                                                        }, 1500);
                                                        break
                                                    default:
                                                        break
                                                }
                                            });
                                        } catch (error) {
                                            // console.log(error);
                                            throw error;
                                        }
                                    });
                                }).then(async result => {
                                    if (result == "Success" || result == "Unknown") {
                                        document.getElementById('ImportTxStatus').innerText = 'Please check your Wallet...';
                                        const cChainTxId = await importTokensC(DappObject.unPrefixedAddr, DappObject.selectedAddress, undefined, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                                            // console.log("C Chain TX ID: " + result);

                                            cChainTransactionId = result;

                                            try {
                                                let status = waitPchainAtomicTxStatus(result).then(value => {
        
                                                    switch (value) {
                                                        case "Committed":
                                                            spinner.$content.find('#ExportTxStatus').html('Committed');
                                                            spinner.$content.find('#ExportTxIcon').removeClass();
                                                            spinner.$content.find('#ExportTxIcon').addClass("fa fa-solid fa-check");
                                                            setTimeout(() => {
                                                                resolve("Success");
                                                            }, 1500);
                                                            break
                                                        case "Dropped":
                                                            spinner.$content.find('#ExportTxStatus').html('Dropped');
                                                            spinner.$content.find('#ExportTxIcon').removeClass();
                                                            spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                            resolve("Failed");
                                                            spinner.close();
                                                            showFailStake(DappObject, stakingOption);
                                                            break
                                                        case "Unknown":
                                                            spinner.$content.find('#ExportTxStatus').html('Unknown');
                                                            spinner.$content.find('#ExportTxIcon').removeClass();
                                                            spinner.$content.find('#ExportTxIcon').addClass("fa fa-warning");
                                                            setTimeout(() => {
                                                                resolve("Unknown");
                                                            }, 1500);
                                                            break
                                                        default:
                                                            break
                                                    }
                                                });
                                            } catch (error) {
                                                // console.log(error);
                                                throw error;
                                            }
                                        });
                                    }
                                }).then(async result => {
                                    if (result == "Success" || result == "Unknown") {
                                        document.getElementById('ImportTxStatus').innerText = 'Please check your Wallet...';
                                        const cChainTxId = await importTokensC(DappObject.unPrefixedAddr, DappObject.selectedAddress, undefined, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                                            // console.log("C Chain TX ID: " + result);
    
                                            cChainTransactionId = result;
                                            
                                            try {
                                                let status = waitCchainAtomicTxStatus(result).then(value => {
    
                                                    switch (value) {
                                                        case "Accepted":
                                                            spinner.$content.find('#ImportTxStatus').html('Accepted');
                                                            spinner.$content.find('#ImportTxIcon').removeClass();
                                                            spinner.$content.find('#ImportTxIcon').addClass("fa fa-solid fa-check");
                                                            spinner.close();
                                                            showConfirmStake(DappObject, stakingOption, [pChainTransactionId,cChainTransactionId]);
                                                            break
                                                        case "Dropped":
                                                            spinner.$content.find('#ImportTxStatus').html('Dropped');
                                                            spinner.$content.find('#ImportTxIcon').removeClass();
                                                            spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                            spinner.close();
                                                            showFailStake(DappObject, stakingOption);
                                                            break
                                                        case "Unknown":
                                                            spinner.$content.find('#ImportTxStatus').html('Unknown');
                                                            spinner.$content.find('#ImportTxIcon').removeClass();
                                                            spinner.$content.find('#ImportTxIcon').addClass("fa fa-warning");
                                                            spinner.close();
                                                            showFailStake(DappObject, stakingOption);
                                                            break
                                                        default:
                                                            break
                                                    }
                                                });
                                            } catch (error) {
                                                // console.log(error);
                                                throw error;
                                            }   
                                        });
                                    };
                                });
                            } catch (error) {
                                    DappObject.isHandlingOperation = false;

                                    showFailStake(DappObject, stakingOption);

                                    throw error
                            }
                        });
                    } catch (error) {
                        // console.log("ERROR P-chain to C-chain");
                        throw error;
                    }
                }

                if (typeof amountFrom !== 'undefined' && amountFrom != null && typeof amountTo !== 'undefined' && amountTo != null) {
                    amountFrom.value = "";
                    amountTo.value = "";
                }

                setTransferButton(DappObject);

                DappObject.isHandlingOperation = false;
            }
        } catch (error) {
            // console.log(error);

            DappObject.isHandlingOperation = false;

            showFailStake(DappObject, stakingOption);
        }
    }
}

export function isStakeInput1(DappObject) {
    let claimButton = document.getElementById("WrapButton");

    let select1 = document.getElementById('select-validator').childNodes[0];

    let amount1 = document.getElementById("Amount1");

    if (select1.value !== "" && amount1.value !== "" && amount1.value !== "0" && DappObject.selectedDateTime !== "") {
        claimButton.style.backgroundColor = "rgba(253, 0, 15, 0.8)";
        claimButton.style.cursor = "pointer";
        DappObject.isRealValue = true;
        document.getElementById("WrapButtonText").innerText = "Stake";
    } else {
        claimButton.style.backgroundColor = "rgba(143, 143, 143, 0.8)";
        claimButton.style.cursor = "auto";
        document.getElementById("WrapButtonText").innerText = "Enter Amount";
        DappObject.isRealValue = false;
    }
}

// Populate select elements.
export async function populateValidators() {
    return new Promise(async (resolve) => {
        var insert = [];

        try {

            var control;

            const ftsoList = await getValidators();

            var onInputChange = async (value) => {
                document.getElementById("calendar").title = "";

                let ftso1 = document.querySelector(".selectize-input");
                let img = ftso1.childNodes[0].childNodes[0].getAttribute('data-img');
                let delegatedicon = document.getElementById("delegatedIcon1");
                DappObject.StakeMinDate = ftso1.childNodes[0].childNodes[0].getAttribute('data-startdate');
                DappObject.StakeMaxDate = ftso1.childNodes[0].childNodes[0].getAttribute('data-enddate');

                let StakeMaxDateBuffer = new Date((Number(DappObject.StakeMaxDate) * 1000) - ((24*60*60*1000) * 14));

                if (Date.now() >= StakeMaxDateBuffer) {
                    showValidatorInvalid(control, delegatedicon);
                } else {
                    delegatedicon.src = img;
                    createCalendar(DappObject);
                    isStakeInput1(DappObject);
                }
            }


            var $select = $('#select-validator').selectize({
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: ["title", "nodeid"],
                render: {
                    item: function (item, escape) {
                        return (
                        "<div>" +
                        (item.title
                            ? `<span class="title" data-img=${item.img} data-addr=${item.nodeid} data-startdate=${item.startdate} data-enddate=${item.enddate}>` + escape(item.title) + "</span>"
                            : "") +
                        "</div>"
                        );
                    },
                    option: function (item, escape) {
                        var label = item.title || item.nodeid;
                        var caption = item.title ? item.nodeid : null;
                        return (
                        "<div>" +
                        '<span class="ftso-name">' +
                        escape(label) +
                        "</span>" +
                        (caption
                            ? '<span class="ftso-address">' + escape(caption) + "</span>"
                            : "") +
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

            control = $select[0].selectize;

            // Origin: https://api-flare-validators.flare.network/api/v1/validator
            fetch(dappUrlBaseAddr + 'validatorlist.json')
                .then(res => res.json())
                .then(FtsoInfo => {
                    FtsoInfo.sort((a, b) => a.name > b.name ? 1 : -1);

                    let indexNumber;

                    let g = 1;

                    for (var f = 0; f < FtsoInfo.length; f++) {
                        for (var i = 0; i < ftsoList.length; i++) {
                            if (FtsoInfo[f].lastStatus === "ONLINE") {
                                if (FtsoInfo[f].nodeId === ftsoList[i].nodeID) {
                                    indexNumber = f;
    
                                    //<img src="https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets/${delegatedFtsos[i]}.png" class="delegatedIcon" id="delegatedIcon"/>
                                    if (FtsoInfo[indexNumber].name === "FTSOCAN") {
                                        // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                        insert[0] = {
                                            id: 0,
                                            title: FtsoInfo[indexNumber].name,
                                            nodeid: ftsoList[i].nodeID,
                                            img: dappUrlBaseAddr + "assets/" + FtsoInfo[indexNumber].nodeId + ".png",
                                            startdate: ftsoList[i].startTime,
                                            enddate: ftsoList[i].endTime
                                        }; 
                                    } else {
                                        // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                        insert[g] = {
                                            id: g,
                                            title: FtsoInfo[indexNumber].name,
                                            nodeid: ftsoList[i].nodeID,
                                            img: dappUrlBaseAddr + "assets/" + FtsoInfo[indexNumber].nodeId + ".png",
                                            startdate: ftsoList[i].startTime,
                                            enddate: ftsoList[i].endTime
                                        }; 
    
                                        g += 1;
                                    }
                                }
                            }
                        }
                    }

                control.clearOptions();

                for (var z = 0; z < insert.length; z++) {
                    control.addOption({
                        id: insert[z].id,
                        title: insert[z].title,
                        nodeid: insert[z].nodeid,
                        img: insert[z].img,
                        startdate: insert[z].startdate,
                        enddate: insert[z].enddate
                    });
                }
            });
        } catch (error) {
            // console.log(error)
        }

        resolve();
    })
}

//Custom Input 

export async function customInput(Pbalance, DappObject) {
    $('<div class="stake-amount-nav"><div id="stakeAmountUp" class="stake-amount-button stake-amount-button-up fa fa-solid fa-angle-up"></div><div id="stakeAmountDown" class="stake-amount-button stake-amount-button-down fa fa-solid fa-angle-down"></div><div id="stakeAmountMax" class="stake-amount-button stake-amount-button-max">MAX</div></div>').insertAfter("#stakeAmount input");

    let spinner = $("#stakeAmount");

    let input = document.getElementById("Amount1");

    let btnUp = spinner.find("#stakeAmountUp");

    let btnDown = spinner.find("#stakeAmountDown");

    let btnMax = spinner.find("#stakeAmountMax");

    let min = input.getAttribute("min");
    let max = input.getAttribute("max");

    btnUp.on("click", function() {
        var oldValue = input.value;

        var newVal;

        if (Number(oldValue.slice(0, -1)) == 0) {
            newVal = "50k";
        } else {
            if (oldValue.endsWith("k") && Number(oldValue.slice(0, -1)) + 50 > max) {
                newVal = "1M";
            } else if (oldValue.endsWith("M") && Number(oldValue.slice(0, -1)) + 1 > 10) {
                newVal = "10M";
            } else {
                if (oldValue.endsWith("M")) {
                    newVal = String(Number(oldValue.slice(0, -1)) + 1) + "M";
                } else {
                    newVal = String(Number(oldValue.slice(0, -1)) + 50) + "k";
                }
            }
        }

        input.value = newVal;
        spinner.find("input").trigger("change");

        isStakeInput1(DappObject);
    });

    btnDown.on("click", function() {
        var oldValue = input.value;

        var newVal;

        if (Number(oldValue.slice(0, -1)) == 0) {
            newVal = "0";
        } else {
            if (oldValue.endsWith("k") && Number(oldValue.slice(0, -1)) - 50 < min) {
                newVal = "0";
            } else if (oldValue.endsWith("M") && Number(oldValue.slice(0, -1)) - 1 < 1) {
                newVal = "950k";
            } else {
                if (oldValue.endsWith("M")) {
                    newVal = String(Number(oldValue.slice(0, -1)) - 1) + "M";
                } else {
                    newVal = String(Number(oldValue.slice(0, -1)) - 50) + "k";
                }
            }
        }

        input.value = newVal;
        spinner.find("input").trigger("change");

        isStakeInput1(DappObject);
    });

    btnMax.on("click", function() {
        if (Pbalance / 1000000000n > 50000n) {
            var newVal = Number(Pbalance / 1000000000n / 50000n);

            input.value = String(newVal * 50) + "k";
        } else {
            input.value = "0";
        }

        spinner.find("input").trigger("change");

        isStakeInput1(DappObject);
    });

    btnMax.click();
}

// Staking function

export async function stake(DappObject, stakingOption) {
    DappObject.isHandlingOperation = true;

    let selectedDate = new Date(DappObject.selectedDateTime);

    let Days = new Date();

    const diffTime = Math.abs(selectedDate - Days);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let amount1 = document.getElementById("Amount1");
    let ftso1 = document.querySelector(".selectize-input");

    const prefixedPchainAddress = "P-" + DappObject.unPrefixedAddr;

    const PchainBalanceObject = await getPchainBalanceOf(prefixedPchainAddress);

    const PchainBalanceBigInt = BigInt(PchainBalanceObject.balance);

    var addr1 = ftso1.childNodes[0].childNodes[0].getAttribute('data-addr');

    let stakeAmount;

    if (amount1.value.endsWith("k")) {
        stakeAmount = BigInt(Number(amount1.value.slice(0, -1))) * 1000n * 1000000000n;
    } else {
        stakeAmount = BigInt(Number(amount1.value.slice(0, -1))) * 1000000n * 1000000000n;
    }

    amount1.value = "0";

    if (PchainBalanceBigInt < stakeAmount) {
        await setCurrentPopup('You have insufficient funds!', true);
    } else {

        let pChainTransactionId;

        try {
            showConfirmationSpinnerStake(async (spinner) => {
                try {
                    const PchainTxId = await addDelegator(DappObject.selectedAddress, DappObject.unPrefixedAddr, undefined, undefined, addr1, stakeAmount, diffDays, selectedDate.getHours(), 1, DappObject.walletIndex, DappObject.ledgerSelectedIndex).then(result => {
                        // console.log("P Chain TX ID: " + result);
    
                        pChainTransactionId = result;
                    
                        try {
                            let status = waitPchainAtomicTxStatus(result).then(value => {
    
                                switch (value) {
                                    case "Committed":
                                        spinner.close();
                                        showConfirmStake(DappObject, stakingOption, [pChainTransactionId]);
                                        break
                                    case "Dropped":
                                        spinner.close();
                                        showFailStake(DappObject, stakingOption);
                                        break
                                    case "Unknown":
                                        spinner.close();
                                        showFailStake(DappObject, stakingOption);
                                        break
                                    default:
                                        break
                                }
                            });
                        } catch (e) {
                            throw e;
                        }
                    });
                } catch (error) {
                    throw error;
                }
            });

            DappObject.isHandlingOperation = false;

            isStakeInput1(DappObject);
        } catch (error) {
            DappObject.isHandlingOperation = false;

            spinner.close();
                            
            showFailStake(DappObject, stakingOption);

            // console.log(error);
        }
    }
}

// Show current rewards.
export function showStakeRewards(rewards) {
    document.getElementById('ClaimButtonText').innerText = rewards == 0 ? '0' : rewards;
}

// Claim Staking rewards

export async function claimStakingRewards(DappObject, stakingOption) {
    DappObject.isHandlingOperation = true;

    let rpcUrl = "https://sbi.flr.ftsocan.com/ext/C/rpc";

    let flrAddr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";

    let web32 = new Web3(rpcUrl);

    try {
        const ValidatorRewardAddr = await GetContract("ValidatorRewardManager", rpcUrl, flrAddr);

        const ValidatorRewardContract = new web32.eth.Contract(DappObject.validatorRewardAbiLocal, ValidatorRewardAddr);

        const RewardStates = await ValidatorRewardContract.methods.getStateOfRewards(DappObject.selectedAddress).call();

        let totalReward = RewardStates[0];
        let claimedReward = RewardStates[1];

        let unclaimedAmount = totalReward - claimedReward;

        let txPayload = {};

        if (Number(document.getElementById('ClaimButtonText').innerText) > 0) {
            txPayload = {
                from: DappObject.selectedAddress,
                to: ValidatorRewardAddr,
                data: ValidatorRewardContract.methods.claim(DappObject.selectedAddress, DappObject.selectedAddress, unclaimedAmount, false).encodeABI(),
            };
            
            const transactionParameters = txPayload;

            if (DappObject.walletIndex === 1) {
                await LedgerEVMSingleSign(txPayload, DappObject, stakingOption, true);
            } else {
                showSpinner(async () => {
                    await DappObject.chosenEVMProvider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                    .then(txHash => showConfirmationSpinnerStake(async (spinner) => {
                        checkTxStake(txHash, web32, spinner, DappObject);
                    }))
                    .catch((error) => showFailStake(DappObject, 2));
                });
            }

            const StakeAmounts = await getStakeOf(DappObject.unPrefixedAddr);

            DappObject.isHandlingOperation = false;
            
            showClaimRewards(0);
            switchClaimButtonColorBack(DappObject.claimBool);
            showPchainBalance(round(web32.utils.fromWei(StakeAmounts.staked, "gwei")));
        } else {
            DappObject.isHandlingOperation = false;
        }
    } catch (error) {
        DappObject.isHandlingOperation = false;

        // console.log(error);
    }
}