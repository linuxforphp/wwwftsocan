const systemsManagerAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"address","name":"_governanceSettings","internalType":"contract IGovernanceSettings"},{"type":"address","name":"_initialGovernance","internalType":"address"},{"type":"address","name":"_addressUpdater","internalType":"address"},{"type":"address","name":"_flareDaemon","internalType":"address"},{"type":"tuple","name":"_settings","internalType":"struct FlareSystemsManager.Settings","components":[{"type":"uint16","name":"randomAcquisitionMaxDurationSeconds","internalType":"uint16"},{"type":"uint16","name":"randomAcquisitionMaxDurationBlocks","internalType":"uint16"},{"type":"uint16","name":"newSigningPolicyInitializationStartSeconds","internalType":"uint16"},{"type":"uint8","name":"newSigningPolicyMinNumberOfVotingRoundsDelay","internalType":"uint8"},{"type":"uint16","name":"voterRegistrationMinDurationSeconds","internalType":"uint16"},{"type":"uint16","name":"voterRegistrationMinDurationBlocks","internalType":"uint16"},{"type":"uint16","name":"submitUptimeVoteMinDurationSeconds","internalType":"uint16"},{"type":"uint16","name":"submitUptimeVoteMinDurationBlocks","internalType":"uint16"},{"type":"uint24","name":"signingPolicyThresholdPPM","internalType":"uint24"},{"type":"uint16","name":"signingPolicyMinNumberOfVoters","internalType":"uint16"},{"type":"uint32","name":"rewardExpiryOffsetSeconds","internalType":"uint32"}]},{"type":"uint32","name":"_firstVotingRoundStartTs","internalType":"uint32"},{"type":"uint8","name":"_votingEpochDurationSeconds","internalType":"uint8"},{"type":"uint32","name":"_firstRewardEpochStartVotingRoundId","internalType":"uint32"},{"type":"uint16","name":"_rewardEpochDurationInVotingEpochs","internalType":"uint16"},{"type":"tuple","name":"_initialSettings","internalType":"struct FlareSystemsManager.InitialSettings","components":[{"type":"uint16","name":"initialRandomVotePowerBlockSelectionSize","internalType":"uint16"},{"type":"uint24","name":"initialRewardEpochId","internalType":"uint24"},{"type":"uint16","name":"initialRewardEpochThreshold","internalType":"uint16"}]}]},{"type":"error","name":"ECDSAInvalidSignature","inputs":[]},{"type":"error","name":"ECDSAInvalidSignatureLength","inputs":[{"type":"uint256","name":"length","internalType":"uint256"}]},{"type":"error","name":"ECDSAInvalidSignatureS","inputs":[{"type":"bytes32","name":"s","internalType":"bytes32"}]},{"type":"error","name":"SafeCastOverflowedUintDowncast","inputs":[{"type":"uint8","name":"bits","internalType":"uint8"},{"type":"uint256","name":"value","internalType":"uint256"}]},{"type":"event","name":"ClosingExpiredRewardEpochFailed","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":false}],"anonymous":false},{"type":"event","name":"GovernanceCallTimelocked","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4","indexed":false},{"type":"uint256","name":"allowedAfterTimestamp","internalType":"uint256","indexed":false},{"type":"bytes","name":"encodedCall","internalType":"bytes","indexed":false}],"anonymous":false},{"type":"event","name":"GovernanceInitialised","inputs":[{"type":"address","name":"initialGovernance","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"GovernedProductionModeEntered","inputs":[{"type":"address","name":"governanceSettings","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"RandomAcquisitionStarted","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false}],"anonymous":false},{"type":"event","name":"RewardEpochStarted","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"uint32","name":"startVotingRoundId","internalType":"uint32","indexed":false},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false}],"anonymous":false},{"type":"event","name":"RewardsSigned","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"address","name":"signingPolicyAddress","internalType":"address","indexed":true},{"type":"address","name":"voter","internalType":"address","indexed":true},{"type":"bytes32","name":"rewardsHash","internalType":"bytes32","indexed":false},{"type":"tuple[]","name":"noOfWeightBasedClaims","internalType":"struct IFlareSystemsManager.NumberOfWeightBasedClaims[]","indexed":false,"components":[{"type":"uint256","name":"rewardManagerId","internalType":"uint256"},{"type":"uint256","name":"noOfWeightBasedClaims","internalType":"uint256"}]},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false},{"type":"bool","name":"thresholdReached","internalType":"bool","indexed":false}],"anonymous":false},{"type":"event","name":"SettingCleanUpBlockNumberFailed","inputs":[{"type":"uint64","name":"blockNumber","internalType":"uint64","indexed":false}],"anonymous":false},{"type":"event","name":"SignUptimeVoteEnabled","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false}],"anonymous":false},{"type":"event","name":"SigningPolicySigned","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"address","name":"signingPolicyAddress","internalType":"address","indexed":true},{"type":"address","name":"voter","internalType":"address","indexed":true},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false},{"type":"bool","name":"thresholdReached","internalType":"bool","indexed":false}],"anonymous":false},{"type":"event","name":"TimelockedGovernanceCallCanceled","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4","indexed":false},{"type":"uint256","name":"timestamp","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"TimelockedGovernanceCallExecuted","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4","indexed":false},{"type":"uint256","name":"timestamp","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"TriggeringVoterRegistrationFailed","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":false}],"anonymous":false},{"type":"event","name":"UptimeVoteSigned","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"address","name":"signingPolicyAddress","internalType":"address","indexed":true},{"type":"address","name":"voter","internalType":"address","indexed":true},{"type":"bytes32","name":"uptimeVoteHash","internalType":"bytes32","indexed":false},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false},{"type":"bool","name":"thresholdReached","internalType":"bool","indexed":false}],"anonymous":false},{"type":"event","name":"UptimeVoteSubmitted","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"address","name":"signingPolicyAddress","internalType":"address","indexed":true},{"type":"address","name":"voter","internalType":"address","indexed":true},{"type":"bytes20[]","name":"nodeIds","internalType":"bytes20[]","indexed":false},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false}],"anonymous":false},{"type":"event","name":"VotePowerBlockSelected","inputs":[{"type":"uint24","name":"rewardEpochId","internalType":"uint24","indexed":true},{"type":"uint64","name":"votePowerBlock","internalType":"uint64","indexed":false},{"type":"uint64","name":"timestamp","internalType":"uint64","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"cancelGovernanceCall","inputs":[{"type":"bytes4","name":"_selector","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IICleanupBlockNumberManager"}],"name":"cleanupBlockNumberManager","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"currentRewardEpochExpectedEndTs","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"daemonize","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"executeGovernanceCall","inputs":[{"type":"bytes4","name":"_selector","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"firstRewardEpochStartTs","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"firstVotingRoundStartTs","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"flareDaemon","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"_addressUpdater","internalType":"address"}],"name":"getAddressUpdater","inputs":[]},{"type":"function","stateMutability":"pure","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"getContractName","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getCurrentRewardEpoch","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint24","name":"","internalType":"uint24"}],"name":"getCurrentRewardEpochId","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint32","name":"","internalType":"uint32"}],"name":"getCurrentVotingEpochId","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_randomAcquisitionStartTs","internalType":"uint64"},{"type":"uint64","name":"_randomAcquisitionStartBlock","internalType":"uint64"},{"type":"uint64","name":"_randomAcquisitionEndTs","internalType":"uint64"},{"type":"uint64","name":"_randomAcquisitionEndBlock","internalType":"uint64"}],"name":"getRandomAcquisitionInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_rewardEpochStartTs","internalType":"uint64"},{"type":"uint64","name":"_rewardEpochStartBlock","internalType":"uint64"}],"name":"getRewardEpochStartInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address[]","name":"","internalType":"contract IIRewardEpochSwitchoverTrigger[]"}],"name":"getRewardEpochSwitchoverTriggerContracts","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_rewardsSignStartTs","internalType":"uint64"},{"type":"uint64","name":"_rewardsSignStartBlock","internalType":"uint64"},{"type":"uint64","name":"_rewardsSignEndTs","internalType":"uint64"},{"type":"uint64","name":"_rewardsSignEndBlock","internalType":"uint64"}],"name":"getRewardsSignInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getSeed","inputs":[{"type":"uint256","name":"_rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_signingPolicySignStartTs","internalType":"uint64"},{"type":"uint64","name":"_signingPolicySignStartBlock","internalType":"uint64"},{"type":"uint64","name":"_signingPolicySignEndTs","internalType":"uint64"},{"type":"uint64","name":"_signingPolicySignEndBlock","internalType":"uint64"}],"name":"getSigningPolicySignInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint32","name":"","internalType":"uint32"}],"name":"getStartVotingRoundId","inputs":[{"type":"uint256","name":"_rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"","internalType":"uint16"}],"name":"getThreshold","inputs":[{"type":"uint256","name":"_rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_uptimeVoteSignStartTs","internalType":"uint64"},{"type":"uint64","name":"_uptimeVoteSignStartBlock","internalType":"uint64"}],"name":"getUptimeVoteSignStartInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_votePowerBlock","internalType":"uint64"}],"name":"getVotePowerBlock","inputs":[{"type":"uint256","name":"_rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"_votePowerBlock","internalType":"uint256"},{"type":"bool","name":"_enabled","internalType":"bool"}],"name":"getVoterRegistrationData","inputs":[{"type":"uint256","name":"_rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_rewardsSignTs","internalType":"uint64"},{"type":"uint64","name":"_rewardsSignBlock","internalType":"uint64"}],"name":"getVoterRewardsSignInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"address","name":"_voter","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_signingPolicySignTs","internalType":"uint64"},{"type":"uint64","name":"_signingPolicySignBlock","internalType":"uint64"}],"name":"getVoterSigningPolicySignInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"address","name":"_voter","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_uptimeVoteSignTs","internalType":"uint64"},{"type":"uint64","name":"_uptimeVoteSignBlock","internalType":"uint64"}],"name":"getVoterUptimeVoteSignInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"address","name":"_voter","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"_uptimeVoteSubmitTs","internalType":"uint64"},{"type":"uint64","name":"_uptimeVoteSubmitBlock","internalType":"uint64"}],"name":"getVoterUptimeVoteSubmitInfo","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"address","name":"_voter","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"governance","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IGovernanceSettings"}],"name":"governanceSettings","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"initialRandomVotePowerBlockSelectionSize","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"initialise","inputs":[{"type":"address","name":"_governanceSettings","internalType":"contract IGovernanceSettings"},{"type":"address","name":"_initialGovernance","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isExecutor","inputs":[{"type":"address","name":"_address","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isVoterRegistrationEnabled","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint32","name":"","internalType":"uint32"}],"name":"lastInitializedVotingRoundId","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"newSigningPolicyInitializationStartSeconds","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint32","name":"","internalType":"uint32"}],"name":"newSigningPolicyMinNumberOfVotingRoundsDelay","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"noOfWeightBasedClaims","inputs":[{"type":"uint256","name":"rewardEpochId","internalType":"uint256"},{"type":"uint256","name":"rewardManagerId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"noOfWeightBasedClaimsHash","inputs":[{"type":"uint256","name":"rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"productionMode","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"randomAcquisitionMaxDurationBlocks","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"randomAcquisitionMaxDurationSeconds","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IIRelay"}],"name":"relay","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"rewardEpochDurationSeconds","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint24","name":"","internalType":"uint24"}],"name":"rewardEpochIdToExpireNext","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint32","name":"","internalType":"uint32"}],"name":"rewardExpiryOffsetSeconds","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IIRewardManager"}],"name":"rewardManager","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"rewardsHash","inputs":[{"type":"uint256","name":"rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRewardEpochSwitchoverTriggerContracts","inputs":[{"type":"address[]","name":"_contracts","internalType":"contract IIRewardEpochSwitchoverTrigger[]"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setRewardsData","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"tuple[]","name":"_noOfWeightBasedClaims","internalType":"struct IFlareSystemsManager.NumberOfWeightBasedClaims[]","components":[{"type":"uint256","name":"rewardManagerId","internalType":"uint256"},{"type":"uint256","name":"noOfWeightBasedClaims","internalType":"uint256"}]},{"type":"bytes32","name":"_rewardsHash","internalType":"bytes32"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setSubmit3Aligned","inputs":[{"type":"bool","name":"_submit3Aligned","internalType":"bool"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setTriggerExpirationAndCleanup","inputs":[{"type":"bool","name":"_triggerExpirationAndCleanup","internalType":"bool"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setVoterRegistrationTriggerContract","inputs":[{"type":"address","name":"_contract","internalType":"contract IIVoterRegistrationTrigger"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"signNewSigningPolicy","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"bytes32","name":"_newSigningPolicyHash","internalType":"bytes32"},{"type":"tuple","name":"_signature","internalType":"struct IFlareSystemsManager.Signature","components":[{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"signRewards","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"tuple[]","name":"_noOfWeightBasedClaims","internalType":"struct IFlareSystemsManager.NumberOfWeightBasedClaims[]","components":[{"type":"uint256","name":"rewardManagerId","internalType":"uint256"},{"type":"uint256","name":"noOfWeightBasedClaims","internalType":"uint256"}]},{"type":"bytes32","name":"_rewardsHash","internalType":"bytes32"},{"type":"tuple","name":"_signature","internalType":"struct IFlareSystemsManager.Signature","components":[{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"signUptimeVote","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"bytes32","name":"_uptimeVoteHash","internalType":"bytes32"},{"type":"tuple","name":"_signature","internalType":"struct IFlareSystemsManager.Signature","components":[{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"","internalType":"uint16"}],"name":"signingPolicyMinNumberOfVoters","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint24","name":"","internalType":"uint24"}],"name":"signingPolicyThresholdPPM","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IISubmission"}],"name":"submission","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"submit3Aligned","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"submitUptimeVote","inputs":[{"type":"uint24","name":"_rewardEpochId","internalType":"uint24"},{"type":"bytes20[]","name":"_nodeIds","internalType":"bytes20[]"},{"type":"tuple","name":"_signature","internalType":"struct IFlareSystemsManager.Signature","components":[{"type":"uint8","name":"v","internalType":"uint8"},{"type":"bytes32","name":"r","internalType":"bytes32"},{"type":"bytes32","name":"s","internalType":"bytes32"}]}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"submitUptimeVoteMinDurationBlocks","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"submitUptimeVoteMinDurationSeconds","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"switchToFallbackMode","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"switchToProductionMode","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"allowedAfterTimestamp","internalType":"uint256"},{"type":"bytes","name":"encodedCall","internalType":"bytes"}],"name":"timelockedCalls","inputs":[{"type":"bytes4","name":"selector","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"triggerExpirationAndCleanup","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updateContractAddresses","inputs":[{"type":"bytes32[]","name":"_contractNameHashes","internalType":"bytes32[]"},{"type":"address[]","name":"_contractAddresses","internalType":"address[]"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updateSettings","inputs":[{"type":"tuple","name":"_settings","internalType":"struct FlareSystemsManager.Settings","components":[{"type":"uint16","name":"randomAcquisitionMaxDurationSeconds","internalType":"uint16"},{"type":"uint16","name":"randomAcquisitionMaxDurationBlocks","internalType":"uint16"},{"type":"uint16","name":"newSigningPolicyInitializationStartSeconds","internalType":"uint16"},{"type":"uint8","name":"newSigningPolicyMinNumberOfVotingRoundsDelay","internalType":"uint8"},{"type":"uint16","name":"voterRegistrationMinDurationSeconds","internalType":"uint16"},{"type":"uint16","name":"voterRegistrationMinDurationBlocks","internalType":"uint16"},{"type":"uint16","name":"submitUptimeVoteMinDurationSeconds","internalType":"uint16"},{"type":"uint16","name":"submitUptimeVoteMinDurationBlocks","internalType":"uint16"},{"type":"uint24","name":"signingPolicyThresholdPPM","internalType":"uint24"},{"type":"uint16","name":"signingPolicyMinNumberOfVoters","internalType":"uint16"},{"type":"uint32","name":"rewardExpiryOffsetSeconds","internalType":"uint32"}]}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bytes32","name":"","internalType":"bytes32"}],"name":"uptimeVoteHash","inputs":[{"type":"uint256","name":"rewardEpochId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"voterRegistrationMinDurationBlocks","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"voterRegistrationMinDurationSeconds","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IIVoterRegistrationTrigger"}],"name":"voterRegistrationTriggerContract","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"contract IIVoterRegistry"}],"name":"voterRegistry","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint64","name":"","internalType":"uint64"}],"name":"votingEpochDurationSeconds","inputs":[]}]