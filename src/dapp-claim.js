import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";
import { round, isNumber, checkTx } from "./dapp-utils.js";
import { showSpinner, showConfirmationSpinner, showConfirmationSpinnerv2, showConfirm, showEmptyBucket, showFail, setCurrentPopup } from "./dapp-ui.js";
import { isDelegateInput1 } from "./dapp-delegate.js";
import { LedgerEVMSingleSign, LedgerEVMFtsoV2Sign } from "./dapp-ledger.js";

export async function getDelegatedProviders(account, web32, rpcUrl, flrAddr, DappObject) {
    var delegatedFtsoElement = document.getElementById('delegate-wrapbox');

    const wrappedTokenAddr = await GetContract("WNat", rpcUrl, flrAddr);
    let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
    let voterWhitelistAddr = await GetContract("VoterWhitelister", rpcUrl, flrAddr);
    let voterWhitelistContract = new web32.eth.Contract(DappObject.voterWhitelisterAbi, voterWhitelistAddr);

    // Getting which FTSO(s) the user has delegated to, the percentage of WNat he has
    // delegated,and the logo of said FTSO(s).
    const ftsoList = await voterWhitelistContract.methods.getFtsoWhitelistedPriceProviders(0).call();
    const ftsoJsonList = JSON.stringify(ftsoList);
    const delegatesOfUser = await tokenContract.methods.delegatesOf(account).call();
    const delegatedFtsos = delegatesOfUser[0];
    const BipsJson = delegatesOfUser[1];
    let Bips = [];

    if (typeof BipsJson[0] !== 'undefined' && BipsJson[0] != 0) {
        Bips = BipsJson[0] / 100n;
    } else {
        Bips = 0;
    }

    let insert1 = '';

    let bipsText = "";

    // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/next/bifrost-wallet.providerlist.json
    fetch(dappUrlBaseAddr + 'bifrost-wallet.providerlist.json')
        .then(res => res.json())
        .then(async FtsoInfo => {
                FtsoInfo.providers.sort((a, b) => a.name > b.name ? 1 : -1);

                var indexNumber;

                for (var f = 0; f < FtsoInfo.providers.length; f++) {
                    indexNumber = f;

                    for (var i = 0; i < delegatedFtsos.length; i++) {
                        if (FtsoInfo.providers[f].address === delegatedFtsos[i]) {
                            if (ftsoJsonList.includes(delegatedFtsos[i])) {
                                bipsText = "delegatedBips" + String(i + 1);
                                // Origin: https://raw.githubusercontent.com/TowoLabs/ftso-signal-providers/master/assets.
                                insert1 += `<div class="wrap-box-ftso" data-addr="${delegatedFtsos[i]}">
                                                <div class="row">
                                                    <div class="wrap-box-content">
                                                        <img src="${dappUrlBaseAddr}assets/${delegatedFtsos[i]}.png" alt="${FtsoInfo.providers[indexNumber].name}" class="delegated-icon" id="delegatedIcon"/>
                                                        <div class="ftso-identifier">
                                                            <span id="delegatedName">${FtsoInfo.providers[indexNumber].name}</span>
                                                        </div>
                                                        <div class="wrapper-ftso">
                                                            <span id=${bipsText}>${Bips}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="wrapper-claim">
                                                        <span>${dappStrings['dapp_provider']}:</span>
                                                        <span class="address-claim">${delegatedFtsos[i]}</span>
                                                    </div>
                                                </div>
                                            </div>`;
                            } else {
                                await setCurrentPopup(dappStrings["dapp_mabel_delegate_error2"], true);

                                document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
                                document.getElementById("ClaimButton").style.cursor = "pointer";
                                DappObject.isRealValue = true;
                                document.getElementById("ClaimButtonText").innerText = dappStrings['dapp_undelegate'];
                            }
                        }
                    }
                }

                let delegatedFtsoElementChildren = delegatedFtsoElement.getElementsByClassName('wrap-box-ftso');

                while (delegatedFtsoElementChildren[0]) {
                    delegatedFtsoElementChildren[0].parentNode.removeChild(delegatedFtsoElementChildren[0]);
                }

                delegatedFtsoElement.insertAdjacentHTML('afterbegin', insert1);

                if (dappOption === 2) {
                    isDelegateInput1(DappObject);
                }
            }
        );
}

export async function getRewardEpochIdsWithClaimableRewards(flareSystemsManager, rewardManager, account) {
    try {
        const startRewardEpochId = await rewardManager.methods.getNextClaimableRewardEpochId(account).call();

        const epochIds = await rewardManager.methods.getRewardEpochIdsWithClaimableRewards().call();

        let endRewardEpochId = epochIds._endEpochId;

        var rewardManagerIndex;

        var currentNetwork;

        for (const network in fetchTupleConfig.rewardManagerFtsoV2) {
            fetchTupleConfig.rewardManagerFtsoV2[network].findIndex(function(sub) {
                if (!rewardManagerIndex) {
                    if (sub.indexOf(rewardManager._address) !== -1) {
                        rewardManagerIndex = fetchTupleConfig.rewardManagerFtsoV2[network].indexOf(sub);

                        currentNetwork = network;

                        return true;
                    }
                }
            });
        }

        if (fetchTupleConfig.rewardManagerFtsoV2[currentNetwork][rewardManagerIndex][0] !== 0) {
            endRewardEpochId = BigInt(fetchTupleConfig.rewardManagerFtsoV2[currentNetwork][rewardManagerIndex][0]);
        }

        if (endRewardEpochId < startRewardEpochId) {
            return null;
        }

        let claimableRewardEpochIds = [];

        for ( let epochId = startRewardEpochId; epochId <= endRewardEpochId; epochId++ ) {
            const rewardsHash = await flareSystemsManager.methods.rewardsHash(epochId).call();
            const rewardHashSigned = Boolean(rewardsHash) && rewardsHash !== "0x0000000000000000000000000000000000000000000000000000000000000000";
            if (rewardHashSigned) {
                // console.log(epochId + " is claimable!");
                claimableRewardEpochIds.push(Number(epochId));
            }
        }

        if (claimableRewardEpochIds.length === 0) {
            return null;
        }

        return claimableRewardEpochIds;
    } catch (error) {
        // console.log(error);
        return null;
    }
}

export async function getClaimableRewardEpochIds(address, flareSystemsManager, rewardManagers) {
    let claimableRewardEpochIds = [];

    let epochs;

    for (let i = 0; i < rewardManagers.length; i++) {
        epochs = await getRewardEpochIdsWithClaimableRewards(flareSystemsManager, rewardManagers[i], address);

        if (epochs?.length) {
            for (let j = 0; j < epochs.length; j++) {
                if (claimableRewardEpochIds.indexOf(epochs[j]) === -1) {
                    claimableRewardEpochIds.push(epochs[j]);
                }
            }
        }
    }

    if (!claimableRewardEpochIds?.length) {
        return;
    } else {
        return claimableRewardEpochIds;
    }
}

export async function getRewardClaimWithProofStructs(network, address, amountWei, flareSystemsManager, rewardManagers, rewardManagerConfig) {

    let claimableRewardEpochIds = await getClaimableRewardEpochIds(address, flareSystemsManager, rewardManagers);

    if (!claimableRewardEpochIds?.length) {
        return;
    }

    if (rewardManagerConfig) {
        if (rewardManagerConfig[0] === 0) {
            rewardManagerConfig[0] = Number(claimableRewardEpochIds.at(-1));
        }

        if (claimableRewardEpochIds.at(-1) > rewardManagerConfig[0]) {
            return null;
        }
    }

    let hasFtsoRewards = false;

    let rewardClaimWithProofStructs = [];

    for (const epochId of claimableRewardEpochIds) {
        const rewardClaimData = await getRewardClaimData(epochId, network, address);

        if (!rewardClaimData) {
            continue;
        }

        if (amountWei !== undefined && typeof amountWei === "bigint" && rewardClaimData) {
            hasFtsoRewards = true;

            amountWei += rewardClaimData.body.amount;
        }

        rewardClaimWithProofStructs.push(rewardClaimData);
    }

    if (amountWei !== undefined) {
        return {
            amountWei,
            hasFtsoRewards
        };
    } else {
        return rewardClaimWithProofStructs;
    }
}

export async function getV1Rewards(epochsUnclaimed, network, account, ftsoRewardContract, l) {
    let tokens = BigInt(0);

    try {
        if (rewardsOverrideConfig[network].V1Check === true) {
            for (var k = 0; k < epochsUnclaimed.length; k++) {
                l = await ftsoRewardContract.methods.getStateOfRewards(account, epochsUnclaimed[k]).call();
                
                if (typeof l[1][0] === "bigint") {
                    tokens += l[1][0];
                } else {
                    tokens += BigInt(l[1][0]);
                }
            }
        }

        return tokens;
    } catch (error) {
        // console.log(error)
    }
}

export async function getV2Rewards(unclaimedAmountv2, network, account, DappObject, flareSystemsManagerContract, rewardManagerContractArray) {
    let tokens = BigInt(0);
    
    try {
        for (let j = 0; j < rewardManagerContractArray.length; j++) {
            unclaimedAmountv2 = await rewardManagerContractArray[j].methods.getStateOfRewards(account).call();
    
            // console.log("unclaimedAmountv2: ");
            // console.log(unclaimedAmountv2);
            // console.log("unclaimedAmount: ");
            // console.log(unclaimedAmount);
            // console.log(unclaimedAmountv2[0].length);
    
            if (unclaimedAmountv2.length > 0) {
                for (var i = 0; i < unclaimedAmountv2.length; i++) {
                    for (var k = 0; k < unclaimedAmountv2[i].length; k++) {
                        if (unclaimedAmountv2[i][k] !== undefined) {
                            if (unclaimedAmountv2[i][k].amount > 0n) {
                                DappObject.rewardManagerData[j + 1] = [unclaimedAmountv2[i][k].rewardEpochId, rewardManagerContractArray[j]._address, rewardManagerContractArray[j]];
    
                                DappObject.hasV2Rewards = true;
                            }
    
                            tokens += BigInt(unclaimedAmountv2[i][k].amount);
                        }
                    }
                }
            } else {
                DappObject.hasV2Rewards = false;
            }
        }
    
        const ftsoRewardInfo = await getRewardClaimWithProofStructs(network, account, tokens, flareSystemsManagerContract, rewardManagerContractArray);
    
        if (ftsoRewardInfo !== undefined && ftsoRewardInfo?.hasFtsoRewards === true) {
            // console.log("FTSO Rewards:");
            // console.log(web32.utils.fromWei(ftsoRewardInfo.amountWei, "ether"));
    
            tokens += ftsoRewardInfo.amountWei;
    
            DappObject.hasFtsoRewards = true;
        } else {
            DappObject.hasFtsoRewards = false;
        }

        return tokens;
    } catch (error) {
        // console.log(error)
    }
}

export async function getFlareDropRewards(account, DistributionDelegatorsContract) {
    let tokens = BigInt(0);

    try {
        let month;
        const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

        for (const property in claimableMonths) {
            month = !property.includes("_") && typeof claimableMonths[property] !== 'undefined' ? claimableMonths[property] : null;

            if (month && typeof month !== 'undefined' && isNumber(Number(month))) {
                let claimableAmountMonth = await DistributionDelegatorsContract.methods.getClaimableAmountOf(account, month).call();
                
                if (typeof claimableAmountMonth === "bigint") {
                    tokens += claimableAmountMonth;
                } else {
                    tokens += BigInt(claimableAmountMonth);
                }
            }
        }

        return tokens;
    } catch (error) {
        // console.log(error)
    }
}

export async function getRewardClaimData(rewardEpochId, network, account) {

    let merkleProof;
    let id;
    let address;
    let sum;
    let claimType;

    return fetch(`${fetchTupleConfig.url}/${network}/${rewardEpochId}/${fetchTupleConfig.jsonfile}`, { signal: AbortSignal.timeout(Number(fetchTupleConfig.timeout)) })
        .then(async (res) => {
            if (res.ok) {
                let body = await res.text();

                return body
            }

            throw new Error('Something went wrong');
        })
        .then(async rewardsData => {
            if (!rewardsData) {
                return null;
            }

            let rewardsDataJson = JSON.parse(rewardsData);

            // console.log("REWARD JSON");
            // console.log(rewardsDataJson);

            const rewardClaims = rewardsDataJson.rewardClaims.find(([_, [id, address, sum, claimType]]) => address.toLowerCase() === account.toLowerCase() && (claimType === "1" || claimType === "0"));
            
            if (!rewardClaims) {
                return null;
            }

            [merkleProof, [id, address, sum, claimType]] = rewardClaims;

            return {
                merkleProof, 
                body: {
                    rewardEpochId: BigInt(id),
                    beneficiary: address,
                    amount: BigInt(sum),
                    claimType: BigInt(claimType)
                }
            };
        }).catch((error) => {
            // console.log(error);
            return null;
        });
}

export async function claimRewards(object, DappObject, passedClaimAmount) {
    let web32 = new Web3(object.rpcUrl);
    var checkBox = document.getElementById("RewardsCheck");

    let rewardManagerAddr = await GetContract("RewardManager", object.rpcUrl, object.flrAddr);

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

    let network = GetNetworkName(object.rpcUrl);

    let rewardManagerConfig = DappObject.rewardManagerData;

    if (DappObject.hasFtsoRewards === true) {
        rewardManagerConfig = fetchTupleConfig.rewardManagerFtsoV2[network];
    }

    for (let j = 0; j < rewardManagerConfig.length; j++) {
        // console.log("DappObject.rewardManagerData:");
        // console.log(rewardManagerConfig);

        if (rewardManagerConfig[j] || DappObject.hasV1Rewards === true || DappObject.hasFtsoRewards === true) {
            try {
                DappObject.isHandlingOperation = true;

                let claimAmount;
                
                if (passedClaimAmount) {
                    claimAmount = passedClaimAmount;
                } else {
                    claimAmount = Number(document.getElementById('ClaimButtonText').innerText);
                }

                const account = DappObject.selectedAddress;
                const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
                let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
                const ftsoRewardAddr = await GetContract("FtsoRewardManager", object.rpcUrl, object.flrAddr);
                let ftsoRewardContract = new web32.eth.Contract(DappObject.ftsoRewardAbiLocal, ftsoRewardAddr);
                
                const systemsManagerAddr = await GetContract("FlareSystemsManager", object.rpcUrl, object.flrAddr);
                let flareSystemsManagerContract = new web32.eth.Contract(DappObject.systemsManagerAbiLocal, systemsManagerAddr);

                if (!rewardManagerConfig[j][2]) {
                    rewardManagerConfig[j][2] = new web32.eth.Contract(DappObject.rewardManagerAbiLocal, rewardManagerConfig[j][1]);
                }

                let rewardClaimWithProofStructs = [];

                let v2RewardEpochId;

                if (rewardManagerAddr) {
                    try {
                        if (DappObject.hasFtsoRewards) {
                            rewardClaimWithProofStructs = await getRewardClaimWithProofStructs(network, account, undefined, flareSystemsManagerContract, rewardManagerContractArray, rewardManagerConfig[j]);

                            if (rewardClaimWithProofStructs == null) {
                                throw new Error('Epoch is greater than RewardManager final epoch.');
                            }
                        }

                        v2RewardEpochId = rewardManagerConfig[j][0];
                    } catch (error) {
                        throw error;
                    }
                }

                const epochsUnclaimed = await ftsoRewardContract.methods.getEpochsWithUnclaimedRewards(account).call();
                let txPayload = {};
                let txPayloadV2 = {};

                var bucketTotal = await web32.eth.getBalance(ftsoRewardAddr);

                // console.log("BucketTotal: " + web32.utils.fromWei(bucketTotal, "ether"));

                // console.log("Claim Amount: " + claimAmount);

                // console.log(claimAmount > 0 && claimAmount < web32.utils.fromWei(bucketTotal, "ether"));

                if (checkBox.checked) {
                    if (DappObject.hasV1Rewards === true) {
                        txPayload = {
                            from: account,
                            to: ftsoRewardAddr,
                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[epochsUnclaimed.length - 1]), true).encodeABI(),
                        };
                    }

                    if (DappObject.hasV2Rewards === true || DappObject.hasFtsoRewards === true) {
                        if (rewardManagerContractArray?.length) {
                            txPayloadV2 = {
                                from: account,
                                to: rewardManagerConfig[j][1],
                                data: rewardManagerConfig[j][2].methods.claim(account, account, String(v2RewardEpochId), true, rewardClaimWithProofStructs).encodeABI(),
                            };
                        }
                    }
                } else {
                    if (DappObject.hasV1Rewards === true) {
                        txPayload = {
                            from: account,
                            to: ftsoRewardAddr,
                            data: ftsoRewardContract.methods.claim(account, account, String(epochsUnclaimed[epochsUnclaimed.length - 1]), false).encodeABI(),
                        };
                    }

                    if (DappObject.hasV2Rewards === true || DappObject.hasFtsoRewards === true) {
                        if (rewardManagerContractArray?.length) {
                            txPayloadV2 = {
                                from: account,
                                to: rewardManagerConfig[j][1],
                                data: rewardManagerConfig[j][2].methods.claim(account, account, String(v2RewardEpochId), false, rewardClaimWithProofStructs).encodeABI(),
                            };
                        }
                    }
                }
                
                const transactionParameters = txPayload;

                let txHashes = [];

                if (DappObject.hasV1Rewards === true && claimAmount > web32.utils.fromWei(bucketTotal, "ether")) {
                    DappObject.hasV1Rewards = false;

                    showEmptyBucket(object, DappObject, claimAmount);

                    return;
                }

                if (DappObject.hasV1Rewards === true && DappObject.hasV2Rewards === false) {

                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMSingleSign(transactionParameters, DappObject, undefined, false, object, 2);
                    } else {
                        showSpinner(async () => {
                            await DappObject.chosenEVMProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                            .catch((error) => showFail(object, DappObject, 2));
                        });
                    }

                } else if ((DappObject.hasV1Rewards === false && DappObject.hasV2Rewards === true) || (DappObject.hasV1Rewards === false && DappObject.hasFtsoRewards === true)) {
                    const transactionParametersV2 = txPayloadV2;

                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMSingleSign(transactionParametersV2, DappObject, undefined, false, object, 2);
                    } else {
                        await showSpinner(async () => {
                            await DappObject.chosenEVMProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParametersV2],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                            .catch((error) => showFail(object, DappObject, 2));
                        });
                    }
                    
                } else if ((DappObject.hasV1Rewards === true && DappObject.hasV2Rewards === true) || (DappObject.hasV1Rewards === true && DappObject.hasFtsoRewards === true)) {
                    const transactionParametersV2 = txPayloadV2;

                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMFtsoV2Sign(transactionParameters, transactionParametersV2, DappObject, object, 2, txHashes);
                    } else {
                        await showConfirmationSpinnerv2(async (v2Spinner) => {
                            try {
                                await DappObject.chosenEVMProvider.request({
                                    method: 'eth_sendTransaction',
                                    params: [transactionParameters],
                                })
                                .then(txHash => {
                                    v2Spinner.$content.find('#v1TxStatus').html(dappStrings['dapp_popup_networkconfirm1']);

                                    txHashes[0] = txHash;

                                    checkTx(txHash, web32, undefined, object, DappObject, 2, true).then(result => {
                                        return new Promise((resolve, reject) => {
                                            switch (result) {
                                                case "Success":
                                                    v2Spinner.$content.find('#v1TxStatus').html(dappStrings['dapp_popup_success']);
                                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-solid fa-check");
                                                    v2Spinner.$content.find('#v2TxStatus').html('Please check your Wallet...');
                                                    setTimeout(() => {
                                                        resolve("Success");
                                                    }, 1500);
                                                    break
                                                case "Fail":
                                                    v2Spinner.$content.find('#v1TxStatus').html(dappStrings['dapp_popup_failed']);
                                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-warning");
                                                    
                                                    resolve("Failed");
                                                    v2Spinner.close();
                                                    showFail(object, DappObject, 2);
                                                    break
                                                case "Unknown":
                                                    v2Spinner.$content.find('#v1TxStatus').html('Unknown');
                                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-warning");
                                                    v2Spinner.$content.find('#v2TxStatus').html('Please check your Wallet...');
                                                    setTimeout(() => {
                                                        resolve("Unknown");
                                                    }, 1500);
                                                    break
                                            }
                                        });
                                    }).then(async value => {
                                        if (value === "Success" || value === "Unknown") {
                                            await DappObject.chosenEVMProvider.request({
                                                method: 'eth_sendTransaction',
                                                params: [transactionParametersV2],
                                            }).then(txHashV2 => {
                                                v2Spinner.$content.find('#v2TxStatus').html(dappStrings['dapp_popup_networkconfirm1']);

                                                txHashes[1] = txHashV2;

                                                checkTx(txHashV2, web32, undefined, object, DappObject, 2, true).then(receipt => {
                                                    switch (receipt) {
                                                        case "Success":
                                                            v2Spinner.$content.find('#v2TxStatus').html(dappStrings['dapp_popup_success']);
                                                            v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                            v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-solid fa-check");
                                                            v2Spinner.close();
                                                            showConfirm(txHashes[0] + "<br/>" + txHashes[1], object, DappObject, 2);
                                                            break
                                                        case "Fail":
                                                            v2Spinner.$content.find('#v2TxStatus').html(dappStrings['dapp_popup_failed']);
                                                            v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                            v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-warning");
                                                            v2Spinner.close();
                                                            showFail(object, DappObject, 2);
                                                            break
                                                        case "Unknown":
                                                            v2Spinner.$content.find('#v2TxStatus').html('Unknown');
                                                            v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                            v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-warning");
                                                            v2Spinner.close();
                                                            showFail(object, DappObject, 2);
                                                            break
                                                    }
                                                });
                                            }).catch((error) => {
                                                v2Spinner.close();
                                                
                                                showFail(object, DappObject, 2)
                                            });
                                        }
                                    })
                                }).catch((error) => {
                                    v2Spinner.close();
                                    
                                    showFail(object, DappObject, 2)
                                });
                            } catch (error) {
                                v2Spinner.close();

                                showFail(object, DappObject, 2);
                            }
                        });
                    }
                }

                DappObject.hasV1Rewards = false;

                const tokenBalance = await tokenContract.methods.balanceOf(account).call();
                
                showClaimRewards(0);
                switchClaimButtonColorBack(DappObject.claimBool);
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));

                DappObject.isHandlingOperation = false;
            } catch (error) {
                DappObject.isHandlingOperation = false;

                // console.log(error);
            }
        }
    }
}

export async function claimFdRewards(object, DappObject) {
    DappObject.isHandlingOperation = true;

    let web32 = new Web3(object.rpcUrl);
    var checkBox = document.getElementById("RewardsCheck");

    try {
        const account = DappObject.selectedAddress;
        const wrappedTokenAddr = await GetContract("WNat", object.rpcUrl, object.flrAddr);
        let tokenContract = new web32.eth.Contract(DappObject.ercAbi, wrappedTokenAddr);
        const DistributionDelegatorsAddr = await GetContract("DistributionToDelegators", object.rpcUrl, object.flrAddr);
        let DistributionDelegatorsContract = new web32.eth.Contract(DappObject.distributionAbiLocal, DistributionDelegatorsAddr);
        let month;
        let currentMonth = 0;
        const claimableMonths = await DistributionDelegatorsContract.methods.getClaimableMonths().call();

        for (const property in claimableMonths) {
            month = !property.includes("_") && typeof claimableMonths[property] !== 'undefined' ? claimableMonths[property] : null;

            if (month && typeof month !== 'undefined' && isNumber(Number(month))) {
                if (month > currentMonth) {
                    currentMonth = month;
                }
            }
        }
        
        let txPayload = {};
        
        if (Number(document.getElementById('ClaimFdButtonText').innerText) > 0) {
            if (checkBox.checked) {
                txPayload = {
                    from: account,
                    to: DistributionDelegatorsAddr,
                    data: DistributionDelegatorsContract.methods.claim(account, account, currentMonth, true).encodeABI(),
                };
            } else {
                txPayload = {
                    from: account,
                    to: DistributionDelegatorsAddr,
                    data: DistributionDelegatorsContract.methods.claim(account, account, currentMonth, false).encodeABI(),
                };
            }
            
            const transactionParameters = txPayload;

            if (DappObject.walletIndex === 1) {
                await LedgerEVMSingleSign(transactionParameters, DappObject, undefined, false, object, 2);
            } else {
                showSpinner(async () => {
                    await DappObject.chosenEVMProvider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                    .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                    .catch((error) => showFail(object, DappObject, 2));
                });
            }
            
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();

            DappObject.isHandlingOperation = false;
            
            showFdRewards(0);
            switchClaimFdButtonColorBack(DappObject.fdClaimBool);
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
        }
    } catch (error) {
        DappObject.isHandlingOperation = false;

        // console.log(error);
    }
}

// Switch claim button to claimable.
export function switchClaimButtonColor() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    document.getElementById('ClaimButton').style.cursor = "pointer";
}

export function switchClaimButtonColorBack() {
    document.getElementById('ClaimButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    document.getElementById('ClaimButton').style.cursor = "auto";
}

export function switchClaimFdButtonColor() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(253, 0, 15, 0.8)";
    document.getElementById('ClaimFdButton').style.cursor = "pointer";
}

export function switchClaimFdButtonColorBack() {
    document.getElementById('ClaimFdButton').style.backgroundColor = "rgba(143, 143, 143, 0.8)";
    document.getElementById('ClaimFdButton').style.cursor = "auto";
}

// Show current rewards.
export function showClaimRewards(rewards) {
    document.getElementById('ClaimButtonText').innerText = rewards == 0 ? '0' : rewards;
}

// Show current rewards.
export function showFdRewards(rewards) {
    document.getElementById('ClaimFdButtonText').innerText = rewards == 0 ? '0' : rewards;
}