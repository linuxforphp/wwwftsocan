function copyClip(button, value) {
    var tempInput = document.createElement("input");
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    let copyButton = document.getElementById(button);
    copyButton.innerHTML = "Copied!";
}

document.querySelector('#myCopyCommandWFLRButton').onclick = function() {
    copyClip('myCopyCommandWFLRButton', '0x1D80c49BbBCd1C0911346656B529DF9E5c2F783d');
};

document.querySelector('#myCopyCommandWSGBButton').onclick = function() {
    copyClip('myCopyCommandWSGBButton', '0x02f0826ef6aD107Cfc861152B32B52fD11BaB9ED');
};