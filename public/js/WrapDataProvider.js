var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getWeb3, getWeb3Contract } from './Utils.js';
import { DataProvider } from './DataProvider.js';
let web3;
let provider;
let RpcUrl = '';
let Contracts;
let dataProvider = new DataProvider;
let dataProviderConfig = dataProvider.dataProviderConfiguration;
let isFlr = dataProvider.IsFlr;
// @ts-ignore
dataProvider.runDataProvider(web3, provider, RpcUrl, Contracts);

export class WrapDataProvider {
    constructor() {
        this.DATAPROVIDER = dataProvider;
        this.DATAPROVIDERCONFIG = dataProviderConfig;
        this.WEB3 = web3;
        this.PROVIDER = provider;
        this.RPC_URL = RpcUrl;
        this.CONTRACTS = Contracts;
        this.CONTRACT_NAME = this.CONTRACTS[0];
        this.CONTRACT_ADDR = this.CONTRACTS[1];
        this.IS_FLR = isFlr;
        this.SGB_LOGO = this.DATAPROVIDER.sgbLogo;
        this.FLR_LOGO = this.DATAPROVIDER.flrLogo;
    }
    SwitchNetwork(RPCUrl, IsFlare) {
        RPCUrl = this.RPC_URL;
        IsFlare = this.IS_FLR;
        this.DATAPROVIDERCONFIG.SwitchNetwork(IsFlare);
        this.DATAPROVIDER.checkNetwork(RPCUrl, IsFlare);
    }
    CheckNetwork(RPCUrl, IsFlare) {
        RPCUrl = this.RPC_URL;
        IsFlare = this.IS_FLR;
        this.DATAPROVIDER.checkNetwork(RPCUrl, IsFlare);
    }
    GetWrapContracts(web3, rpcurl, isflare, wnatcontract) {
        return __awaiter(this, void 0, void 0, function* () {
            web3 = this.WEB3;
            rpcurl = this.RPC_URL;
            isflare = this.IS_FLR;
            web3 = getWeb3(rpcurl);
            this.CheckNetwork(rpcurl, isflare);
            if (isflare == true) {
                const wnatContract = getWeb3Contract(web3, this.CONTRACT_ADDR[19], this.CONTRACT_NAME[19]);
                wnatcontract = wnatContract;
            }
            else {
                const wnatContract = getWeb3Contract(web3, this.CONTRACT_ADDR[10], this.CONTRACT_NAME[10]);
                wnatcontract = wnatContract;
            }
        });
    }
    runWrapDataProvider(web3, provider, rpcurl, isflare, wnatContract, account, balance, tokenBalance) {
        return __awaiter(this, void 0, void 0, function* () {
            wnatContract = this.WNAT_CONTRACT;
            web3 = this.WEB3;
            provider = this.PROVIDER;
            rpcurl = this.RPC_URL;
            isflare = this.IS_FLR;
            web3 = getWeb3(rpcurl);
            this.CheckNetwork(rpcurl, isflare);
            this.GetWrapContracts(web3, rpcurl, isflare, wnatContract);
            try {
                const accounts = (yield provider.send('eth_requestAccounts')).result;
                account = accounts[0];
                balance = yield web3.eth.getBalance(account);
                tokenBalance = yield wnatContract.methods.balanceOf(account).call();
            }
            catch (error) {
                // User denied or Error
                console.log(error);
            }
        });
    }
}
