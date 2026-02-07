import { walletConnectEVMParams } from "./dapp-globals";
import { ConnectSecondaryWalletSetupLedger, ConnectWalletSetupLedger } from "./dapp-ledger";
import { message } from "./dapp-staking";
import { closeCurrentPopup, setCurrentAppState, setCurrentPopup } from "./dapp-ui";
import { checkConnection, resetDappObjectState, wait } from "./dapp-utils";
import { GetNetworkName, round, showAccountAddress, showFassetNativeAddress, showTokenBalance } from "./flare-utils";
 
 export const FAssetInfo = {
     FXRP: {
        name: "XRP",
        fasset: "FXRP",
        dummyAddress: "r0000000000000000000000000000000000",
        icon: '<path d="m14.288 61.775c0-0.31275 15.817-16.483 17.048-17.43 2.4538-1.8855 5.1818-2.8001 8.352-2.8001 3.1705 0 5.899 0.91481 8.3515 2.8001 1.1195 0.86053 15.608 15.657 16.75 17.106 0.34148 0.43328 0.14437 0.46047-3.3073 0.4563l-3.6704-0.0044-6.299-6.5763c-4.2178-4.4035-6.7092-6.7985-7.5406-7.2487-1.6786-0.90899-3.9336-1.3002-5.6349-0.97755-2.8013 0.53125-3.4724 1.0317-8.9551 6.6779-2.8602 2.9455-5.7759 5.9805-6.4794 6.7445l-1.279 1.389h-3.668c-2.0174 0-3.668-0.06166-3.668-0.13703zm22.334-24.315c-3.502-0.80017-4.519-1.5466-10.777-7.9097-3.1754-3.2288-7.0881-7.2695-8.6949-8.9793l-2.9214-3.1089h7.3722l2.3523 2.4474c7.8853 8.2041 10.645 10.875 11.897 11.515 1.9034 0.97222 4.7292 1.1094 6.8806 0.33396 1.489-0.53667 2.0068-0.99861 8.3419-7.4421l6.7544-6.8699 7.2567 0.14798-8.2977 8.599c-8.6373 8.9509-9.7221 9.8759-12.801 10.915-1.9424 0.65576-5.324 0.81705-7.3629 0.35118z" fill="#fff"/><path d="m34.112 78.988c-5.089-0.83306-8.5003-1.957-12.939-4.2633-10.455-5.4319-17.818-15.301-20.417-27.364-0.8634-4.0075-0.86392-11.334-0.0010992-15.346 1.7155-7.9773 5.3779-14.8 10.919-20.341 3.1244-3.1244 6.1979-5.335 10.154-7.3035 3.896-1.9384 6.1914-2.7518 10.186-3.6096 3.9555-0.8493 11.346-0.86002 15.231-0.022105 8.408 1.8136 14.393 5.0541 20.365 11.026 5.9719 5.9719 9.2124 11.957 11.026 20.365 0.83792 3.8847 0.82719 11.275-0.02211 15.231-0.85779 3.9951-1.6712 6.2905-3.6096 10.186-5.3909 10.835-15.358 18.455-27.512 21.034-3.4582 0.73377-10.141 0.93685-13.38 0.4066zm-11.21-18.464c0.70348-0.76398 3.6192-3.799 6.4794-6.7445 5.4827-5.6462 6.1539-6.1467 8.9551-6.6779 1.7013-0.32264 3.9563 0.06855 5.6349 0.97755 0.83143 0.45023 3.3228 2.8452 7.5406 7.2487l6.299 6.5763 3.6704 0.0044c3.4517 0.0042 3.6488-0.02302 3.3073-0.4563-1.1418-1.4487-15.631-16.245-16.75-17.106-4.9061-3.7714-11.795-3.7714-16.703 0-1.2314 0.94626-17.048 17.117-17.048 17.43 0 0.07537 1.6506 0.13703 3.668 0.13703h3.668zm21.082-23.414c3.0793-1.0396 4.1641-1.9646 12.801-10.915l8.2977-8.599-7.2567-0.14798-6.7544 6.8699c-6.3351 6.4435-6.8529 6.9054-8.3419 7.4421-2.1513 0.77541-4.9771 0.63826-6.8806-0.33396-1.252-0.63948-4.012-3.3108-11.897-11.515l-2.3523-2.4474h-7.3722l2.9214 3.1089c1.6068 1.7099 5.5195 5.7506 8.6949 8.9793 6.258 6.3631 7.275 7.1095 10.777 7.9097 2.0389 0.46587 5.4204 0.30459 7.3629-0.35118z"/>',
        fassetIcon: '<g id="layer1"><ellipse style="fill:#ffffff" id="path2"cx="6.6145835"cy="6.6145859"rx="6.6145835"ry="6.6145859" /><path style="fill:#e62d58; stroke:#e62d58; stroke-width:0.1;" d="M 6.1965174,13.218324 C 4.5578202,13.10096 3.0641187,12.428358 1.928391,11.296418 0.90838745,10.279816 0.27658573,9.0155097 0.04506158,7.5276609 -0.0152826,7.1398696 -0.01495097,6.0913555 0.04564434,5.6848932 0.157305,4.9358959 0.35743914,4.2961256 0.68437568,3.6430572 1.6634303,1.687358 3.4909399,0.37272906 5.6852645,0.04564179 c 0.406489,-0.0605947 1.4550714,-0.06092073 1.8428882,-5.829e-4 1.2528932,0.19493758 2.2860056,0.64425041 3.2458613,1.41166551 1.152619,0.92153 2.000093,2.298635 2.307393,3.7494039 0.215369,1.0167535 0.195163,2.0479666 -0.0597,3.0467512 -0.226223,0.886552 -0.629256,1.7038838 -1.213536,2.4609865 -0.224048,0.290317 -0.803271,0.869503 -1.093607,1.093535 -1.0802462,0.833551 -2.281896,1.299055 -3.622538,1.403327 -0.2735649,0.02128 -0.6588519,0.02455 -0.895511,0.0077 z m 1.3269638,-0.09039 C 8.6351884,12.96691 9.658605,12.54146 10.569968,11.861462 c 0.363661,-0.271341 1.020908,-0.928543 1.292266,-1.292181 0.684887,-0.9177957 1.095401,-1.9087417 1.272357,-3.071368 0.0586,-0.3849914 0.05725,-1.4195956 -0.0024,-1.8011274 C 13.011356,4.922973 12.811347,4.2938824 12.476673,3.6348277 11.847941,2.3966992 10.883668,1.4220701 9.632612,0.76022099 8.8327098,0.33704737 7.7883992,0.05928035 6.8980039,0.0328668 l -0.2377921,-0.0070774 -0.00598,6.5841326 -0.00598,6.584134 0.3151169,-0.01534 c 0.1733144,-0.0085 0.4253715,-0.0313 0.560127,-0.05082 z M 8.2200303,7.7476045 C 8.9399893,7.0356404 9.0697412,6.9270796 9.3108944,6.8348922 9.4963478,6.7639994 9.84347,6.7484728 10.048749,6.8018912 c 0.32049,0.0834 0.384441,0.1334084 1.177071,0.9204624 l 0.737155,0.7319698 -0.31955,3.332e-4 -0.31955,3.331e-4 -0.560281,-0.5543048 C 10.101734,7.2458836 10.07954,7.2313648 9.7396188,7.2308098 9.3991513,7.2302531 9.3777868,7.2442249 8.7160431,7.9000845 L 8.1561623,8.4549897 H 7.8304314 7.5047007 Z M 9.399285,6.3981826 C 9.1204961,6.3215502 9.0464552,6.2630071 8.2566034,5.494672 L 7.4988546,4.7575646 7.826826,4.7508848 8.1547977,4.7442051 8.7272506,5.3123345 c 0.5204431,0.5165124 0.5854157,0.5730604 0.7151278,0.6224093 0.1890534,0.071926 0.402072,0.071537 0.5944796,-0.00111 C 10.16681,5.8845928 10.230623,5.82915 10.75238,5.3119807 l 0.572844,-0.5678096 0.320943,0.00668 0.320943,0.00668 -0.741677,0.7290574 C 10.441203,6.2574763 10.359933,6.321309 10.060638,6.401453 9.9113426,6.441429 9.550182,6.439623 9.399285,6.398113 Z M 2.1723267,8.5132991 C 2.3941064,8.4206393 2.5110909,8.189391 2.4590159,7.9465881 2.424318,7.7848066 2.2568492,7.6146255 2.0992753,7.5810208 1.8874422,7.5358452 1.6953607,7.6106502 1.5717918,7.7864599 c -0.063905,0.09092 -0.071667,0.1208307 -0.071667,0.2761983 0,0.1552377 0.00778,0.185279 0.071338,0.2755134 0.1336795,0.1897847 0.3882159,0.2639718 0.6008639,0.1751275 z M 3.8481013,7.0118494 C 4.1456356,6.8709142 4.3745427,6.5625811 4.4056929,6.2607838 L 4.4189479,6.1323652 4.1626319,6.1166832 C 3.7616046,6.0921512 2.49178,6.0986482 2.3225557,6.1261032 1.9970326,6.1789212 1.7368815,6.3685162 1.5944026,6.6567839 1.5410436,6.7647418 1.5043536,6.8790439 1.4954876,6.9649364 L 1.4813956,7.101475 2.5846041,7.094635 3.6878126,7.087795 Z M 4.7773039,5.5815332 C 5.0873776,5.4564401 5.3675073,5.0888418 5.3733648,4.7993575 L 5.3761348,4.662454 3.8899345,4.6561745 C 2.8962442,4.6519573 2.3626044,4.6583985 2.2796197,4.6755431 1.8612585,4.7619255 1.537941,5.1117971 1.494606,5.5250306 l -0.01316,0.1254891 1.5787667,-0.0066 1.5787668,-0.0066 z"/></g>',
        fassetAddress: "0xF9a84f4ec903F4EaB117A9c1098BeC078BA7027d",
        decimals: 6,
        rpcUrl: "xrpl:0",
        prepareBalanceTransaction: async (account) => {
            return { 
                command: 'account_info', 
                account: account // Add your account here
            };
        },
        formatBalanceResponse: async (balance) => {
            return balance[0].Balance;
        },
        ledgerAppName: "XRP",
        metamaskSnapName: "npm:xrpl-snap",
        metamaskSnapRequest: {"npm:xrpl-snap": {},},
        metamaskSnapAccountRequest: 'xrpl_getAccount',
        metamaskSnapBalanceRequest: 'xrpl_request',
        walletConnectNetworkParams: {
            name: "Mainnet",
            networkWss: "wss://xrplcluster.com",
            walletconnectId: "xrpl:0",
            rpc: "https://xrplcluster.com",
        },
     },
     FDOGE: {
        name: "DOGE",
        fasset: "FDOGE",
        dummyAddress: "D000000000000000000000000000000000",
        icon: '<circle cx="39.737" cy="39.746" r="39.629" fill="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" style="paint-order:stroke fill markers"/><g transform="matrix(.039629 0 0 .039629 .10824 .11684)" fill="#c2a633" stroke-width="8.3456"><path d="m1024 659h-142.88v281.69h224.79v117.94h-224.79v281.67h149.88c38.51 0 316.16 4.35 315.73-327.72s-269.29-353.58-322.73-353.58z"/><path d="m1e3 0c-552.29 0-1e3 447.71-1e3 1e3s447.71 1e3 1e3 1e3 1e3 -447.71 1e3 -1e3 -447.71-1e3 -1e3 -1e3zm39.29 1540.1h-362.15v-481.46h-127.66v-117.94h127.65v-481.49h310.82c73.53 0 560.56-15.27 560.56 549.48 0 574.09-509.21 531.41-509.21 531.41z"/></g>',
        fassetIcon: '<g id="layer1"><ellipse style="fill:#ffffff" id="path2"cx="6.6145835"cy="6.6145859"rx="6.6145835"ry="6.6145859" /><path style="fill:#e62d58; stroke:#e62d58; stroke-width:0.1;" d="M 6.078503,13.215004 C 4.0474908,13.035317 2.2375888,11.969274 1.1151778,10.291596 0.1801738,8.8940351 -0.18394774,7.2069926 0.08768815,5.5310444 0.42187156,3.4691965 1.7517158,1.6567089 3.6292938,0.70408504 4.3366162,0.34520983 5.0827749,0.12469664 5.9120522,0.02947548 6.3313718,-0.0186805 7.1628792,-0.00604288 7.5527844,0.05435165 9.0209055,0.28190199 10.28217,0.91372322 11.299863,1.9314175 c 1.023625,1.0236208 1.659471,2.2991492 1.882732,3.7768329 0.05848,0.3869906 0.05755,1.444866 -0.0016,1.8249857 -0.196729,1.2643141 -0.67238,2.3405333 -1.455554,3.2933569 -0.271466,0.330268 -0.778838,0.817409 -1.109558,1.065312 -0.9369895,0.702366 -2.0043648,1.139308 -3.1463157,1.28798 -0.3568085,0.04643 -1.0616757,0.06425 -1.391056,0.03512 z m 1.4696102,-0.08122 C 9.6865291,12.824029 11.541817,11.48625 12.509837,9.5560729 13.291252,7.9979813 13.41964,6.1776782 12.865037,4.520028 12.126065,2.3113244 10.23615,0.63350058 7.9570227,0.16280905 7.6869854,0.10707049 7.251886,0.05179086 6.916703,0.03070599 L 6.6729712,0.01540782 V 6.6076834 13.199965 l 0.3150685,-0.0153 c 0.1732871,-0.0084 0.4253205,-0.03133 0.5600735,-0.05082 z M 8.2661463,7.7606268 V 6.7961236 H 8.0045801 7.7430139 V 6.5702226 6.3443285 h 0.2615662 0.2615662 v -0.9644899 -0.96449 l 0.9689835,0.00825 c 1.0930462,0.00925 1.1012202,0.010442 1.4802262,0.2128973 0.529915,0.2830561 0.879258,0.7494509 0.98832,1.3194675 0.0539,0.2817124 0.04695,1.0679588 -0.01147,1.2963472 -0.17024,0.6656301 -0.630187,1.1595084 -1.285977,1.380833 l -0.225897,0.076238 -0.9570944,0.00792 -0.9570943,0.00792 z m 1.7622227,0.1288238 c 0.206307,-0.03911 0.413082,-0.1498156 0.566554,-0.3032895 0.256294,-0.256291 0.341598,-0.5070214 0.341604,-1.0040456 6e-6,-0.533494 -0.07533,-0.7615566 -0.338259,-1.0240133 C 10.321792,5.2821232 10.14563,5.2274089 9.5323641,5.2270098 L 9.0984021,5.2267371 V 5.7736468 6.3205565 H 9.526419 9.954436 V 6.5464573 6.7723581 H 9.526419 9.0984021 v 0.5706884 0.5706884 h 0.4009931 c 0.2205457,0 0.458584,-0.010908 0.5289738,-0.024278 z M 2.2770005,8.4718056 C 2.5774497,8.2601853 2.5509603,7.8092816 2.2275774,7.6305192 2.0035192,7.5066704 1.7005726,7.5858884 1.5742938,7.8014063 1.4538712,8.0069074 1.4732188,8.2236426 1.6272148,8.3942438 1.7467446,8.5266662 1.8251266,8.5578478 2.0172597,8.5494206 2.149138,8.5434342 2.1940944,8.530198 2.2770005,8.4718056 Z m 1.5972816,-1.45757 C 4.0680215,6.9188282 4.2444631,6.7487524 4.3290438,6.5758765 4.3951365,6.4407868 4.4577466,6.1661447 4.4290027,6.1374041 4.3984038,6.1068078 2.5399789,6.0983604 2.3495912,6.1279592 2.0421836,6.1757161 1.7735508,6.3535606 1.6245348,6.6078897 1.5615649,6.7153625 1.4892079,6.9526438 1.4892079,7.0516696 v 0.055339 l 1.1122074,-0.00685 1.1122074,-0.00685 z M 4.7278385,5.605593 C 5.0710947,5.4899588 5.3152967,5.2151904 5.3881271,4.8626473 5.4038244,4.7866486 5.4107617,4.7090735 5.403545,4.6902501 5.3923108,4.6609841 5.1727952,4.6560621 3.8847147,4.6560621 c -1.6109543,0 -1.6434391,0.002 -1.8772504,0.121381 C 1.8665951,4.8493113 1.664031,5.061304 1.5959954,5.2080667 1.5304225,5.3495215 1.4785155,5.5688242 1.4983655,5.620552 c 0.011236,0.029266 0.2345867,0.034189 1.5483548,0.034189 1.488881,0 1.5396288,-0.00133 1.6811198,-0.049154 z" id="path3" /></g>',
        fassetAddress: "0xaa25ee3B68c515e69A463876Ab262bc4e8339030",
        decimals: 8,
        rpcUrl: "bip122:1a91e3dace36e2be3bf030a65679fe82",
        prepareBalanceTransaction: async (account) => {
            return {
            };
        },
        formatBalanceResponse: async (balance) => {
            return ;
        },
        ledgerAppName: "Dogecoin",
        metamaskSnapName: "",
        metamaskSnapRequest: {"": {},},
        metamaskSnapAccountRequest: '',
        metamaskSnapBalanceRequest: '',
        walletConnectNetworkParams: {
            name: "",
            networkWss: "",
            walletconnectId: "",
            rpc: "",
        },
     },
 }

 export async function hasSnapsSupport() {
    try {
      await DappObject.chosenEVMProvider.request({
        method: 'wallet_getSnaps',
      });
      return true;
    } catch {
      return false;
    }
  }

 
 export async function ConnectWalletClickFassets(DappObject, pageIndex, HandleClick, PassedPublicKey, PassedEthAddr, addressIndex, PassedSecondaryAddr, FassetName) {
     DappObject.isHandlingOperation = true;

    if (DappObject.secondaryWalletIndex != -1 && DappObject.walletIndex != 1) {
        document.getElementById("ConnectNative").remove();
    }
 
     let rpcUrl = "https://sbi.sgb.ftsocan.com/ext/C/rpc";
 
     let flrAddr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
 
     clearTimeout(DappObject.latestPopupTimeoutId);
 
     checkConnection();
 
     await setCurrentAppState("Connecting");
 
     await setCurrentPopup("Connecting...", true);
 
     DappObject.isAccountConnected = false;
 
     if (typeof addressIndex === "undefined" || addressIndex === "") {
         document.getElementById("ConnectWalletText").innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
     }
     
     let web32 = new Web3(rpcUrl);
 
     try {
         let flrPublicKey;
 
         let account;

         let secondaryAccount;
 
         let selectize;
 
         if (addressIndex && addressIndex !== "") {
             DappObject.ledgerSelectedIndex = addressIndex;
         }
 
         let requiredApp;
 
         if (DappObject.isAvax === true) {
             requiredApp = "Avalanche";
         } else {
             requiredApp = "Flare Network";
         }
 
        if (!PassedPublicKey) {
            // --- If this is the first time connecting... ---
            if (DappObject.walletIndex === 1) {
                if (typeof addressIndex === "undefined" || addressIndex === "") {
                    await ConnectWalletSetupLedger(requiredApp, selectize, account, flrPublicKey, rpcUrl, flrAddr, pageIndex, HandleClick, DappObject, FassetName, DappObject.secondaryAddr);
                } else {
                    account = PassedEthAddr;
                    
                    if (HandleClick) {
                        document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
                    }
    
                    await setCurrentAppState("Connected");
    
                    closeCurrentPopup();
    
                    // await setCurrentPopup("Connected to account: " + account.slice(0, 17));
    
                    DappObject.isAccountConnected = true;
                }
            } else {
                // EIP-1193 Wallets (Browser Wallets, WalletConnect, ect.)
                if (DappObject.walletIndex === 0) { 
                    if (DappObject.chosenEVMProvider === undefined) {
                        DappObject.chosenEVMProvider = window.ethereum;
                    }
                } else if (DappObject.walletIndex === 2) {
                    if (DappObject.chosenEVMProvider === undefined) {
                        DappObject.chosenEVMProvider = await walletConnectProvider.init(walletConnectEVMParams);
                    }
        
                    if (!DappObject.chosenEVMProvider.session) {
                        await DappObject.chosenEVMProvider.connect();
                    }
                } else if (DappObject.walletIndex === 3) {
                    if (DappObject.chosenEVMProvider === undefined) {
                        await cryptoComConnector.activate();

                        DappObject.chosenEVMProvider = await cryptoComConnector.getProvider();
                    }
                }

                if (DappObject.selectedAddress === "") {
                    const accounts = await DappObject.chosenEVMProvider.request({method: 'eth_requestAccounts'});
                
                    account = accounts[0];
                } else {
                    account = DappObject.selectedAddress;
                }

                if (DappObject.signatureStaking === "") {
        
                    if (DappObject.isPopupActive == false) {
                        let signSpinner = await showSignatureSpinner();

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

                        DappObject.isPopupActive = false;

                        signSpinner.close();
                    } else {
                        return;
                    }
                }

                await setCurrentAppState("Connected");

                closeCurrentPopup();

                // await setCurrentPopup("Connected to account: " + account.slice(0, 17));

                DappObject.isAccountConnected = true;

                flrPublicKey = await GetPublicKey(account, message, DappObject.signatureStaking);
            }
        } else {
            // --- If there are passed values, we use them instead. ---

            account = PassedEthAddr;
            flrPublicKey = PassedPublicKey;

            if (HandleClick) {
                document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
            }

            await setCurrentAppState("Connected");

            closeCurrentPopup();

            // await setCurrentPopup("Connected to account: " + account.slice(0, 17));

            DappObject.isAccountConnected = true;
        }

        if (DappObject.walletIndex === 1 && (typeof addressIndex == "undefined" || addressIndex === "")) {
            DappObject.isHandlingOperation = false;
        } else if ((DappObject.walletIndex === 1 && (addressIndex && addressIndex !== "")) || DappObject.walletIndex !== -1) {
            DappObject.selectedAddress = account;

            try {
                if (pageIndex === 0) {
                    // MINT
                    const wrappedTokenAddr = FAssetInfo[FassetName].fassetAddress;
                    let tokenContract = new web32.eth.Contract(DappObject.fassetTokenAbi, wrappedTokenAddr);
                    showAccountAddress(account);
                    const tokenBalance = await tokenContract.methods.balanceOf(account).call();
    
                    DappObject.wrapBool = (document.getElementById("wrapUnwrap").value === 'true');
    
                    showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));

                    await setCurrentPopup("This is the 'Wrap' page, where you can convert your FLR or SGB into WFLR and WSGB respectively. This will allow you to delegate to an FTSO and earn passive income!", true);

                    clearTimeout(DappObject.latestPopupTimeoutId);

                    DappObject.latestPopupTimeoutId = setTimeout( async () => {
                        await setCurrentPopup("First, choose if you would like to Wrap, or Unwrap your tokens by clicking on the top left button. Then, input the amount of tokens you would like to transfer. Don't forget to keep some FLR or SGB for gas fees!", true);
                    }, 15000);
                } else if (pageIndex === 1) {
                    // POOLS
                } else if (pageIndex === 2) {
                    // REWARDS
                }

                DappObject.isHandlingOperation = false;
            } catch (error) {
                throw error
            }
        }

        if (!PassedSecondaryAddr) {
            // --- If this is the first time connecting to FASSETS... ---
            if (DappObject.secondaryWalletIndex !== -1) {
                console.log("HELLO FASSETS")
                if (DappObject.secondaryWalletIndex === 1) {
                    if (typeof addressIndex === "undefined" || addressIndex === "") {
                        await ConnectSecondaryWalletSetupLedger(requiredApp, selectize, PassedEthAddr, PassedPublicKey, secondaryAccount, pageIndex, HandleClick, DappObject, FassetName);
                    } else {
                        secondaryAccount = PassedSecondaryAddr;
                        
                        if (HandleClick) {
                            document.getElementById("ConnectNative").removeEventListener("click", HandleClick);
                            document.getElementById("ConnectNative").remove();
                        }
        
                        await setCurrentAppState("Connected");
        
                        closeCurrentPopup();
        
                        // await setCurrentPopup("Connected to account: " + account.slice(0, 17));
        
                        DappObject.isAccountConnected = true;
                    }
                } else {
                    // EIP-1193 Wallets (Browser Wallets, WalletConnect, ect.)

                    let rawBalance;
    
                    if (DappObject.secondaryAddr === "" || DappObject.secondaryAddr === undefined) {
                        if (DappObject.secondaryWalletIndex === 0) {
                            // METAMASK SNAP 
                            if (DappObject.chosenEVMProvider === undefined) {
                                DappObject.chosenEVMProvider = window.ethereum;
                            }

                            try {
                                await DappObject.chosenEVMProvider.request({
                                    method: 'wallet_requestSnaps',
                                    params: FAssetInfo[FassetName].metamaskSnapRequest,
                                });
    
                                const accounts = await DappObject.chosenEVMProvider.request({
                                    method: 'wallet_invokeSnap',
                                    params: {
                                        snapId: FAssetInfo[FassetName].metamaskSnapName, 
                                        request: {
                                            method: FAssetInfo[FassetName].metamaskSnapAccountRequest
                                        },
                                    }
                                });
    
                                console.log("XRP ACCOUNT:")
                                console.log(accounts);
                            
                                secondaryAccount = accounts.account;

                                let balanceRequest = await FAssetInfo[FassetName].prepareBalanceTransaction(secondaryAccount);

                                rawBalance = await DappObject.chosenEVMProvider.request({
                                    method: 'wallet_invokeSnap',
                                    params: {
                                        snapId: FAssetInfo[FassetName].metamaskSnapName, 
                                        request: {
                                            method: FAssetInfo[FassetName].metamaskSnapBalanceRequest,
                                            params: balanceRequest
                                        },
                                    }
                                });
                            } catch (error) {
                                console.log(error);
                            }
                        } else if (DappObject.secondaryWalletIndex === 2) {
                            // WALLET CONNECT
                            if (DappObject.secondaryProvider === undefined) {
                                DappObject.secondaryProvider = new walletConnectSecondaryProvider(FAssetInfo[FassetName].walletConnectNetworkParams);  
                            }
                
                            if (!DappObject.secondaryProvider.Session) {
                                await DappObject.secondaryProvider.connectKitToWallet(walletConnectEVMParams.qrModalOptions.themeVariables);
                            }

                            const accounts = await DappObject.secondaryProvider.getAccounts();
    
                            console.log("XRP ACCOUNT:")
                            console.log(accounts);
                            
                            secondaryAccount = accounts[0];

                            let balanceRequest = await FAssetInfo[FassetName].prepareBalanceTransaction(secondaryAccount);

                            rawBalance = await DappObject.secondaryProvider.signTransaction(balanceRequest);
                        }
                    } else {
                        secondaryAccount = DappObject.secondaryAddr;
                    }
    
                    await setCurrentAppState("Connected");
    
                    closeCurrentPopup();
    
                    // await setCurrentPopup("Connected to account: " + account.slice(0, 17));
    
                    DappObject.isAccountConnected = true;
                }
            }
        }

        if (DappObject.walletIndex === 1 && (typeof addressIndex == "undefined" || addressIndex === "")) {
            DappObject.isHandlingOperation = false;
        } else if ((DappObject.walletIndex === 1 && (addressIndex && addressIndex !== "")) || DappObject.walletIndex !== -1) {
            DappObject.secondaryAddr = secondaryAccount;

            let nativeBalance = await FAssetInfo[FassetName].formatBalanceResponse(rawBalance);

            if (pageIndex === 0) {
                // MINT
                showFassetNativeAddress(secondaryAccount);

                // @TODO: ShowNativeBalance(String(BigInt(nativeBalance) / BigInt(10 * FAssetInfo[FassetName].decimals)));
            }
        }
     } catch (error) {
         console.log(error);
 
         document.getElementById("ConnectWalletText").innerText = "Connect Wallet";
 
         await resetDappObjectState(DappObject);
 
         var ClickHandler;
 
         if (HandleClick) {
             document.getElementById("ConnectWallet").removeEventListener("click", HandleClick);
         }
 
         document.getElementById("ConnectWallet")?.addEventListener("click", ClickHandler = async () => {
             ConnectWalletClickFassets(DappObject, pageIndex, ClickHandler, undefined, undefined, undefined, FassetName);
         });
     }
 }