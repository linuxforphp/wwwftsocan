var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const DECIMALS = 5;
export function getProvider(rpcLink) {
    return new ethers.providers.JsonRpcProvider(rpcLink);
}
export function getWeb3(rpcLink, logger) {
    let web3 = new Web3();
    if (rpcLink.startsWith("http")) {
        web3.setProvider(new Web3.providers.HttpProvider(rpcLink));
    }
    else if (rpcLink.startsWith("ws")) {
        let provider = new Web3.providers.WebsocketProvider(rpcLink, {
            // @ts-ignore
            clientConfig: {
                keepalive: true,
                keepaliveInterval: 60000 // milliseconds
            },
            reconnect: {
                auto: true,
                delay: 2500,
                onTimeout: true,
            }
        });
        provider.on("close", (err) => {
            if (logger) {
                logger.error(`WebSocket connection closed. Error code ${err.code}, reason "${err.reason}"`);
            }
        });
        web3.setProvider(provider);
    }
    web3.eth.handleRevert = true;
    // web3.eth.defaultCommon = { customChain: { name: 'coston', chainId: 20210413, networkId: 20210413 }, baseChain: 'ropsten', hardfork: 'petersburg' };
    //    }
    return web3;
}
;
export function getAbi(abiPath) {
    let abi = JSON.parse(fs.readFileSync(abiPath).toString());
    if (abi.abi) {
        abi = abi.abi;
    }
    return abi;
}
export function getWeb3Contract(web3, address, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let abiPath = yield relativeContractABIPathForContractName(name);
        return new web3.eth.Contract(getAbi(`artifacts/${abiPath}`), address);
    });
}
;
export function getContract(provider, address, name) {
    return __awaiter(this, void 0, void 0, function* () {
        let abiPath = yield relativeContractABIPathForContractName(name);
        return new ethers.Contract(address, getAbi(`artifacts/${abiPath}`), provider);
    });
}
;
export function getWeb3Wallet(web3, privateKey) {
    if (privateKey.indexOf('0x') != 0) {
        privateKey = '0x' + privateKey;
    }
    return web3.eth.accounts.privateKeyToAccount(privateKey);
}
export function getWallet(privateKey, provider) {
    return new ethers.Wallet(privateKey, provider);
}
export function waitFinalize3Factory(web3) {
    return function (address, func, delay = 1000) {
        return __awaiter(this, void 0, void 0, function* () {
            let nonce = yield web3.eth.getTransactionCount(address);
            let res = yield func();
            let backoff = 1.5;
            let cnt = 0;
            while ((yield web3.eth.getTransactionCount(address)) == nonce) {
                yield new Promise((resolve) => { setTimeout(() => { resolve(); }, delay); });
                if (cnt < 8) {
                    delay = Math.floor(delay * backoff);
                    cnt++;
                }
                else {
                    throw new Error("Response timeout");
                }
                console.log(`Delay backoff ${delay} (${cnt})`);
            }
            return res;
        });
    };
}
export function bigNumberToMillis(num) {
    return BigNumber.from(num * 1000);
}
export function priceHash(price, random, address) {
    return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["uint256", "uint256", "address"], [price.toString(), random.toString(), address]));
}
export function relativeContractABIPathForContractName(name, artifactsRoot = "artifacts") {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            Glob(`contracts/**${name}.json`, { cwd: artifactsRoot }, (er, files) => {
                if (er) {
                    reject(er);
                }
                else {
                    if (files && files.length === 1) {
                        resolve(files[0]);
                    }
                    else {
                        reject(files);
                    }
                }
            });
        });
    });
}
