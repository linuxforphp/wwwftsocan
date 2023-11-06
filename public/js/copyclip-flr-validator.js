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

document.querySelector('#myCopyCommandVNodeButton').onclick = function() {
    copyClip('myCopyCommandVNodeButton', 'KzPd2Vx5WomGtur91B9K9R7to3mYyYga');
};
