"use strict";
(() => {
  // dapp_wrap.js
  var provider = window.ethereum;
  var selectedNetwork = document.getElementById("SelectedNetwork");
  var ercAbi = human_standard_token_abi;
  var flrAbi = flare_abi;
  var sgbLogo = '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>';
  var flrLogo = '<g id="layer1-2" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>';
  var wrapUnwrapButton = document.getElementById("wrapUnwrap");
  var amountFrom = document.getElementById("AmountFrom");
  var amountTo = document.getElementById("AmountTo");
  var tokenIdentifier = "FLR";
  var wrappedTokenIdentifier = "WFLR";
  var rpcUrl = "https://flare-api.flare.network/ext/C/rpc";
  var wrappedTokenAddr = "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d";
  var flrAddr = "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019";
  var networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;
  var WrapBool = true;
  var ConnectWalletBool = false;
  var IsRealValue = false;
  var fromIcon = document.getElementById("FromIcon");
  var toIcon = document.getElementById("ToIcon");
  document.getElementById("layer2").innerHTML = flrLogo;
  document.getElementById("layer3").innerHTML = flrLogo;
  function showRpcUrl(rpcAddress) {
    document.getElementById("rpcAddress").innerText = rpcAddress;
  }
  function showTokenIdentifiers(Token, WrappedToken) {
    document.getElementById("tokenIdentifier").innerText = Token;
    document.getElementById("wrappedTokenIdentifier").innerText = WrappedToken;
  }
  function round(num) {
    return +(Math.round(num + "e+4") + "e-4");
  }
  async function switchIconColor() {
    if (wrapUnwrapButton.value != "true") {
      wrapUnwrapButton.value = "true";
      fromIcon.style.color = "#000";
      toIcon.style.color = "#fd000f";
      document.getElementById("Wrap").style.color = "#383a3b";
      document.getElementById("Unwrap").style.color = "#fd000f";
      showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
      WrapBool = false;
      if (!provider) {
        alert("MetaMask is not installed, please install it.");
      } else {
        console.log("isMetaMask=", provider.isMetaMask);
        let web32 = new Web3(rpcUrl);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        try {
          const isUnlocked = isWalletUnlocked();
          if (await isUnlocked != "false") {
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
            showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            console.log(`Account `, account, ` has `, balance, ` tokens, and `, tokenBalance, ` wrapped tokens.`);
          } else {
            alert("You are not connected!");
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (Number(amountFrom.value) < 1 | !isNumber(amountFrom.value)) {
        document.getElementById("WrapButton").style.backgroundColor = "#8f8f8f";
        document.getElementById("WrapButton").style.cursor = "auto";
        document.getElementById("WrapButton").innerText = "Enter Amount";
        IsRealValue = false;
      } else {
        document.getElementById("WrapButton").style.backgroundColor = "#fd000f";
        document.getElementById("WrapButton").style.cursor = "pointer";
        IsRealValue = true;
        if (WrapBool == true) {
          document.getElementById("WrapButton").innerText = "Wrap";
        } else {
          document.getElementById("WrapButton").innerText = "Unwrap";
        }
      }
    } else {
      wrapUnwrapButton.value = "false";
      fromIcon.style.color = "#fd000f";
      toIcon.style.color = "#000";
      document.getElementById("Wrap").style.color = "#fd000f";
      document.getElementById("Unwrap").style.color = "#383a3b";
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
      WrapBool = true;
      if (!provider) {
        alert("MetaMask is not installed, please install it.");
      } else {
        console.log("isMetaMask=", provider.isMetaMask);
        let web32 = new Web3(rpcUrl);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        try {
          const isUnlocked = isWalletUnlocked();
          if (await isUnlocked != "false") {
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            console.log(`Account `, account, ` has `, balance, ` tokens, and `, tokenBalance, ` wrapped tokens.`);
          } else {
            alert("You are not connected!");
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (Number(amountFrom.value) < 1 | !isNumber(amountFrom.value)) {
        document.getElementById("WrapButton").style.backgroundColor = "#8f8f8f";
        document.getElementById("WrapButton").style.cursor = "auto";
        document.getElementById("WrapButton").innerText = "Enter Amount";
        IsRealValue = false;
      } else {
        document.getElementById("WrapButton").style.backgroundColor = "#fd000f";
        document.getElementById("WrapButton").style.cursor = "pointer";
        IsRealValue = true;
        if (WrapBool == true) {
          document.getElementById("WrapButton").innerText = "Wrap";
        } else {
          document.getElementById("WrapButton").innerText = "Unwrap";
        }
      }
    }
  }
  function showAccountAddress(address) {
    document.getElementById("ConnectWallet").innerText = address;
  }
  function showBalance(balanceAddress) {
    document.getElementById("Balance").innerText = balanceAddress;
  }
  function showTokenBalance(tokenBalanceAddress) {
    document.getElementById("TokenBalance").innerText = tokenBalanceAddress;
  }
  async function isWalletUnlocked() {
    const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
    let unlocked;
    try {
      const accounts = await Web3provider.listAccounts();
      unlocked = accounts.length > 0;
    } catch (e) {
      unlocked = false;
    }
    return unlocked;
  }
  function isInput() {
    if (Number(amountFrom.value) < 1 | !isNumber(amountFrom.value)) {
      document.getElementById("WrapButton").style.backgroundColor = "#8f8f8f";
      document.getElementById("WrapButton").style.cursor = "auto";
      document.getElementById("WrapButton").innerText = "Enter Amount";
      IsRealValue = false;
    } else {
      document.getElementById("WrapButton").style.backgroundColor = "#fd000f";
      document.getElementById("WrapButton").style.cursor = "pointer";
      IsRealValue = true;
      if (WrapBool == true) {
        document.getElementById("WrapButton").innerText = "Wrap";
      } else {
        document.getElementById("WrapButton").innerText = "Unwrap";
      }
    }
  }
  function isNumber(value) {
    if (void 0 === value || null === value) {
      return false;
    }
    if (typeof value == "number") {
      return true;
    }
    return !isNaN(value - 0);
  }
  function copyInput() {
    if (isNumber(amountFrom.value)) {
      amountTo.value = amountFrom.value;
    } else {
      amountTo.value = "";
    }
  }
  if (networkValue == 1) {
    rpcUrl = "https://flare-api.flare.network/ext/C/rpc";
    wrappedTokenAddr = "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d";
    tokenIdentifier = "FLR";
    wrappedTokenIdentifier = "WFLR";
    document.getElementById("layer2").innerHTML = flrLogo;
    document.getElementById("layer3").innerHTML = flrLogo;
    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    showRpcUrl(rpcUrl);
  } else {
    rpcUrl = "https://songbird-api.flare.network/ext/bc/C/rpc";
    wrappedTokenAddr = "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED";
    tokenIdentifier = "SGB";
    wrappedTokenIdentifier = "WSGB";
    document.getElementById("layer2").innerHTML = sgbLogo;
    document.getElementById("layer3").innerHTML = sgbLogo;
    showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    showRpcUrl(rpcUrl);
  }
  showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
  showRpcUrl(rpcUrl);
  isInput();
  selectedNetwork.onchange = async () => {
    networkValue = selectedNetwork.options[selectedNetwork.selectedIndex].value;
    if (networkValue == 1) {
      rpcUrl = "https://flare-api.flare.network/ext/C/rpc";
      wrappedTokenAddr = "0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d";
      tokenIdentifier = "FLR";
      wrappedTokenIdentifier = "WFLR";
      document.getElementById("layer2").innerHTML = flrLogo;
      document.getElementById("layer3").innerHTML = flrLogo;
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
      showRpcUrl(rpcUrl);
      if (!provider) {
        alert("MetaMask is not installed, please install it.");
      } else {
        console.log("isMetaMask=", provider.isMetaMask);
        let web32 = new Web3(rpcUrl);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        try {
          const isUnlocked = isWalletUnlocked();
          if (await isUnlocked != "false") {
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            console.log(`Account `, account, ` has `, balance, ` tokens, and `, tokenBalance, ` wrapped tokens.`);
          } else {
            alert("You are not connected!");
          }
        } catch (error) {
          console.log(error);
        }
      }
      wrapUnwrapButton.value = "false";
      fromIcon.style.color = "#fd000f";
      toIcon.style.color = "#000";
      document.getElementById("Wrap").style.color = "#fd000f";
      document.getElementById("Unwrap").style.color = "#383a3b";
      WrapBool = true;
      if (Number(amountFrom.value) < 1 | !isNumber(amountFrom.value)) {
        document.getElementById("WrapButton").style.backgroundColor = "#8f8f8f";
        document.getElementById("WrapButton").style.cursor = "auto";
        document.getElementById("WrapButton").innerText = "Enter Amount";
        IsRealValue = false;
      } else {
        document.getElementById("WrapButton").style.backgroundColor = "#fd000f";
        document.getElementById("WrapButton").style.cursor = "pointer";
        IsRealValue = true;
        if (WrapBool == true) {
          document.getElementById("WrapButton").innerText = "Wrap";
        } else {
          document.getElementById("WrapButton").innerText = "Unwrap";
        }
      }
    } else {
      rpcUrl = "https://songbird-api.flare.network/ext/bc/C/rpc";
      wrappedTokenAddr = "0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED";
      tokenIdentifier = "SGB";
      wrappedTokenIdentifier = "WSGB";
      document.getElementById("layer2").innerHTML = sgbLogo;
      document.getElementById("layer3").innerHTML = sgbLogo;
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
      showRpcUrl(rpcUrl);
      if (!provider) {
        alert("MetaMask is not installed, please install it.");
      } else {
        console.log("isMetaMask=", provider.isMetaMask);
        let web32 = new Web3(rpcUrl);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        try {
          const isUnlocked = isWalletUnlocked();
          if (await isUnlocked != "false") {
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            console.log(`Account `, account, ` has `, balance, ` tokens, and `, tokenBalance, ` wrapped tokens.`);
          } else {
            alert("You are not connected!");
          }
        } catch (error) {
          console.log(error);
        }
      }
      wrapUnwrapButton.value = "false";
      fromIcon.style.color = "#fd000f";
      toIcon.style.color = "#000";
      document.getElementById("Wrap").style.color = "#fd000f";
      document.getElementById("Unwrap").style.color = "#383a3b";
      WrapBool = true;
      if (Number(amountFrom.value) < 1 | !isNumber(amountFrom.value)) {
        document.getElementById("WrapButton").style.backgroundColor = "#8f8f8f";
        document.getElementById("WrapButton").style.cursor = "auto";
        document.getElementById("WrapButton").innerText = "Enter Amount";
        IsRealValue = false;
      } else {
        document.getElementById("WrapButton").style.backgroundColor = "#fd000f";
        document.getElementById("WrapButton").style.cursor = "pointer";
        IsRealValue = true;
        if (WrapBool == true) {
          document.getElementById("WrapButton").innerText = "Wrap";
        } else {
          document.getElementById("WrapButton").innerText = "Unwrap";
        }
      }
    }
  };
  if (!provider) {
    alert("MetaMask is not installed, please install it.");
  } else {
    console.log("isMetaMask=", provider.isMetaMask);
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
      if (ConnectWalletBool == false) {
        ConnectWalletBool = true;
        let web32 = new Web3(rpcUrl);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        try {
          const accounts = (await provider.send("eth_requestAccounts")).result;
          const account = accounts[0];
          showAccountAddress(account);
          const balance = await web32.eth.getBalance(account);
          showBalance(round(web32.utils.fromWei(balance, "ether")));
          const tokenBalance = await tokenContract.methods.balanceOf(account).call();
          showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
          const SmartContracts = await flareContract.methods.getAllContracts().call();
          console.log(`Account `, account, ` has `, balance, ` tokens, and `, tokenBalance, ` wrapped tokens.`);
          console.log(`Smart contract list: `, SmartContracts);
        } catch (error) {
          console.log(error);
        }
      } else {
        navigator.clipboard.writeText(document.getElementById("ConnectWallet").innerText);
        alert("Copied!");
      }
    });
    provider.on("accountsChanged", function(accounts, balance, tokenBalance) {
      console.log("accountsChanged", accounts, balance, tokenBalance);
      const account = accounts[0];
      showAccountAddress(account);
      showBalance(round(web3.utils.fromWei(balance, "ether")));
      showTokenBalance(round(web3.utils.fromWei(tokenBalance, "ether")));
    });
  }
  wrapUnwrapButton.addEventListener("click", async () => {
    switchIconColor();
  });
  document.querySelector("#AmountFrom").addEventListener("input", isInput);
  document.querySelector("#AmountFrom").addEventListener("input", copyInput);
  if (!provider) {
    alert("MetaMask is not installed, please install it.");
  } else {
    console.log("isMetaMask=", provider.isMetaMask);
    document.getElementById("WrapButton").addEventListener("click", async () => {
      if (!IsRealValue) {
        alert("Please enter valid value");
      } else {
        let web32 = new Web3(rpcUrl);
        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        if (WrapBool) {
          try {
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            const smartContracts = await flareContract.methods.getAllContracts().call();
            const contractList = smartContracts[1];
            let wnatAddr;
            let wnatAbi = wnat_flare_abi;
            if (rpcUrl == "https://flare-api.flare.network/ext/C/rpc") {
              wnatAddr = contractList[19];
            } else {
              wnatAddr = contractList[12];
            }
            let wnatContract = new web32.eth.Contract(wnatAbi, wnatAddr);
            if (Number(amountFrom.value) >= Number(web32.utils.fromWei(balance, "ether"))) {
              alert("Insufficient Balance!");
            } else {
              console.log(`Wrapping`, amountFrom.value, `tokens from account:`, account);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            const smartContracts = await flareContract.methods.getAllContracts().call();
            const contractList = smartContracts[1];
            let wnatAddr;
            let wnatAbi;
            if (rpcUrl == "https://flare-api.flare.network/ext/C/rpc") {
              wnatAddr = contractList[19];
              wnatAbi = wnat_flare_abi;
            } else {
              wnatAddr = contractList[12];
              wnatAbi = wnat_songbird_abi;
            }
            let wnatContract = new web32.eth.Contract(wnatAbi, wnatAddr);
            if (Number(amountFrom.value) >= Number(web32.utils.fromWei(tokenBalance, "ether"))) {
              alert("Insufficient Balance!");
            } else {
              console.log(`Unwrapping`, document.amountFrom.value, `tokens from the Blockchain`);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  }
})();
