export let injectedProviderDropdown;

export const walletConnectEVMParams = {
    projectId: '89353513e21086611c5118bd063aae5b',
    metadata: {
        name: 'FTSOCAN DApp',
        description: "The FTSOCAN DApp allows you to manage your $FLR and $SGB tokens in a secure, lightweight, and intuitive way. Wrap, delegate and claim your token rewards, using the DApp's fully responsive, and mobile-friendly interface.",
        url: 'https://ftsocan.com/dapp/index', // origin must match your domain & subdomain
        icons: ['https://avatars.githubusercontent.com/u/37784886']
    },
    showQrModal: true,
    qrModalOptions: {
        themeMode: "light",
        explorerRecommendedWalletIds: [
            // Bifrost Wallet
            "37a686ab6223cd42e2886ed6e5477fce100a4fb565dcd57ed4f81f7c12e93053",
            // Metamask
            "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
            // Web3AUTH
            "78aaedfb74f2f4737134f2aaa78871f15ff0a2828ecb0ddc5b068a1f57bb4213",
            // Ledger
            '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
        ],
        explorerExcludedWalletIds: [
            // Ledger
            //'19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927'
        ],
        themeVariables: {
            '--wcm-z-index': 9998,
            '--wcm-font-family': "'Poppins', sans-serif",
            '--wcm-accent-color': "rgba(255, 49, 32, 0.8)",
            '--wcm-background-color': "rgba(255, 49, 32, 0.8)",
            '--wcm-overlay-background-color': "rgba(0, 0, 0, 0.5)",
        },
    },

    optionalChains: [14, 19],
    methods: ['eth_sign'],

    /*Optional - Add custom RPCs for each supported chain*/
    rpcMap: {
        14: 'https://sbi.flr.ftsocan.com',
        19: 'https://sbi.sgb.ftsocan.com'
    }
}

export const ledgerAppList = [{
    id: 0,
    title: "Flare App"
},{
    id: 1,
    title: "Avalanche App"
}];

export let injectedProvider = window.ethereum;