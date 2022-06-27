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

document.querySelector('#myCopyCommand1Button').onclick = function() {
    copyClip('myCopyCommand1Button', '0x7C255e428e95bEbc76e944D49D4F460C84b3A3c3');
}
