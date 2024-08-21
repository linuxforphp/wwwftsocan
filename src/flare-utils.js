// Copyright 2024 Andrew Caya <andrewscaya@yahoo.ca>
// Copyright 2024 Jean-Thomas Caya

export const FlareAbis = {
    DistributionToDelegators: distributionAbi,
    VoterWhitelister: voterWhitelisterAbi,
    FtsoRewardManager: ftsoRewardAbi,
    RewardManager: rewardManagerAbi,
    WNat: wnatAbi,
    FlareRegistry: flareAbi,
    AddressBinder: addressBinderAbi,
    ValidatorRewardManager: validatorRewardAbi,
};

export var selectedNetwork = document.getElementById("SelectedNetwork");

export const FlareLogos = {
    sgbLogo: '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>',
    flrLogo: '<g id="layer1-2" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>',
    costonLogo: '<g id="layer1-2"><path id="path5139" d="M 110.76382,510.98934 C 70.863727,504.70145 37.406693,477.5049 25.686374,441.83158 21.84306,430.13361 19.836232,415.02432 21.826707,412.77241 c 1.424546,-1.61163 13.378995,-1.76178 115.549773,-1.45126 113.89386,0.34613 113.96658,0.34786 123.75346,2.93072 36.37734,9.60039 64.41727,34.6805 75.08928,67.16306 3.80582,11.58382 5.84887,26.80869 3.89427,29.02001 -1.37588,1.55658 -14.29072,1.74294 -112.48957,1.62329 -61.01439,-0.0744 -113.60143,-0.55536 -116.8601,-1.06889 z M 58.12374,360.57705 c -25.044789,-7.74036 -40.80884,-31.76562 -36.505138,-55.6358 5.200706,-28.84542 33.769366,-47.59015 63.581441,-41.71767 20.233567,3.98566 34.715427,16.60405 40.884757,35.62379 7.82371,24.12021 -6.46935,51.40502 -31.733007,60.57687 -9.9696,3.61941 -26.540903,4.14674 -36.228053,1.15281 z M 21.826707,211.65048 c -1.990475,-2.2519 0.0164,-17.36119 3.859667,-29.05914 10.672006,-32.48258 38.711933,-57.56269 75.089266,-67.16307 9.78689,-2.58285 9.8596,-2.58458 123.75348,-2.93073 102.17076,-0.31051 114.12522,-0.16035 115.54977,1.45129 1.99047,2.25188 -0.0165,17.36119 -3.85967,29.05914 -10.67201,32.48257 -38.71194,57.56268 -75.08928,67.16306 -9.78688,2.58287 -9.8596,2.58459 -123.75346,2.93073 -102.170778,0.3105 -114.125227,0.16037 -115.549773,-1.45128 z"/></g>',
}

export const MMSDK = new MetaMaskSDK.MetaMaskSDK({
    dappMetadata: {
        name: "FTSO Canada DApp",
        url: "https://ftsocan.com",
        base64Icon: "iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAApPXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjarZxpkh63ckX/YxVeAhIzloMxwjvw8n0uqkVJfPKLsMNkSGx2fzUhM++QyKI7",
    },
    logging: {
        sdk: false,
    },
    checkInstallationImmediately: false,
    extensionOnly: true,
    preferDesktop: true
});

// Getting the key of a function by its name.
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export async function GetContract(ContractName, rpcurl, flrAddr) {
    let web3 = new Web3(rpcurl);
    let flareContract = new web3.eth.Contract(FlareAbis.FlareRegistry, flrAddr);
    const SmartContracts = await flareContract.methods.getAllContracts().call();
    const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0], ContractName);
    const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

    return wrappedTokenAddr;
}

export function round(num) {
    return +(Math.round(num + "e+4") + "e-4");
}

// Show user's account address.
export function showAccountAddress(address) {
    document.getElementById('ConnectWalletText').innerText = address;
}

//Functions to show the requested info
export function showBalance(balanceAddress) {
    document.getElementById("Balance").innerText = balanceAddress;
}

export function showTokenBalance(tokenBalanceAddress) {
    document.getElementById("TokenBalance").innerText = tokenBalanceAddress;
}

// Is value a number?
export function isNumber(value) {
    if (void 0 === value || null === value) {
        return false;
    }
    if (typeof value == "number") {
        return true;
    }
    return !isNaN(value - 0);
}

export function showRewards(Rewards) {
    document.getElementById('ClaimButtonText').innerText = Rewards;
}