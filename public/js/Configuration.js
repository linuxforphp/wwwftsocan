export class DataProviderConfiguration {
    constructor() {
        this.flrRpcUrl = "https://flare-api.flare.network/ext/C/rpc";
        this.sgbRpcUrl = "https://songbird-api.flare.network/ext/bc/C/rpc";
        this.flareContractRegistry = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
        this.IsFlr = true;
    }
    SwitchNetwork(isFlr) {
        if (isFlr == true) {
            isFlr = false;
        }
        else if (isFlr == false) {
            isFlr = true;
        }
    }
}
