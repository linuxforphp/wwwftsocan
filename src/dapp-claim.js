import { GetContract, GetNetworkName, MMSDK, showAccountAddress, showBalance, showTokenBalance, FlareAbis, FlareLogos } from "./flare-utils";
import { round, isNumber, checkTx } from "./dapp-utils.js";
import { showSpinner, showConfirmationSpinner, showConfirmationSpinnerv2, showConfirm, showEmptyBucket, showFail, setCurrentPopup } from "./dapp-ui.js";
import { injectedProvider } from "./dapp-globals.js";
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
                                                        <span>Provider:</span>
                                                        <span class="address-claim">${delegatedFtsos[i]}</span>
                                                    </div>
                                                </div>
                                            </div>`;
                            } else {
                                await setCurrentPopup('The FTSO that you have delegated to is invalid!', true);

                                document.getElementById("ClaimButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
                                document.getElementById("ClaimButton").style.cursor = "pointer";
                                DappObject.isRealValue = true;
                                document.getElementById("ClaimButtonText").innerText = "Undelegate all";
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

        const endRewardEpochId = epochIds._endEpochId;

        if (endRewardEpochId < startRewardEpochId) {
            return null;
        }
        const claimableRewardEpochIds = [];

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

export async function getRewardClaimWithProofStructs(network, address, amountWei, flareSystemsManager, rewardManagers) {

    let claimableRewardEpochIds = await getClaimableRewardEpochIds(address, flareSystemsManager, rewardManagers);

    if (!claimableRewardEpochIds?.length) {
        return;
    }

    let hasFtsoRewards = false;

    let rewardClaimWithProofStructs = [];

    for (const epochId of claimableRewardEpochIds) {
        const rewardClaimData = await getRewardClaimData(epochId, network, address);

        if (amountWei !== undefined && typeof amountWei === "bigint" && rewardClaimData) {
            hasFtsoRewards = true;

            amountWei += rewardClaimData.body.amount;
        }

        if (!rewardClaimData) {
            break;
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

export async function getRewardClaimData(rewardEpochId, network, account) {

    let merkleProof;
    let id;
    let address;
    let sum;
    let claimType;

    return fetch(`${fetchTupleConfig.url}/${network}/${rewardEpochId}/${fetchTupleConfig.jsonfile}`, { signal: AbortSignal.timeout(Number(fetchTupleConfig.timeout)) })
        .then((res) => {
            if (res.ok) {
                return res.json();
            }

            throw new Error('Something went wrong');
        })
        .then(async rewardsData => {
            if (!rewardsData) {
                return null;
            }
            const rewardClaims = rewardsData.rewardClaims.find(([_, [id, address, sum, claimType]]) => address.toLowerCase() === account.toLowerCase() && claimType === 1);
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

    for (let j = 0; j < DappObject.rewardManagerData.length; j++) {
        // console.log("DappObject.rewardManagerData:");
        // console.log(DappObject.rewardManagerData);

        if (DappObject.rewardManagerData[j] || DappObject.hasV1Rewards === true) {
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

                let rewardClaimWithProofStructs = [];

                let v2RewardEpochId;

                if (rewardManagerAddr) {
                    try {
                        v2RewardEpochId = DappObject.rewardManagerData[j][0];

                        if (DappObject.hasFtsoRewards) {
                            let network = GetNetworkName(object.rpcUrl);

                            rewardClaimWithProofStructs = await getRewardClaimWithProofStructs(network, account, undefined, flareSystemsManagerContract, rewardManagerContractArray);
                        }
                    } catch (error) {
                        // console.log(error);
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

                    if (DappObject.hasV2Rewards === true) {
                        if (rewardManagerContractArray?.length) {
                            txPayloadV2 = {
                                from: account,
                                to: DappObject.rewardManagerData[j][1],
                                data: DappObject.rewardManagerData[j][2].methods.claim(account, account, String(v2RewardEpochId), true, rewardClaimWithProofStructs).encodeABI(),
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

                    if (DappObject.hasV2Rewards === true) {
                        if (rewardManagerContractArray?.length) {
                            txPayloadV2 = {
                                from: account,
                                to: DappObject.rewardManagerData[j][1],
                                data: DappObject.rewardManagerData[j][2].methods.claim(account, account, String(v2RewardEpochId), false, rewardClaimWithProofStructs).encodeABI(),
                            };
                        }
                    }
                }

                // console.log("EPOCH ID: " + v2RewardEpochId);
                // console.log("CONTRACT: ");
                // console.log(DappObject.rewardManagerData[j][2]);
                // console.log("CONTRACT ADDR: " + DappObject.rewardManagerData[j][1]);
                
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
                    } else if (DappObject.walletIndex === 0) {
                        showSpinner(async () => {
                            await injectedProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                            .catch((error) => showFail(object, DappObject, 2));
                        });
                    } else if (DappObject.walletIndex === 2) {
                        showSpinner(async () => {
                            await DappObject.walletConnectEVMProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParameters],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                            .catch((error) => showFail(object, DappObject, 2));
                        });
                    }
                } else if (DappObject.hasV1Rewards === false && DappObject.hasV2Rewards === true && typeof rewardManagerContractArray?.length !== "undefined") {
                    const transactionParametersV2 = txPayloadV2;

                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMSingleSign(transactionParametersV2, DappObject, undefined, false, object, 2);
                    } else if (DappObject.walletIndex === 0) {
                        await showSpinner(async () => {
                            await injectedProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParametersV2],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                            .catch((error) => showFail(object, DappObject, 2));
                        });
                    } else if (DappObject.walletIndex === 2) {
                        await showSpinner(async () => {
                            await DappObject.walletConnectEVMProvider.request({
                                method: 'eth_sendTransaction',
                                params: [transactionParametersV2],
                            })
                            .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                            .catch((error) => showFail(object, DappObject, 2));
                        });
                    }
                } else if (DappObject.hasV1Rewards === true && DappObject.hasV2Rewards === true && typeof rewardManagerContractArray?.length !== "undefined") {
                    const transactionParametersV2 = txPayloadV2;

                    if (DappObject.walletIndex === 1) {
                        await LedgerEVMFtsoV2Sign(transactionParameters, transactionParametersV2, DappObject, object, 2, txHashes);
                    } else if (DappObject.walletIndex === 0) {
                        await showConfirmationSpinnerv2(async (v2Spinner) => {
                            try {
                                await injectedProvider.request({
                                    method: 'eth_sendTransaction',
                                    params: [transactionParameters],
                                })
                                .then(txHash => {
                                    v2Spinner.$content.find('#v1TxStatus').html('Waiting for network confirmation...');

                                    txHashes[0] = txHash;

                                    checkTx(txHash, web32, undefined, object, DappObject, 2, true).then(result => {
                                        return new Promise((resolve, reject) => {
                                            switch (result) {
                                                case "Success":
                                                    v2Spinner.$content.find('#v1TxStatus').html('Confirmed');
                                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-solid fa-check");
                                                    v2Spinner.$content.find('#v2TxStatus').html('Please check your Wallet...');
                                                    setTimeout(() => {
                                                        resolve("Success");
                                                    }, 1500);
                                                    break
                                                case "Fail":
                                                    v2Spinner.$content.find('#v1TxStatus').html('Failed');
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
                                            await injectedProvider.request({
                                                method: 'eth_sendTransaction',
                                                params: [transactionParametersV2],
                                            }).then(txHashV2 => {
                                                v2Spinner.$content.find('#v2TxStatus').html('Waiting for network confirmation...');

                                                txHashes[1] = txHashV2;

                                                checkTx(txHashV2, web32, undefined, object, DappObject, 2, true).then(receipt => {
                                                    switch (receipt) {
                                                        case "Success":
                                                            v2Spinner.$content.find('#v2TxStatus').html('Confirmed');
                                                            v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                            v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-solid fa-check");
                                                            v2Spinner.close();
                                                            showConfirm(txHashes[0] + "<br/>" + txHashes[1], object, DappObject, 2);
                                                            break
                                                        case "Fail":
                                                            v2Spinner.$content.find('#v2TxStatus').html('Failed');
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
                    } else if (DappObject.walletIndex === 2) {
                        await showConfirmationSpinnerv2(async (v2Spinner) => {
                            try {
                                await DappObject.walletConnectEVMProvider.request({
                                    method: 'eth_sendTransaction',
                                    params: [transactionParameters],
                                })
                                .then(txHash => {
                                    v2Spinner.$content.find('#v1TxStatus').html('Waiting for network confirmation...');

                                    txHashes[0] = txHash;

                                    checkTx(txHash, web32, undefined, object, DappObject, 2, true).then(result => {
                                        return new Promise((resolve, reject) => {
                                            switch (result) {
                                                case "Success":
                                                    v2Spinner.$content.find('#v1TxStatus').html('Confirmed');
                                                    v2Spinner.$content.find('#v1TxIcon').removeClass();
                                                    v2Spinner.$content.find('#v1TxIcon').addClass("fa fa-solid fa-check");
                                                    v2Spinner.$content.find('#v2TxStatus').html('Please check your Wallet...');
                                                    setTimeout(() => {
                                                        resolve("Success");
                                                    }, 1500);
                                                    break
                                                case "Fail":
                                                    v2Spinner.$content.find('#v1TxStatus').html('Failed');
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
                                            await DappObject.walletConnectEVMProvider.request({
                                                method: 'eth_sendTransaction',
                                                params: [transactionParametersV2],
                                            }).then(txHashV2 => {
                                                v2Spinner.$content.find('#v2TxStatus').html('Waiting for network confirmation...');

                                                txHashes[1] = txHashV2;

                                                checkTx(txHashV2, web32, undefined, object, DappObject, 2, true).then(receipt => {
                                                    switch (receipt) {
                                                        case "Success":
                                                            v2Spinner.$content.find('#v2TxStatus').html('Confirmed');
                                                            v2Spinner.$content.find('#v2TxIcon').removeClass();
                                                            v2Spinner.$content.find('#v2TxIcon').addClass("fa fa-solid fa-check");
                                                            v2Spinner.close();
                                                            showConfirm(txHashes[0] + "<br/>" + txHashes[1], object, DappObject, 2);
                                                            break
                                                        case "Fail":
                                                            v2Spinner.$content.find('#v2TxStatus').html('Failed');
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
            } else if (DappObject.walletIndex === 0) {
                showSpinner(async () => {
                    await injectedProvider.request({
                        method: 'eth_sendTransaction',
                        params: [transactionParameters],
                    })
                    .then(txHash => showConfirmationSpinner(txHash, web32, object, DappObject, 2))
                    .catch((error) => showFail(object, DappObject, 2));
                });
            } else if (DappObject.walletIndex === 2) {
                showSpinner(async () => {
                    await DappObject.walletConnectEVMProvider.request({
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