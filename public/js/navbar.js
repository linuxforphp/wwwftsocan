window.onload = init;

  function init(){
    var acc = document.getElementById("delegate-dropdown");

    acc?.addEventListener("click", function(){
        this.classList.toggle("hover");
    })
  }