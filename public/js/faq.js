var acc = document.getElementsByClassName("faq-accordion");

const addFlr = document.getElementById('addFlr');
const addSgb = document.getElementById('addSgb');
const addWflr = document.getElementById('addWflr');
const addWsgb = document.getElementById('addWsgb');

const WflrAddr = '0x1d80c49bbbcd1c0911346656b529df9e5c2f783d';
const WflrSymbol = 'WFLR';
const tokenDecimals = 18;
const WflrImage = 'https://portal.flare.network/token-logos/FLR.svg';

const WsgbAddr = '0x02f0826ef6ad107cfc861152b32b52fd11bab9ed';
const WsgbSymbol = 'WSGB';
const WsgbImage = 'https://portal.flare.network/token-logos/SGB.svg';

addFlr.addEventListener("click", async () => {
    await window.ethereum.request({
        "method": "wallet_addEthereumChain",
        "params": [
          {
            "chainId": "0xe",
            "chainName": "Flare Mainnet",
            "rpcUrls": [
              "https://sbi.flr.ftsocan.com/ext/C/rpc"
            ],
            "iconUrls": [
              "https://portal.flare.network/token-logos/FLR.svg"
            ],
            "nativeCurrency": {
              "name": "Flare",
              "symbol": "FLR",
              "decimals": 18
            },
            "blockExplorerUrls": [
              "https://flare-explorer.flare.network/"
            ]
          }
        ]
      });
      
})

addSgb.addEventListener("click", async () => {
    await window.ethereum.request({
        "method": "wallet_addEthereumChain",
        "params": [
          {
            "chainId": "0x13",
            "chainName": "Songbird Canary-Network",
            "rpcUrls": [
              "https://sbi.sgb.ftsocan.com/ext/C/rpc"
            ],
            "iconUrls": [
              "https://portal.flare.network/token-logos/SGB.svg"
            ],
            "nativeCurrency": {
              "name": "Songbird",
              "symbol": "SGB",
              "decimals": 18
            },
            "blockExplorerUrls": [
              "https://songbird-explorer.flare.network/"
            ]
          }
        ]
      });
      
})

addWflr.addEventListener("click", async () => {
    await window.ethereum.request({
        "method": "wallet_switchEthereumChain",
        "params": [
            {
            "chainId": "0xe"
            }
        ]
    });
    
    await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: WflrAddr, // The address of the token.
            symbol: WflrSymbol, // A ticker symbol or shorthand, up to 5 characters.
            decimals: tokenDecimals, // The number of decimals in the token.
            image: WflrImage, // A string URL of the token logo.
          },
        },
      });  
})

addWsgb.addEventListener("click", async () => {
    await window.ethereum.request({
        "method": "wallet_switchEthereumChain",
        "params": [
            {
            "chainId": "0x13"
            }
        ]
    });
    
    await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: WsgbAddr, // The address of the token.
            symbol: WsgbSymbol, // A ticker symbol or shorthand, up to 5 characters.
            decimals: tokenDecimals, // The number of decimals in the token.
            image: WsgbImage, // A string URL of the token logo.
          },
        },
      });  
})

for (var i = 0; i < acc.length ; i++) {
    acc[i].addEventListener("click", function(){
        this.classList.toggle("active");
        this.parentElement.classList.toggle("active");
    })
}