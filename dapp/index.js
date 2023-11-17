import React from "../public/js/react.js";
import ReactDOM from "../public/js/react-dom.development.js";

import { Dapp } from "./Dapp.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
const button = document.getElementByClassName("ConnectWallet")

document.addEventListener(click, Render, false ) 

function Render() {

    root.render(
        <React.StrictMode>
         <Dapp />
        </React.StrictMode>
    );
}