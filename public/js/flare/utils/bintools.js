"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Utils-BinTools
 */
const bn_js_1 = __importDefault(require("bn.js"));
const buffer_1 = require("buffer/");
const create_hash_1 = __importDefault(require("create-hash"));
const bech32 = __importStar(require("bech32"));
const base58_1 = require("./base58");
const errors_1 = require("../utils/errors");
const ethers_1 = require("ethers");
/**
 * A class containing tools useful in interacting with binary data cross-platform using
 * nodejs & javascript.
 *
 * This class should never be instantiated directly. Instead,
 * invoke the "BinTools.getInstance()" static * function to grab the singleton
 * instance of the tools.
 *
 * Everything in this library uses
 * the {@link https://github.com/feross/buffer|feross's Buffer class}.
 *
 * ```js
 * const bintools: BinTools = BinTools.getInstance();
 * const b58str:  = bintools.bufferToB58(Buffer.from("Wubalubadubdub!"));
 * ```
 */
class BinTools {
    constructor() {
        /**
         * Returns true if meets requirements to parse as an address as Bech32 on X-Chain or P-Chain, otherwise false
         * @param address the string to verify is address
         */
        this.isPrimaryBechAddress = (address) => {
            const parts = address.trim().split("-");
            if (parts.length !== 2) {
                return false;
            }
            try {
                bech32.bech32.fromWords(bech32.bech32.decode(parts[1]).words);
            }
            catch (err) {
                return false;
            }
            return true;
        };
        /**
         * Produces a string from a {@link https://github.com/feross/buffer|Buffer}
         * representing a string. ONLY USED IN TRANSACTION FORMATTING, ASSUMED LENGTH IS PREPENDED.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert to a string
         */
        this.bufferToString = (buff) => this.copyFrom(buff, 2).toString("utf8");
        /**
         * Produces a {@link https://github.com/feross/buffer|Buffer} from a string. ONLY USED IN TRANSACTION FORMATTING, LENGTH IS PREPENDED.
         *
         * @param str The string to convert to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.stringToBuffer = (str) => {
            const buff = buffer_1.Buffer.alloc(2 + str.length);
            buff.writeUInt16BE(str.length, 0);
            buff.write(str, 2, str.length, "utf8");
            return buff;
        };
        /**
         * Makes a copy (no reference) of a {@link https://github.com/feross/buffer|Buffer}
         * over provided indecies.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to copy
         * @param start The index to start the copy
         * @param end The index to end the copy
         */
        this.copyFrom = (buff, start = 0, end = undefined) => {
            if (end === undefined) {
                end = buff.length;
            }
            return buffer_1.Buffer.from(Uint8Array.prototype.slice.call(buff.slice(start, end)));
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns a base-58 string of
         * the {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert to base-58
         */
        this.bufferToB58 = (buff) => this.b58.encode(buff);
        /**
         * Takes a base-58 string and returns a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param b58str The base-58 string to convert
         * to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.b58ToBuffer = (b58str) => this.b58.decode(b58str);
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns an ArrayBuffer.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to
         * convert to an ArrayBuffer
         */
        this.fromBufferToArrayBuffer = (buff) => {
            const ab = new ArrayBuffer(buff.length);
            const view = new Uint8Array(ab);
            for (let i = 0; i < buff.length; ++i) {
                view[`${i}`] = buff[`${i}`];
            }
            return view;
        };
        /**
         * Takes an ArrayBuffer and converts it to a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param ab The ArrayBuffer to convert to a {@link https://github.com/feross/buffer|Buffer}
         */
        this.fromArrayBufferToBuffer = (ab) => {
            const buf = buffer_1.Buffer.alloc(ab.byteLength);
            for (let i = 0; i < ab.byteLength; ++i) {
                buf[`${i}`] = ab[`${i}`];
            }
            return buf;
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and converts it
         * to a {@link https://github.com/indutny/bn.js/|BN}.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to convert
         * to a {@link https://github.com/indutny/bn.js/|BN}
         */
        this.fromBufferToBN = (buff) => {
            if (typeof buff === "undefined") {
                return undefined;
            }
            return new bn_js_1.default(buff.toString("hex"), 16, "be");
        };
        /**
         * Takes a {@link https://github.com/indutny/bn.js/|BN} and converts it
         * to a {@link https://github.com/feross/buffer|Buffer}.
         *
         * @param bn The {@link https://github.com/indutny/bn.js/|BN} to convert
         * to a {@link https://github.com/feross/buffer|Buffer}
         * @param length The zero-padded length of the {@link https://github.com/feross/buffer|Buffer}
         */
        this.fromBNToBuffer = (bn, length) => {
            if (typeof bn === "undefined") {
                return undefined;
            }
            const newarr = bn.toArray("be");
            /**
             * CKC: Still unsure why bn.toArray with a "be" and a length do not work right. Bug?
             */
            if (length) {
                // bn toArray with the length parameter doesn't work correctly, need this.
                const x = length - newarr.length;
                for (let i = 0; i < x; i++) {
                    newarr.unshift(0);
                }
            }
            return buffer_1.Buffer.from(newarr);
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and adds a checksum, returning
         * a {@link https://github.com/feross/buffer|Buffer} with the 4-byte checksum appended.
         *
         * @param buff The {@link https://github.com/feross/buffer|Buffer} to append a checksum
         */
        this.addChecksum = (buff) => {
            const hashslice = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(buff).digest().slice(28));
            return buffer_1.Buffer.concat([buff, hashslice]);
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} with an appended 4-byte checksum
         * and returns true if the checksum is valid, otherwise false.
         *
         * @param b The {@link https://github.com/feross/buffer|Buffer} to validate the checksum
         */
        this.validateChecksum = (buff) => {
            const checkslice = buff.slice(buff.length - 4);
            const hashslice = buffer_1.Buffer.from((0, create_hash_1.default)("sha256")
                .update(buff.slice(0, buff.length - 4))
                .digest()
                .slice(28));
            return checkslice.toString("hex") === hashslice.toString("hex");
        };
        /**
         * Takes a {@link https://github.com/feross/buffer|Buffer} and returns a base-58 string with
         * checksum as per the cb58 standard.
         *
         * @param bytes A {@link https://github.com/feross/buffer|Buffer} to serialize
         *
         * @returns A serialized base-58 string of the Buffer.
         */
        this.cb58Encode = (bytes) => {
            const x = this.addChecksum(bytes);
            return this.bufferToB58(x);
        };
        /**
         * Takes a cb58 serialized {@link https://github.com/feross/buffer|Buffer} or base-58 string
         * and returns a {@link https://github.com/feross/buffer|Buffer} of the original data. Throws on error.
         *
         * @param bytes A cb58 serialized {@link https://github.com/feross/buffer|Buffer} or base-58 string
         */
        this.cb58Decode = (bytes) => {
            if (typeof bytes === "string") {
                bytes = this.b58ToBuffer(bytes);
            }
            if (this.validateChecksum(bytes)) {
                return this.copyFrom(bytes, 0, bytes.length - 4);
            }
            throw new errors_1.ChecksumError("Error - BinTools.cb58Decode: invalid checksum");
        };
        this.cb58DecodeWithChecksum = (bytes) => {
            if (typeof bytes === "string") {
                bytes = this.b58ToBuffer(bytes);
            }
            if (this.validateChecksum(bytes)) {
                return `0x${this.copyFrom(bytes, 0, bytes.length).toString("hex")}`;
            }
            throw new errors_1.ChecksumError("Error - BinTools.cb58Decode: invalid checksum");
        };
        this.addressToString = (hrp, chainid, bytes) => `${chainid}-${bech32.bech32.encode(hrp, bech32.bech32.toWords(bytes))}`;
        this.stringToAddress = (address, hrp) => {
            if (address.substring(0, 2) === "0x") {
                // ETH-style address
                if (ethers_1.utils.isAddress(address)) {
                    return buffer_1.Buffer.from(address.substring(2), "hex");
                }
                else {
                    throw new errors_1.HexError("Error - Invalid address");
                }
            }
            // Bech32 addresses
            const parts = address.trim().split("-");
            if (parts.length < 2) {
                throw new errors_1.Bech32Error("Error - Valid address should include -");
            }
            if (parts[0].length < 1) {
                throw new errors_1.Bech32Error("Error - Valid address must have prefix before -");
            }
            const split = parts[1].lastIndexOf("1");
            if (split < 0) {
                throw new errors_1.Bech32Error("Error - Valid address must include separator (1)");
            }
            const humanReadablePart = parts[1].slice(0, split);
            if (humanReadablePart.length < 1) {
                throw new errors_1.Bech32Error("Error - HRP should be at least 1 character");
            }
            if (humanReadablePart !== "avax" &&
                humanReadablePart !== "fuji" &&
                humanReadablePart != "local" &&
                humanReadablePart != "custom" &&
                humanReadablePart != "localflare" &&
                humanReadablePart != "flare" &&
                humanReadablePart != "costwo" &&
                humanReadablePart != hrp) {
                throw new errors_1.Bech32Error("Error - Invalid HRP");
            }
            return buffer_1.Buffer.from(bech32.bech32.fromWords(bech32.bech32.decode(parts[1]).words));
        };
        /**
         * Takes an address and returns its {@link https://github.com/feross/buffer|Buffer}
         * representation if valid. A more strict version of stringToAddress.
         *
         * @param addr A string representation of the address
         * @param blockchainID A cb58 encoded string representation of the blockchainID
         * @param alias A chainID alias, if any, that the address can also parse from.
         * @param addrlen VMs can use any addressing scheme that they like, so this is the appropriate number of address bytes. Default 20.
         *
         * @returns A {@link https://github.com/feross/buffer|Buffer} for the address if valid,
         * undefined if not valid.
         */
        this.parseAddress = (addr, blockchainID, alias = undefined, addrlen = 20) => {
            const abc = addr.split("-");
            if (abc.length === 2 &&
                ((alias && abc[0] === alias) || (blockchainID && abc[0] === blockchainID))) {
                const addrbuff = this.stringToAddress(addr);
                if ((addrlen && addrbuff.length === addrlen) || !addrlen) {
                    return addrbuff;
                }
            }
            return undefined;
        };
        this.b58 = base58_1.Base58.getInstance();
    }
    /**
     * Retrieves the BinTools singleton.
     */
    static getInstance() {
        if (!BinTools.instance) {
            BinTools.instance = new BinTools();
        }
        return BinTools.instance;
    }
    /**
     * Returns true if base64, otherwise false
     * @param str the string to verify is Base64
     */
    isBase64(str) {
        if (str === "" || str.trim() === "") {
            return false;
        }
        try {
            let b64 = buffer_1.Buffer.from(str, "base64");
            return b64.toString("base64") === str;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns true if cb58, otherwise false
     * @param cb58 the string to verify is cb58
     */
    isCB58(cb58) {
        return this.isBase58(cb58);
    }
    /**
     * Returns true if base58, otherwise false
     * @param base58 the string to verify is base58
     */
    isBase58(base58) {
        if (base58 === "" || base58.trim() === "") {
            return false;
        }
        try {
            return this.b58.encode(this.b58.decode(base58)) === base58;
        }
        catch (err) {
            return false;
        }
    }
    /**
     * Returns true if hexidecimal, otherwise false
     * @param hex the string to verify is hexidecimal
     */
    isHex(hex) {
        if (hex === "" || hex.trim() === "") {
            return false;
        }
        const startsWith0x = hex.startsWith("0x");
        const matchResult = startsWith0x
            ? hex.slice(2).match(/[0-9A-Fa-f]/g)
            : hex.match(/[0-9A-Fa-f]/g);
        if ((startsWith0x && hex.length - 2 == matchResult.length) ||
            hex.length == matchResult.length) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Returns true if decimal, otherwise false
     * @param str the string to verify is hexidecimal
     */
    isDecimal(str) {
        if (str === "" || str.trim() === "") {
            return false;
        }
        try {
            return new bn_js_1.default(str, 10).toString(10) === str.trim();
        }
        catch (err) {
            return false;
        }
    }
}
exports.default = BinTools;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmludG9vbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvYmludG9vbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7R0FHRztBQUNILGtEQUFzQjtBQUN0QixvQ0FBZ0M7QUFDaEMsOERBQW9DO0FBQ3BDLCtDQUFnQztBQUNoQyxxQ0FBaUM7QUFDakMsNENBQXNFO0FBQ3RFLG1DQUE4QjtBQUU5Qjs7Ozs7Ozs7Ozs7Ozs7O0dBZUc7QUFDSCxNQUFxQixRQUFRO0lBRzNCO1FBNEZBOzs7V0FHRztRQUNILHlCQUFvQixHQUFHLENBQUMsT0FBZSxFQUFXLEVBQUU7WUFDbEQsTUFBTSxLQUFLLEdBQWEsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNqRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN0QixPQUFPLEtBQUssQ0FBQTthQUNiO1lBQ0QsSUFBSTtnQkFDRixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUM5RDtZQUFDLE9BQU8sR0FBRyxFQUFFO2dCQUNaLE9BQU8sS0FBSyxDQUFBO2FBQ2I7WUFDRCxPQUFPLElBQUksQ0FBQTtRQUNiLENBQUMsQ0FBQTtRQUVEOzs7OztXQUtHO1FBQ0gsbUJBQWMsR0FBRyxDQUFDLElBQVksRUFBVSxFQUFFLENBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUV6Qzs7OztXQUlHO1FBQ0gsbUJBQWMsR0FBRyxDQUFDLEdBQVcsRUFBVSxFQUFFO1lBQ3ZDLE1BQU0sSUFBSSxHQUFXLGVBQU0sQ0FBQyxL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QUUsS0FBSyxFQUFFLEVBQUU7WUFDbkMsT0FBTyxLQUFLLENBQUE7U0FDYjtRQUNELElBQUk7WUFDRixPQUFPLElBQUksZUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO1NBQ25EO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLEtBQUssQ0FBQTtTQUNiO0lBQ0gsQ0FBQztDQW9TRjtBQWpZRCwyQkFpWUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICogQG1vZHVsZSBVdGlscy1CaW5Ub29sc1xuICovXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCBjcmVhdGVIYXNoIGZyb20gXCJjcmVhdGUtaGFzaFwiXG5pbXBvcnQgKiBhcyBiZWNoMzIgZnJvbSBcImJlY2gzMlwiXG5pbXBvcnQgeyBCYXNlNTggfSBmcm9tIFwiLi9iYXNlNThcIlxuaW1wb3J0IHsgQmVjaDMyRXJyb3IsIENoZWNrc3VtRXJyb3IsIEhleEVycm9yIH0gZnJvbSBcIi4uL3V0aWxzL2Vycm9yc1wiXG5pbXBvcnQgeyB1dGlscyB9IGZyb20gXCJldGhlcnNcIlxuXG4vKipcbiAqIEEgY2xhc3MgY29udGFpbmluZyB0b29scyB1c2VmdWwgaW4gaW50ZXJhY3Rpbmcgd2l0aCBiaW5hcnkgZGF0YSBjcm9zcy1wbGF0Zm9ybSB1c2luZ1xuICogbm9kZWpzICYgamF2YXNjcmlwdC5cbiAqXG4gKiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgZGlyZWN0bHkuIEluc3RlYWQsXG4gKiBpbnZva2UgdGhlIFwiQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVwiIHN0YXRpYyAqIGZ1bmN0aW9uIHRvIGdyYWIgdGhlIHNpbmdsZXRvblxuICogaW5zdGFuY2Ugb2YgdGhlIHRvb2xzLlxuICpcbiAqIEV2ZXJ5dGhpbmcgaW4gdGhpcyBsaWJyYXJ5IHVzZXNcbiAqIHRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8ZmVyb3NzJ3MgQnVmZmVyIGNsYXNzfS5cbiAqXG4gKiBgYGBqc1xuICogY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKTtcbiAqIGNvbnN0IGI1OHN0cjogID0gYmludG9vbHMuYnVmZmVyVG9CNTgoQnVmZmVyLmZyb20oXCJXdWJhbHViYWR1YmR1YiFcIikpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpblRvb2xzIHtcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2U6IEJpblRvb2xzXG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmI1OCA9IEJhc2U1OC5nZXRJbnN0YW5jZSgpXG4gIH1cblxuICBwcml2YXRlIGI1ODogQmFzZTU4XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlcyB0aGUgQmluVG9vbHMgc2luZ2xldG9uLlxuICAgKi9cbiAgc3RhdGljIGdldEluc3RhbmNlKCk6IEJpblRvb2xzIHtcbiAgICBpZiAoIUJpblRvb2xzLmluc3RhbmNlKSB7XG4gICAgICBCaW5Ub29scy5pbnN0YW5jZSA9IG5ldyBCaW5Ub29scygpXG4gICAgfVxuICAgIHJldHVybiBCaW5Ub29scy5pbnN0YW5jZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBiYXNlNjQsIG90aGVyd2lzZSBmYWxzZVxuICAgKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIEJhc2U2NFxuICAgKi9cbiAgaXNCYXNlNjQoc3RyOiBzdHJpbmcpIHtcbiAgICBpZiAoc3RyID09PSBcIlwiIHx8IHN0ci50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgbGV0IGI2NDogQnVmZmVyID0gQnVmZmVyLmZyb20oc3RyLCBcImJhc2U2NFwiKVxuICAgICAgcmV0dXJuIGI2NC50b1N0cmluZyhcImJhc2U2NFwiKSA9PT0gc3RyXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGNiNTgsIG90aGVyd2lzZSBmYWxzZVxuICAgKiBAcGFyYW0gY2I1OCB0aGUgc3RyaW5nIHRvIHZlcmlmeSBpcyBjYjU4XG4gICAqL1xuICBpc0NCNTgoY2I1ODogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNCYXNlNTgoY2I1OClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYmFzZTU4LCBvdGhlcndpc2UgZmFsc2VcbiAgICogQHBhcmFtIGJhc2U1OCB0aGUgc3RyaW5nIHRvIHZlcmlmeSBpcyBiYXNlNThcbiAgICovXG4gIGlzQmFzZTU4KGJhc2U1ODogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKGJhc2U1OCA9PT0gXCJcIiB8fCBiYXNlNTgudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLmI1OC5lbmNvZGUodGhpcy5iNTguZGVjb2RlKGJhc2U1OCkpID09PSBiYXNlNThcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgaGV4aWRlY2ltYWwsIG90aGVyd2lzZSBmYWxzZVxuICAgKiBAcGFyYW0gaGV4IHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGhleGlkZWNpbWFsXG4gICAqL1xuICBpc0hleChoZXg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmIChoZXggPT09IFwiXCIgfHwgaGV4LnRyaW0oKSA9PT0gXCJcIikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IHN0YXJ0c1dpdGgweCA9IGhleC5zdGFydHNXaXRoKFwiMHhcIilcbiAgICBjb25zdCBtYXRjaFJlc3VsdCA9IHN0YXJ0c1dpdGgweFxuICAgICAgPyBoZXguc2xpY2UoMikubWF0Y2goL1swLTlBLUZhLWZdL2cpXG4gICAgICA6IGhleC5tYXRjaCgvWzAtOUEtRmEtZl0vZylcbiAgICBpZiAoXG4gICAgICAoc3RhcnRzV2l0aDB4ICYmIGhleC5sZW5ndGggLSAyID09IG1hdGNoUmVzdWx0Lmxlbmd0aCkgfHxcbiAgICAgIGhleC5sZW5ndGggPT0gbWF0Y2hSZXN1bHQubGVuZ3RoXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGRlY2ltYWwsIG90aGVyd2lzZSBmYWxzZVxuICAgKiBAcGFyYW0gc3RyIHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGhleGlkZWNpbWFsXG4gICAqL1xuICBpc0RlY2ltYWwoc3RyOiBzdHJpbmcpIHtcbiAgICBpZiAoc3RyID09PSBcIlwiIHx8IHN0ci50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIG5ldyBCTihzdHIsIDEwKS50b1N0cmluZygxMCkgPT09IHN0ci50cmltKClcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgbWVldHMgcmVxdWlyZW1lbnRzIHRvIHBhcnNlIGFzIGFuIGFkZHJlc3MgYXMgQmVjaDMyIG9uIFgtQ2hhaW4gb3IgUC1DaGFpbiwgb3RoZXJ3aXNlIGZhbHNlXG4gICAqIEBwYXJhbSBhZGRyZXNzIHRoZSBzdHJpbmcgdG8gdmVyaWZ5IGlzIGFkZHJlc3NcbiAgICovXG4gIGlzUHJpbWFyeUJlY2hBZGRyZXNzID0gKGFkZHJlc3M6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAgIGNvbnN0IHBhcnRzOiBzdHJpbmdbXSA9IGFkZHJlc3MudHJpbSgpLnNwbGl0KFwiLVwiKVxuICAgIGlmIChwYXJ0cy5sZW5ndGggIT09IDIpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0cnkge1xuICAgICAgYmVjaDMyLmJlY2gzMi5mcm9tV29yZHMoYmVjaDMyLmJlY2gzMi5kZWNvZGUocGFydHNbMV0pLndvcmRzKVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZXMgYSBzdHJpbmcgZnJvbSBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XG4gICAqIHJlcHJlc2VudGluZyBhIHN0cmluZy4gT05MWSBVU0VEIElOIFRSQU5TQUNUSU9OIEZPUk1BVFRJTkcsIEFTU1VNRUQgTEVOR1RIIElTIFBSRVBFTkRFRC5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvbnZlcnQgdG8gYSBzdHJpbmdcbiAgICovXG4gIGJ1ZmZlclRvU3RyaW5nID0gKGJ1ZmY6IEJ1ZmZlcik6IHN0cmluZyA9PlxuICAgIHRoaXMuY29weUZyb20oYnVmZiwgMikudG9TdHJpbmcoXCJ1dGY4XCIpXG5cbiAgLyoqXG4gICAqIFByb2R1Y2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZnJvbSBhIHN0cmluZy4gT05MWSBVU0VEIElOIFRSQU5TQUNUSU9OIEZPUk1BVFRJTkcsIExFTkdUSCBJUyBQUkVQRU5ERUQuXG4gICAqXG4gICAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyB0byBjb252ZXJ0IHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cbiAgICovXG4gIHN0cmluZ1RvQnVmZmVyID0gKHN0cjogc3RyaW5nKTogQnVmZmVyID0+IHtcbiAgICBjb25zdCBidWZmOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMiArIHN0ci5sZW5ndGgpXG4gICAgYnVmZi53cml0ZVVJbnQxNkJFKHN0ci5sZW5ndGgsIDApXG4gICAgYnVmZi53cml0ZShzdHIsIDIsIHN0ci5sZW5ndGgsIFwidXRmOFwiKVxuICAgIHJldHVybiBidWZmXG4gIH1cblxuICAvKipcbiAgICogTWFrZXMgYSBjb3B5IChubyByZWZlcmVuY2UpIG9mIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cbiAgICogb3ZlciBwcm92aWRlZCBpbmRlY2llcy5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvcHlcbiAgICogQHBhcmFtIHN0YXJ0IFRoZSBpbmRleCB0byBzdGFydCB0aGUgY29weVxuICAgKiBAcGFyYW0gZW5kIFRoZSBpbmRleCB0byBlbmQgdGhlIGNvcHlcbiAgICovXG4gIGNvcHlGcm9tID0gKFxuICAgIGJ1ZmY6IEJ1ZmZlcixcbiAgICBzdGFydDogbnVtYmVyID0gMCxcbiAgICBlbmQ6IG51bWJlciA9IHVuZGVmaW5lZFxuICApOiBCdWZmZXIgPT4ge1xuICAgIGlmIChlbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW5kID0gYnVmZi5sZW5ndGhcbiAgICB9XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKFVpbnQ4QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYnVmZi5zbGljZShzdGFydCwgZW5kKSkpXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBhbmQgcmV0dXJucyBhIGJhc2UtNTggc3RyaW5nIG9mXG4gICAqIHRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfS5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIGNvbnZlcnQgdG8gYmFzZS01OFxuICAgKi9cbiAgYnVmZmVyVG9CNTggPSAoYnVmZjogQnVmZmVyKTogc3RyaW5nID0+IHRoaXMuYjU4LmVuY29kZShidWZmKVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIGJhc2UtNTggc3RyaW5nIGFuZCByZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0uXG4gICAqXG4gICAqIEBwYXJhbSBiNThzdHIgVGhlIGJhc2UtNTggc3RyaW5nIHRvIGNvbnZlcnRcbiAgICogdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKi9cbiAgYjU4VG9CdWZmZXIgPSAoYjU4c3RyOiBzdHJpbmcpOiBCdWZmZXIgPT4gdGhpcy5iNTguZGVjb2RlKGI1OHN0cilcblxuICAvKipcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBhbmQgcmV0dXJucyBhbiBBcnJheUJ1ZmZlci5cbiAgICpcbiAgICogQHBhcmFtIGJ1ZmYgVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvXG4gICAqIGNvbnZlcnQgdG8gYW4gQXJyYXlCdWZmZXJcbiAgICovXG4gIGZyb21CdWZmZXJUb0FycmF5QnVmZmVyID0gKGJ1ZmY6IEJ1ZmZlcik6IEFycmF5QnVmZmVyID0+IHtcbiAgICBjb25zdCBhYiA9IG5ldyBBcnJheUJ1ZmZlcihidWZmLmxlbmd0aClcbiAgICBjb25zdCB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYWIpXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGJ1ZmYubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZpZXdbYCR7aX1gXSA9IGJ1ZmZbYCR7aX1gXVxuICAgIH1cbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIEFycmF5QnVmZmVyIGFuZCBjb252ZXJ0cyBpdCB0byBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxuICAgKlxuICAgKiBAcGFyYW0gYWIgVGhlIEFycmF5QnVmZmVyIHRvIGNvbnZlcnQgdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKi9cbiAgZnJvbUFycmF5QnVmZmVyVG9CdWZmZXIgPSAoYWI6IEFycmF5QnVmZmVyKTogQnVmZmVyID0+IHtcbiAgICBjb25zdCBidWYgPSBCdWZmZXIuYWxsb2MoYWIuYnl0ZUxlbmd0aClcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgYWIuYnl0ZUxlbmd0aDsgKytpKSB7XG4gICAgICBidWZbYCR7aX1gXSA9IGFiW2Ake2l9YF1cbiAgICB9XG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gYW5kIGNvbnZlcnRzIGl0XG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn0uXG4gICAqXG4gICAqIEBwYXJhbSBidWZmIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byBjb252ZXJ0XG4gICAqIHRvIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9pbmR1dG55L2JuLmpzL3xCTn1cbiAgICovXG4gIGZyb21CdWZmZXJUb0JOID0gKGJ1ZmY6IEJ1ZmZlcik6IEJOID0+IHtcbiAgICBpZiAodHlwZW9mIGJ1ZmYgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWRcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBCTihidWZmLnRvU3RyaW5nKFwiaGV4XCIpLCAxNiwgXCJiZVwiKVxuICB9XG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IGFuZCBjb252ZXJ0cyBpdFxuICAgKiB0byBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxuICAgKlxuICAgKiBAcGFyYW0gYm4gVGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vaW5kdXRueS9ibi5qcy98Qk59IHRvIGNvbnZlcnRcbiAgICogdG8gYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfVxuICAgKiBAcGFyYW0gbGVuZ3RoIFRoZSB6ZXJvLXBhZGRlZCBsZW5ndGggb2YgdGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XG4gICAqL1xuICBmcm9tQk5Ub0J1ZmZlciA9IChibjogQk4sIGxlbmd0aD86IG51bWJlcik6IEJ1ZmZlciA9PiB7XG4gICAgaWYgKHR5cGVvZiBibiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZFxuICAgIH1cbiAgICBjb25zdCBuZXdhcnIgPSBibi50b0FycmF5KFwiYmVcIilcbiAgICAvKipcbiAgICAgKiBDS0M6IFN0aWxsIHVuc3VyZSB3aHkgYm4udG9BcnJheSB3aXRoIGEgXCJiZVwiIGFuZCBhIGxlbmd0aCBkbyBub3Qgd29yayByaWdodC4gQnVnP1xuICAgICAqL1xuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgIC8vIGJuIHRvQXJyYXkgd2l0aCB0aGUgbGVuZ3RoIHBhcmFtZXRlciBkb2Vzbid0IHdvcmsgY29ycmVjdGx5LCBuZWVkIHRoaXMuXG4gICAgICBjb25zdCB4ID0gbGVuZ3RoIC0gbmV3YXJyLmxlbmd0aFxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHg7IGkrKykge1xuICAgICAgICBuZXdhcnIudW5zaGlmdCgwKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQnVmZmVyLmZyb20obmV3YXJyKVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gYW5kIGFkZHMgYSBjaGVja3N1bSwgcmV0dXJuaW5nXG4gICAqIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gd2l0aCB0aGUgNC1ieXRlIGNoZWNrc3VtIGFwcGVuZGVkLlxuICAgKlxuICAgKiBAcGFyYW0gYnVmZiBUaGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gdG8gYXBwZW5kIGEgY2hlY2tzdW1cbiAgICovXG4gIGFkZENoZWNrc3VtID0gKGJ1ZmY6IEJ1ZmZlcik6IEJ1ZmZlciA9PiB7XG4gICAgY29uc3QgaGFzaHNsaWNlOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIikudXBkYXRlKGJ1ZmYpLmRpZ2VzdCgpLnNsaWNlKDI4KVxuICAgIClcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChbYnVmZiwgaGFzaHNsaWNlXSlcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHdpdGggYW4gYXBwZW5kZWQgNC1ieXRlIGNoZWNrc3VtXG4gICAqIGFuZCByZXR1cm5zIHRydWUgaWYgdGhlIGNoZWNrc3VtIGlzIHZhbGlkLCBvdGhlcndpc2UgZmFsc2UuXG4gICAqXG4gICAqIEBwYXJhbSBiIFRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSB0byB2YWxpZGF0ZSB0aGUgY2hlY2tzdW1cbiAgICovXG4gIHZhbGlkYXRlQ2hlY2tzdW0gPSAoYnVmZjogQnVmZmVyKTogYm9vbGVhbiA9PiB7XG4gICAgY29uc3QgY2hlY2tzbGljZTogQnVmZmVyID0gYnVmZi5zbGljZShidWZmLmxlbmd0aCAtIDQpXG4gICAgY29uc3QgaGFzaHNsaWNlOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShcbiAgICAgIGNyZWF0ZUhhc2goXCJzaGEyNTZcIilcbiAgICAgICAgLnVwZGF0ZShidWZmLnNsaWNlKDAsIGJ1ZmYubGVuZ3RoIC0gNCkpXG4gICAgICAgIC5kaWdlc3QoKVxuICAgICAgICAuc2xpY2UoMjgpXG4gICAgKVxuICAgIHJldHVybiBjaGVja3NsaWNlLnRvU3RyaW5nKFwiaGV4XCIpID09PSBoYXNoc2xpY2UudG9TdHJpbmcoXCJoZXhcIilcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGFuZCByZXR1cm5zIGEgYmFzZS01OCBzdHJpbmcgd2l0aFxuICAgKiBjaGVja3N1bSBhcyBwZXIgdGhlIGNiNTggc3RhbmRhcmQuXG4gICAqXG4gICAqIEBwYXJhbSBieXRlcyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHRvIHNlcmlhbGl6ZVxuICAgKlxuICAgKiBAcmV0dXJucyBBIHNlcmlhbGl6ZWQgYmFzZS01OCBzdHJpbmcgb2YgdGhlIEJ1ZmZlci5cbiAgICovXG4gIGNiNThFbmNvZGUgPSAoYnl0ZXM6IEJ1ZmZlcik6IHN0cmluZyA9PiB7XG4gICAgY29uc3QgeDogQnVmZmVyID0gdGhpcy5hZGRDaGVja3N1bShieXRlcylcbiAgICByZXR1cm4gdGhpcy5idWZmZXJUb0I1OCh4KVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgY2I1OCBzZXJpYWxpemVkIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGJhc2UtNTggc3RyaW5nXG4gICAqIGFuZCByZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb2YgdGhlIG9yaWdpbmFsIGRhdGEuIFRocm93cyBvbiBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIGJ5dGVzIEEgY2I1OCBzZXJpYWxpemVkIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IG9yIGJhc2UtNTggc3RyaW5nXG4gICAqL1xuICBjYjU4RGVjb2RlID0gKGJ5dGVzOiBCdWZmZXIgfCBzdHJpbmcpOiBCdWZmZXIgPT4ge1xuICAgIGlmICh0eXBlb2YgYnl0ZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIGJ5dGVzID0gdGhpcy5iNThUb0J1ZmZlcihieXRlcylcbiAgICB9XG4gICAgaWYgKHRoaXMudmFsaWRhdGVDaGVja3N1bShieXRlcykpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvcHlGcm9tKGJ5dGVzLCAwLCBieXRlcy5sZW5ndGggLSA0KVxuICAgIH1cbiAgICB0aHJvdyBuZXcgQ2hlY2tzdW1FcnJvcihcIkVycm9yIC0gQmluVG9vbHMuY2I1OERlY29kZTogaW52YWxpZCBjaGVja3N1bVwiKVxuICB9XG5cbiAgY2I1OERlY29kZVdpdGhDaGVja3N1bSA9IChieXRlczogQnVmZmVyIHwgc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgICBpZiAodHlwZW9mIGJ5dGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBieXRlcyA9IHRoaXMuYjU4VG9CdWZmZXIoYnl0ZXMpXG4gICAgfVxuICAgIGlmICh0aGlzLnZhbGlkYXRlQ2hlY2tzdW0oYnl0ZXMpKSB7XG4gICAgICByZXR1cm4gYDB4JHt0aGlzLmNvcHlGcm9tKGJ5dGVzLCAwLCBieXRlcy5sZW5ndGgpLnRvU3RyaW5nKFwiaGV4XCIpfWBcbiAgICB9XG4gICAgdGhyb3cgbmV3IENoZWNrc3VtRXJyb3IoXCJFcnJvciAtIEJpblRvb2xzLmNiNThEZWNvZGU6IGludmFsaWQgY2hlY2tzdW1cIilcbiAgfVxuXG4gIGFkZHJlc3NUb1N0cmluZyA9IChocnA6IHN0cmluZywgY2hhaW5pZDogc3RyaW5nLCBieXRlczogQnVmZmVyKTogc3RyaW5nID0+XG4gICAgYCR7Y2hhaW5pZH0tJHtiZWNoMzIuYmVjaDMyLmVuY29kZShocnAsIGJlY2gzMi5iZWNoMzIudG9Xb3JkcyhieXRlcykpfWBcblxuICBzdHJpbmdUb0FkZHJlc3MgPSAoYWRkcmVzczogc3RyaW5nLCBocnA/OiBzdHJpbmcpOiBCdWZmZXIgPT4ge1xuICAgIGlmIChhZGRyZXNzLnN1YnN0cmluZygwLCAyKSA9PT0gXCIweFwiKSB7XG4gICAgICAvLyBFVEgtc3R5bGUgYWRkcmVzc1xuICAgICAgaWYgKHV0aWxzLmlzQWRkcmVzcyhhZGRyZXNzKSkge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20oYWRkcmVzcy5zdWJzdHJpbmcoMiksIFwiaGV4XCIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgSGV4RXJyb3IoXCJFcnJvciAtIEludmFsaWQgYWRkcmVzc1wiKVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBCZWNoMzIgYWRkcmVzc2VzXG4gICAgY29uc3QgcGFydHM6IHN0cmluZ1tdID0gYWRkcmVzcy50cmltKCkuc3BsaXQoXCItXCIpXG5cbiAgICBpZiAocGFydHMubGVuZ3RoIDwgMikge1xuICAgICAgdGhyb3cgbmV3IEJlY2gzMkVycm9yKFwiRXJyb3IgLSBWYWxpZCBhZGRyZXNzIHNob3VsZCBpbmNsdWRlIC1cIilcbiAgICB9XG5cbiAgICBpZiAocGFydHNbMF0ubGVuZ3RoIDwgMSkge1xuICAgICAgdGhyb3cgbmV3IEJlY2gzMkVycm9yKFwiRXJyb3IgLSBWYWxpZCBhZGRyZXNzIG11c3QgaGF2ZSBwcmVmaXggYmVmb3JlIC1cIilcbiAgICB9XG5cbiAgICBjb25zdCBzcGxpdDogbnVtYmVyID0gcGFydHNbMV0ubGFzdEluZGV4T2YoXCIxXCIpXG4gICAgaWYgKHNwbGl0IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEJlY2gzMkVycm9yKFwiRXJyb3IgLSBWYWxpZCBhZGRyZXNzIG11c3QgaW5jbHVkZSBzZXBhcmF0b3IgKDEpXCIpXG4gICAgfVxuXG4gICAgY29uc3QgaHVtYW5SZWFkYWJsZVBhcnQ6IHN0cmluZyA9IHBhcnRzWzFdLnNsaWNlKDAsIHNwbGl0KVxuICAgIGlmIChodW1hblJlYWRhYmxlUGFydC5sZW5ndGggPCAxKSB7XG4gICAgICB0aHJvdyBuZXcgQmVjaDMyRXJyb3IoXCJFcnJvciAtIEhSUCBzaG91bGQgYmUgYXQgbGVhc3QgMSBjaGFyYWN0ZXJcIilcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPT0gXCJhdmF4XCIgJiZcbiAgICAgIGh1bWFuUmVhZGFibGVQYXJ0ICE9PSBcImZ1amlcIiAmJlxuICAgICAgaHVtYW5SZWFkYWJsZVBhcnQgIT0gXCJsb2NhbFwiICYmXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPSBcImN1c3RvbVwiICYmXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPSBcImxvY2FsZmxhcmVcIiAmJlxuICAgICAgaHVtYW5SZWFkYWJsZVBhcnQgIT0gXCJmbGFyZVwiICYmXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPSBcImNvc3R3b1wiICYmXG4gICAgICBodW1hblJlYWRhYmxlUGFydCAhPSBocnBcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBCZWNoMzJFcnJvcihcIkVycm9yIC0gSW52YWxpZCBIUlBcIilcbiAgICB9XG5cbiAgICByZXR1cm4gQnVmZmVyLmZyb20oXG4gICAgICBiZWNoMzIuYmVjaDMyLmZyb21Xb3JkcyhiZWNoMzIuYmVjaDMyLmRlY29kZShwYXJ0c1sxXSkud29yZHMpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGFuIGFkZHJlc3MgYW5kIHJldHVybnMgaXRzIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9XG4gICAqIHJlcHJlc2VudGF0aW9uIGlmIHZhbGlkLiBBIG1vcmUgc3RyaWN0IHZlcnNpb24gb2Ygc3RyaW5nVG9BZGRyZXNzLlxuICAgKlxuICAgKiBAcGFyYW0gYWRkciBBIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYWRkcmVzc1xuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIEEgY2I1OCBlbmNvZGVkIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgYmxvY2tjaGFpbklEXG4gICAqIEBwYXJhbSBhbGlhcyBBIGNoYWluSUQgYWxpYXMsIGlmIGFueSwgdGhhdCB0aGUgYWRkcmVzcyBjYW4gYWxzbyBwYXJzZSBmcm9tLlxuICAgKiBAcGFyYW0gYWRkcmxlbiBWTXMgY2FuIHVzZSBhbnkgYWRkcmVzc2luZyBzY2hlbWUgdGhhdCB0aGV5IGxpa2UsIHNvIHRoaXMgaXMgdGhlIGFwcHJvcHJpYXRlIG51bWJlciBvZiBhZGRyZXNzIGJ5dGVzLiBEZWZhdWx0IDIwLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgYWRkcmVzcyBpZiB2YWxpZCxcbiAgICogdW5kZWZpbmVkIGlmIG5vdCB2YWxpZC5cbiAgICovXG4gIHBhcnNlQWRkcmVzcyA9IChcbiAgICBhZGRyOiBzdHJpbmcsXG4gICAgYmxvY2tjaGFpbklEOiBzdHJpbmcsXG4gICAgYWxpYXM6IHN0cmluZyA9IHVuZGVmaW5lZCxcbiAgICBhZGRybGVuOiBudW1iZXIgPSAyMFxuICApOiBCdWZmZXIgPT4ge1xuICAgIGNvbnN0IGFiYzogc3RyaW5nW10gPSBhZGRyLnNwbGl0KFwiLVwiKVxuICAgIGlmIChcbiAgICAgIGFiYy5sZW5ndGggPT09IDIgJiZcbiAgICAgICgoYWxpYXMgJiYgYWJjWzBdID09PSBhbGlhcykgfHwgKGJsb2NrY2hhaW5JRCAmJiBhYmNbMF0gPT09IGJsb2NrY2hhaW5JRCkpXG4gICAgKSB7XG4gICAgICBjb25zdCBhZGRyYnVmZiA9IHRoaXMuc3RyaW5nVG9BZGRyZXNzKGFkZHIpXG4gICAgICBpZiAoKGFkZHJsZW4gJiYgYWRkcmJ1ZmYubGVuZ3RoID09PSBhZGRybGVuKSB8fCAhYWRkcmxlbikge1xuICAgICAgICByZXR1cm4gYWRkcmJ1ZmZcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG4iXX0=