var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getProvider, getWeb3, getWeb3Contract } from './Utils.js';
import { DataProviderConfiguration } from './Configuration.js';
let dataProviderConfiguration = new DataProviderConfiguration;
let isflr = dataProviderConfiguration.IsFlr;
export class DataProvider {
    constructor() {
        this.dataProviderConfiguration = dataProviderConfiguration;
        this.IsFlr = isflr;
        this.sgbLogo = '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>';
        this.flrLogo = '<g id="layer1-2" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>';
        this.flareRegistryAddr = this.dataProviderConfiguration.flareContractRegistry;
    }
    checkNetwork(RpcUrl, isFlr) {
        if (isFlr == true) {
            RpcUrl = this.dataProviderConfiguration.flrRpcUrl;
        }
        else {
            RpcUrl = this.dataProviderConfiguration.sgbRpcUrl;
        }
    }
    runDataProvider(web3, provider, RpcUrl, Contracts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkNetwork(RpcUrl, this.IsFlr);
            provider = window.ethereum;
            web3 = getWeb3(RpcUrl);
            if (!provider) {
                alert('Please install an Ethereum Crypto Wallet!');
            }
            else {
                this.FlareContractRegistryContract = getWeb3Contract(web3, this.flareRegistryAddr, "FlareContractRegistry");
                try {
                    // @ts-ignore
                    const AllContracts = yield this.FlareContractRegistryContract.methods.getAllContracts().call;
                    Contracts = AllContracts;
                } catch (error) {
                    console.log(error)
                }
            }
        });
    }
}
