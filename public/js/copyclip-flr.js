function copyClip(button, value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    let copyButton = document.getElementById(button);
    copyButton.innerHTML = dappStrings['dapp_copied'];
}

document.querySelector('#myCopyCommand1Button').onclick = function() {
    copyClip('myCopyCommand1Button', '0x9e55a49D251324B1623dc2A81894D1AfBfB8bbdC');
};
