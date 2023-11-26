"use strict";
(() => {
  // dapp_wrap.js
  var sgbLogo = '<g id="layer1-3"><polygon points="124.29 316.35 0 538.51 101.68 508.22 124.29 316.35"></polygon><polygon points="259.45 315.45 135.35 299.46 119.98 431.6 300.07 320.69 259.45 315.45"></polygon><polygon points="195.58 206.32 233.21 158.92 40.08 0 133.09 285.06 195.58 206.32"></polygon><polygon points="363.82 188.11 343.46 245.8 383.66 282.19 363.82 188.11"></polygon><polygon points="263.6 221.16 263.6 221.16 238.46 166.78 215.95 195.14 139.88 290.97 265.69 307.18 305.76 312.35 263.6 221.16"></polygon><polygon points="357 180.39 273.62 221.37 312.7 305.92 357 180.39"></polygon></g>';
  var flrLogo = '<g id="layer1-2" transform="matrix(1.7,0,0,1.7,-0,120)"><path inkscape:connector-curvature="0" d="M 1.54,44.88 C 1.54,44.88 0,44.043066 0,43.309998 0,29.293727 13.305791,-2.1604174e-7 44.83,-2.1604171e-7 c 7.083657,1e-14 178,0 178,0 0,0 1.54998,0.83699994604171 1.54,1.57000021604171 -0.28292,20.783154 -17.20265,43.31 -44.86,43.31 -7.19693,0 -177.97,0 -177.97,0 z" id="path5842" /><path inkscape:connector-curvature="0" d="M -2.8370967e-7,133.36 C -0.01006008,134.093 1.5399997,134.93 1.5399997,134.93 c 0,0 73.8666673,0 110.8000003,0 25.5862,0 44.57708,-22.52684 44.86,-43.309998 0.01,-0.733001 -1.54,-1.570002 -1.54,-1.570002 0,0 -96.641983,0 -110.78,0 -25.4532,0 -44.5947035,22.52208 -44.88000028370967,43.31 z" id="path5840" /><path d="M 45.068739,202.56174 A 22.648399,22.301296 0 0 1 22.42034,224.86303 22.648399,22.301296 0 0 1 -0.22805977,202.56174 22.648399,22.301296 0 0 1 22.42034,180.26044 a 22.648399,22.301296 0 0 1 22.648399,22.3013 z" id="path5799" /></g>';
  var wrapUnwrapButton = document.getElementById("wrapUnwrap");
  var amountFrom = document.getElementById("AmountFrom");
  var amountTo = document.getElementById("AmountTo");
  var tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
  var wrappedTokenIdentifier = "W" + tokenIdentifier;
  var wrapBool = true;
  var isRealValue = false;
  var fromIcon = document.getElementById("FromIcon");
  var toIcon = document.getElementById("ToIcon");
  document.getElementById("layer2").innerHTML = flrLogo;
  document.getElementById("layer3").innerHTML = flrLogo;

// show the current token identifiers

  function showTokenIdentifiers(token, wrappedToken) {
    document.getElementById("tokenIdentifier").innerText = token;
    document.getElementById("wrappedTokenIdentifier").innerText = wrappedToken;
  }
  async function switchIconColor() {
    // Switching everything...

    if (wrapUnwrapButton.value == "false") {
      wrapBool = false;
      wrapUnwrapButton.value = "true";
      fromIcon.style.color = "#000";
      toIcon.style.color = "#fd000f";
      document.getElementById("Wrap").style.color = "#383a3b";
      document.getElementById("Unwrap").style.color = "#fd000f";
      showTokenIdentifiers(wrappedTokenIdentifier, tokenIdentifier);
      isInput();
    } else {
      wrapBool = true;
      wrapUnwrapButton.value = "false";
      fromIcon.style.color = "#fd000f";
      toIcon.style.color = "#000";
      document.getElementById("Wrap").style.color = "#fd000f";
      document.getElementById("Unwrap").style.color = "#383a3b";
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
      isInput();
    }
    if (connectWalletBool == true) {
      if (!provider) {
        alert("MetaMask is not installed, please install it.");
      } else {
        console.log(wrapBool)
        let web32 = new Web3(rpcUrl);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        try {
          const isUnlocked = isWalletUnlocked();
          if (await isUnlocked != "false") {
            const SmartContracts = await flareContract.methods.getAllContracts().call();
            const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
            const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
  
            let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();

            if (wrapBool == false) {
              showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
              showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } else {
              showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
              showBalance(round(web32.utils.fromWei(balance, "ether")));
            }
            console.log(`Account `, account, ` has `, balance, ` tokens, and `, tokenBalance, ` wrapped tokens.`);
          } else {
            alert("You are not connected!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  wrapUnwrapButton.addEventListener("click", async () => {
    switchIconColor();
  });

  //Functions to show the requested info
  function showBalance(balanceAddress) {
    document.getElementById("Balance").innerText = balanceAddress;
  }

  // Has the wallet already been unlocked?

  async function isWalletUnlocked() {
    
    var unlocked = provider._metamask.isUnlocked() 

    return unlocked;
  }

// is a valid input?


  function isInput() {
    if (Number(amountFrom.value.replace(/[^0-9]/g, '')) < 1) {
      document.getElementById("WrapButton").style.backgroundColor = "rgba(143, 143, 143, 0.8)";
      document.getElementById("WrapButton").style.cursor = "auto";
      document.getElementById("WrapButtonText").innerText = "Enter Amount";
      isRealValue = false;
    } else {
      document.getElementById("WrapButton").style.backgroundColor = "rgba(253, 0, 15, 0.8)";
      document.getElementById("WrapButton").style.cursor = "pointer";
      isRealValue = true;
      if (wrapBool == true) {
        document.getElementById("WrapButtonText").innerText = "Wrap";
      } else {
        document.getElementById("WrapButtonText").innerText = "Unwrap";
      }
    }
  }

// copy an input

  function copyInput() {
    if (isNumber(amountFrom.value)) {
      amountTo.value = amountFrom.value;
    } else {
      amountTo.value = "";
    }
  }

  // if network value is 1, FLR, if it is 2, SGB.
  function isNetworkValue(networkValue) {
    if (networkValue == 1 | networkValue == 4) {
      tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
      wrappedTokenIdentifier = "W" + tokenIdentifier;
      document.getElementById("layer2").innerHTML = flrLogo;
      document.getElementById("layer3").innerHTML = flrLogo;
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    } else {
      tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
      wrappedTokenIdentifier = "W" + tokenIdentifier;
      document.getElementById("layer2").innerHTML = sgbLogo;
      document.getElementById("layer3").innerHTML = sgbLogo;
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
    }
  }

  isNetworkValue(networkValue)
  
  showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
  isInput();

  //When Selected Network Changes, alert Metamask

  selectedNetwork.onchange = async () => {
    rpcUrl = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-rpcurl');
    chainidhex = selectedNetwork?.options[selectedNetwork.selectedIndex].getAttribute('data-chainidhex');
    networkValue = selectedNetwork?.options[selectedNetwork.selectedIndex].value;

    if (networkValue == 1 | networkValue == 4) {
      tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
      wrappedTokenIdentifier = "W" + tokenIdentifier;
      document.getElementById("layer2").innerHTML = flrLogo;
      document.getElementById("layer3").innerHTML = flrLogo;
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
      
      wrapUnwrapButton.value = "false";
      fromIcon.style.color = "#fd000f";
      toIcon.style.color = "#000";
      document.getElementById("Wrap").style.color = "#fd000f";
      document.getElementById("Unwrap").style.color = "#383a3b";
      wrapBool = true;
      isInput();
    } else {
      tokenIdentifier = selectedNetwork?.options[selectedNetwork.selectedIndex].innerHTML;
      wrappedTokenIdentifier = "W" + tokenIdentifier;
      document.getElementById("layer2").innerHTML = sgbLogo;
      document.getElementById("layer3").innerHTML = sgbLogo;
      showTokenIdentifiers(tokenIdentifier, wrappedTokenIdentifier);
      wrapUnwrapButton.value = "false";
      fromIcon.style.color = "#fd000f";
      toIcon.style.color = "#000";
      document.getElementById("Wrap").style.color = "#fd000f";
      document.getElementById("Unwrap").style.color = "#383a3b";
      wrapBool = true;
      isInput();
    }

    //Alert Metamask to switch

    if (!provider) {
      alert("MetaMask is not installed, please install it.");
    } else {
      console.log("isMetaMask=", provider.isMetaMask);
      let web32 = new Web3(rpcUrl);
      let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainidhex }],
        })
        const isUnlocked = isWalletUnlocked();
        if (await isUnlocked != "false") {
          const SmartContracts = await flareContract.methods.getAllContracts().call();
          const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
          const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
  
          let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
          const accounts = (await provider.send("eth_requestAccounts")).result;
          const account = accounts[0];
          showAccountAddress(account);
          const balance = await web32.eth.getBalance(account);
          const tokenBalance = await tokenContract.methods.balanceOf(account).call();
          if (wrapBool) {
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
          } else {
            showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    //If we have already logged in the account, show new results, else, do nothing

    if (connectWalletBool == true) {
      if (!provider) {
        alert("MetaMask is not installed, please install it.");
      } else {
        console.log("isMetaMask=", provider.isMetaMask);
        let web32 = new Web3(rpcUrl);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        try {
          const isUnlocked = isWalletUnlocked();
          if (await isUnlocked != "false") {
            const SmartContracts = await flareContract.methods.getAllContracts().call();
            const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
            const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
  
            let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);
            const accounts = (await provider.send("eth_requestAccounts")).result;
            const account = accounts[0];
            showAccountAddress(account);
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();
            if (wrapBool) {
              showBalance(round(web32.utils.fromWei(balance, "ether")));
              showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            } else {
              showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
              showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
            } 
          } else {
            alert("You are not connected!");
          }
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      return
    }
  };

  // When the Connect Wallet button is clicked, we connect the wallet (duh), and if it
  // has already been clicked, we copy the public address to the clipboard.

  if (!provider) {
    alert("MetaMask is not installed, please install it.");
  } else {
    console.log("isMetaMask=", provider.isMetaMask);
    document.getElementById("ConnectWallet").addEventListener("click", async () => {
      if (connectWalletBool == false) {
        connectWalletBool = true;
        let web32 = new Web3(rpcUrl);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        try {
          const SmartContracts = await flareContract.methods.getAllContracts().call();
          const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
          const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

          let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

          const accounts = (await provider.send("eth_requestAccounts")).result;
          const account = accounts[0];
          showAccountAddress(account);
          const balance = await web32.eth.getBalance(account);
          const tokenBalance = await tokenContract.methods.balanceOf(account).call();
          if (wrapBool) {
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
          } else {
            showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        navigator.clipboard.writeText(document.getElementById("ConnectWalletText").innerText);
        let web32 = new Web3(rpcUrl);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        try {
          const SmartContracts = await flareContract.methods.getAllContracts().call();
          const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
          const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

          let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

          const accounts = (await provider.send("eth_requestAccounts")).result;
          const account = accounts[0];
          showAccountAddress(account);
          const balance = await web32.eth.getBalance(account);
          const tokenBalance = await tokenContract.methods.balanceOf(account).call();
          if (wrapBool) {
            showBalance(round(web32.utils.fromWei(balance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
          } else {
            showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
            showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  provider.on("accountsChanged", async (accounts) => {
    console.log("accountsChanged");
    if (accounts.length != 0) {
      let web32 = new Web3(rpcUrl);
      let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
      try {
        const SmartContracts = await flareContract.methods.getAllContracts().call();
        const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
        const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];

        let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

        const account = accounts[0];
        showAccountAddress(account);
        const balance = await web32.eth.getBalance(account);
        const tokenBalance = await tokenContract.methods.balanceOf(account).call();
        if (wrapBool) {
          showBalance(round(web32.utils.fromWei(balance, "ether")));
          showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
        } else {
          showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
          showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      document.getElementById("ConnectWalletText").innerText = 'Connect Wallet'
      showBalance(0.0);
      showTokenBalance(0.0);
      connectWalletBool = false
    }
    
  });

  // we check if the input is valid, then copy it to the wrapped tokens section.

  document.querySelector("#AmountFrom").addEventListener("input", isInput);
  document.querySelector("#AmountFrom").addEventListener("input", copyInput);

  // If the input is valid, we wrap on click of "WrapButton"

  if (!provider) {
    alert("MetaMask is not installed, please install it.");
  } else {
    console.log("isMetaMask=", provider.isMetaMask);
    document.getElementById("WrapButton").addEventListener("click", async () => {
      if (!isRealValue) {
        alert("Please enter valid value");
      } else {
        let web32 = new Web3(rpcUrl);
        let flareContract = new web32.eth.Contract(flrAbi, flrAddr);
        if (wrapBool) {
          try {
            const SmartContracts = await flareContract.methods.getAllContracts().call();
            const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
            const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
  
            let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const balance = await web32.eth.getBalance(account);
            const tokenBalance = await tokenContract.methods.balanceOf(account).call();

            const amountFromValue = Number(amountFrom.value.replace(/[^0-9]/g, ''))

            const amountFromValueWei = Number(web32.utils.toWei(amountFromValue, "ether")).toString(16)

            if (amountFromValue >= Number(web32.utils.fromWei(balance, "ether"))) {
              alert("Insufficient Balance!");
            } else {
              console.log(`Wrapping`, amountFromValueWei, `tokens from account:`, account);

              const transactionParameters = {
                from: account,
                to: wrappedTokenAddr,
                data: tokenContract.methods.deposit(amountFromValueWei).encodeABI(),
                value: amountFromValueWei
              };

              await provider.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
              });

              balance = await web32.eth.getBalance(account);
              tokenBalance = await tokenContract.methods.balanceOf(account).call();
              if (wrapBool) {
                showBalance(round(web32.utils.fromWei(balance, "ether")));
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
              } else {
                showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
              }
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            const SmartContracts = await flareContract.methods.getAllContracts().call();
            const wrappedTokenIndex = getKeyByValue(Object.values(SmartContracts)[0],"WNat");
            const wrappedTokenAddr = SmartContracts[1][wrappedTokenIndex];
  
            let tokenContract = new web32.eth.Contract(ercAbi, wrappedTokenAddr);

            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            let balance = await web32.eth.getBalance(account);
            let tokenBalance = await tokenContract.methods.balanceOf(account).call();

            const amountFromValue = Number(amountFrom.value.replace(/[^0-9]/g, ''))

            const amountFromValueWei = Number(web32.utils.toWei(amountFromValue, "ether")).toString(16)
            if (amountFromValue >= Number(web32.utils.fromWei(tokenBalance, "ether"))) {
              alert("Insufficient Balance!");
            } else {
              console.log(`Unwrapping`, amountFromValueWei, `tokens from the Blockchain`);

              const transactionParameters = {
                from: account,
                to: wrappedTokenAddr,
                data: tokenContract.methods.receive(amountFromValueWei).encodeABI(),
                value: amountFromValueWei,
              };

              await provider.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
              })
              
              balance = await web32.eth.getBalance(account);
              tokenBalance = await tokenContract.methods.balanceOf(account).call();
              if (wrapBool) {
                showBalance(round(web32.utils.fromWei(balance, "ether")));
                showTokenBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
              } else {
                showBalance(round(web32.utils.fromWei(tokenBalance, "ether")));
                showTokenBalance(round(web32.utils.fromWei(balance, "ether")));
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    });
  }
})();
