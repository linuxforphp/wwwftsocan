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
exports.SECP256k1KeyChain = exports.SECP256k1KeyPair = void 0;
/**
 * @packageDocumentation
 * @module Common-SECP256k1KeyChain
 */
const buffer_1 = require("buffer/");
const elliptic = __importStar(require("elliptic"));
const create_hash_1 = __importDefault(require("create-hash"));
const bintools_1 = __importDefault(require("../utils/bintools"));
const keychain_1 = require("./keychain");
const errors_1 = require("../utils/errors");
const utils_1 = require("../utils");
/**
 * @ignore
 */
const EC = elliptic.ec;
/**
 * @ignore
 */
const ec = new EC("secp256k1");
/**
 * @ignore
 */
const ecparams = ec.curve;
/**
 * @ignore
 */
const BN = ecparams.n.constructor;
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for representing a private and public keypair on the Platform Chain.
 */
class SECP256k1KeyPair extends keychain_1.StandardKeyPair {
    constructor(hrp, chainID) {
        super();
        this.chainID = "";
        this.hrp = "";
        this.chainID = chainID;
        this.hrp = hrp;
        this.generateKey();
    }
    /**
     * @ignore
     */
    _sigFromSigBuffer(sig) {
        const r = new BN(bintools.copyFrom(sig, 0, 32));
        const s = new BN(bintools.copyFrom(sig, 32, 64));
        const recoveryParam = bintools
            .copyFrom(sig, 64, 65)
            .readUIntBE(0, 1);
        const sigOpt = {
            r: r,
            s: s,
            recoveryParam: recoveryParam
        };
        return sigOpt;
    }
    /**
     * Generates a new keypair.
     */
    generateKey() {
        this.keypair = ec.genKeyPair();
        // doing hex translation to get Buffer class
        this.privk = buffer_1.Buffer.from(this.keypair.getPrivate("hex").padStart(64, "0"), "hex");
        this.pubk = buffer_1.Buffer.from(this.keypair.getPublic(true, "hex").padStart(66, "0"), "hex");
    }
    /**
     * Imports a private key and generates the appropriate public key.
     *
     * @param privk A {@link https://github.com/feross/buffer|Buffer} representing the private key
     *
     * @returns true on success, false on failure
     */
    importKey(privk) {
        const isPrivateKey = (privk.length == 32);
        if (isPrivateKey) {
            this.keypair = ec.keyFromPrivate(privk.toString("hex"), "hex");
        }
        else {
            this.keypair = ec.keyFromPublic(privk.toString("hex"), "hex");
        }
        // doing hex translation to get Buffer class
        try {
            if (isPrivateKey) {
                this.privk = buffer_1.Buffer.from(this.keypair.getPrivate("hex").padStart(64, "0"), "hex");
            }
            this.pubk = buffer_1.Buffer.from(this.keypair.getPublic(true, "hex").padStart(66, "0"), "hex");
            return true; // silly I know, but the interface requires so it returns true on success, so if Buffer fails validation...
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Returns the address as a {@link https://github.com/feross/buffer|Buffer}.
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} representation of the address
     */
    getAddress() {
        return SECP256k1KeyPair.addressFromPublicKey(this.pubk);
    }
    /**
     * Returns the address's string representation.
     *
     * @returns A string representation of the address
     */
    getAddressString() {
        const addr = SECP256k1KeyPair.addressFromPublicKey(this.pubk);
        const type = "bech32";
        return serialization.bufferToType(addr, type, this.hrp, this.chainID);
    }
    /**
     * Returns an address given a public key.
     *
     * @param pubk A {@link https://github.com/feross/buffer|Buffer} representing the public key
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} for the address of the public key.
     */
    static addressFromPublicKey(pubk) {
        if (pubk.length === 65) {
            /* istanbul ignore next */
            pubk = buffer_1.Buffer.from(ec.keyFromPublic(pubk).getPublic(true, "hex").padStart(66, "0"), "hex"); // make compact, stick back into buffer
        }
        if (pubk.length === 33) {
            const sha256 = buffer_1.Buffer.from((0, create_hash_1.default)("sha256").update(pubk).digest());
            const ripesha = buffer_1.Buffer.from((0, create_hash_1.default)("ripemd160").update(sha256).digest());
            return ripesha;
        }
        /* istanbul ignore next */
        throw new errors_1.PublicKeyError("Unable to make address.");
    }
    /**
     * Returns a string representation of the private key.
     *
     * @returns A cb58 serialized string representation of the private key
     */
    getPrivateKeyString() {
        return `PrivateKey-${bintools.cb58Encode(this.privk)}`;
    }
    /**
     * Returns the public key.
     *
     * @returns A cb58 serialized string representation of the public key
     */
    getPublicKeyString() {
        return bintools.cb58Encode(this.pubk);
    }
    /**
     * Takes a message, signs it, and returns the signature.
     *
     * @param msg The message to sign, be sure to hash first if expected
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the signature
     */
    sign(msg) {
        const sigObj = this.keypair.sign(msg, undefined, {
            canonical: true
        });
        const recovery = buffer_1.Buffer.alloc(1);
        recovery.writeUInt8(sigObj.recoveryParam, 0);
        const r = buffer_1.Buffer.from(sigObj.r.toArray("be", 32)); //we have to skip native Buffer class, so this is the way
        const s = buffer_1.Buffer.from(sigObj.s.toArray("be", 32)); //we have to skip native Buffer class, so this is the way
        const result = buffer_1.Buffer.concat([r, s, recovery], 65);
        return result;
    }
    prepareUnsignedHashes(msg, signer) {
        return [{ message: msg.toString('hex'), signer: signer.toString('hex') }];
    }
    signWithRawSignatures(sig) {
        const recovery = buffer_1.Buffer.alloc(1);
        recovery.writeUInt8(sig.recoveryParam, 0);
        const r = buffer_1.Buffer.from(sig.r.toArray("be", 32)); //we have to skip native Buffer class, so this is the way
        const s = buffer_1.Buffer.from(sig.s.toArray("be", 32)); //we have to skip native Buffer class, so this is the way
        const result = buffer_1.Buffer.concat([r, s, recovery], 65);
        return result;
    }
    /**
     * Verifies that the private key associated with the provided public key produces the signature associated with the given message.
     *
     * @param msg The message associated with the signature
     * @param sig The signature of the signed message
     *
     * @returns True on success, false on failure
     */
    verify(msg, sig) {
        const sigObj = this._sigFromSigBuffer(sig);
        return ec.verify(msg, sigObj, this.keypair);
    }
    /**
     * Recovers the public key of a message signer from a message and its associated signature.
     *
     * @param msg The message that's signed
     * @param sig The signature that's signed on the message
     *
     * @returns A {@link https://github.com/feross/buffer|Buffer} containing the public key of the signer
     */
    recover(msg, sig) {
        const sigObj = this._sigFromSigBuffer(sig);
        const pubk = ec.recoverPubKey(msg, sigObj, sigObj.recoveryParam);
        return buffer_1.Buffer.from(pubk.encodeCompressed());
    }
    /**
     * Returns the chainID associated with this key.
     *
     * @returns The [[KeyPair]]'s chainID
     */
    getChainID() {
        return this.chainID;
    }
    /**
     * Sets the the chainID associated with this key.
     *
     * @param chainID String for the chainID
     */
    setChainID(chainID) {
        this.chainID = chainID;
    }
    /**
     * Returns the Human-Readable-Part of the network associated with this key.
     *
     * @returns The [[KeyPair]]'s Human-Readable-Part of the network's Bech32 addressing scheme
     */
    getHRP() {
        return this.hrp;
    }
    /**
     * Sets the the Human-Readable-Part of the network associated with this key.
     *
     * @param hrp String for the Human-Readable-Part of Bech32 addresses
     */
    setHRP(hrp) {
        this.hrp = hrp;
    }
}
exports.SECP256k1KeyPair = SECP256k1KeyPair;
/**
 * Class for representing a key chain in Avalanche.
 *
 * @typeparam SECP256k1KeyPair Class extending [[StandardKeyPair]] which is used as the key in [[SECP256k1KeyChain]]
 */
class SECP256k1KeyChain extends keychain_1.StandardKeyChain {
    addKey(newKey) {
        super.addKey(newKey);
    }
}
exports.SECP256k1KeyChain = SECP256k1KeyChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcDI1NmsxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2NvbW1vbi9zZWNwMjU2azEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0dBR0c7QUFDSCxvQ0FBZ0M7QUFDaEMsbURBQW9DO0FBQ3BDLDhEQUFvQztBQUNwQyxpRUFBd0M7QUFDeEMseUNBQThEO0FBQzlELDRDQUFnRDtBQUVoRCxvQ0FBd0Q7QUFHeEQ7O0dBRUc7QUFDSCxNQUFNLEVBQUUsR0FBdUIsUUFBUSxDQUFDLEVBQUUsQ0FBQTtBQUUxQzs7R0FFRztBQUNILE1BQU0sRUFBRSxHQUFnQixJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtBQUUzQzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUE7QUFFOUI7O0dBRUc7QUFDSCxNQUFNLEVBQUUsR0FBUSxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQTtBQUV0Qzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLHFCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFaEU7O0dBRUc7QUFDSCxNQUFzQixnQkFBaUIsU0FBUSwwQkFBZTtJQXdPNUQsWUFBWSxHQUFXLEVBQUUsT0FBZTtRQUN0QyxLQUFLLEVBQUUsQ0FBQTtRQXZPQyxZQUFPLEdBQVcsRUFBRSxDQUFBO1FBQ3BCLFFBQUcsR0FBVyxFQUFFLENBQUE7UUF1T3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFBO1FBQ3RCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFBO1FBQ2QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO0lBQ3BCLENBQUM7SUF4T0Q7O09BRUc7SUFDTyxpQkFBaUIsQ0FBQyxHQUFXO1FBQ3JDLE1BQU0sQ0FBQyxHQUFZLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3hELE1BQU0sQ0FBQyxHQUFZLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3pELE1BQU0sYUFBYSxHQUFXLFFBQVE7YUFDbkMsUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDO2FBQ3JCLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDbkIsTUFBTSxNQUFNLEdBQUc7WUFDYixDQUFDLEVBQUUsQ0FBQztZQUNKLENBQUMsRUFBRSxDQUFDO1lBQ0osYUFBYSxFQUFFLGFBQWE7U0FDN0IsQ0FBQTtRQUNELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNULElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxDQUFBO1FBRTlCLDRDQUE0QztRQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FBQyxJQUFJLENBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQ2hELEtBQUssQ0FDTixDQUFBO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxlQUFNLENBQUMsSUFBSSxDQUNyQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFDckQsS0FBSyxDQUNOLENBQUE7SUFDSCxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsU0FBUyxDQUFDLEtBQWE7UUFDckIsTUFBTSxZQUFZLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQ3pDLElBQUksWUFBWSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFBO1NBQy9EO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUM5RDtRQUNELDRDQUE0QztRQUM1QyxJQUFJO1lBQ0YsSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFDaEQsS0FBSyxDQUNOLENBQUE7YUFDRjtZQUNELElBQUksQ0FBQyxJQUFJLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FDckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQ3JELEtBQUssQ0FDTixDQUFBO1lBQ0QsT0FBTyxJQUFJLENBQUEsQ0FBQywyR0FBMkc7U0FDeEg7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLE9BQU8sS0FBSyxDQUFBO1NBQ2I7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFVBQVU7UUFDUixPQUFPLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGdCQUFnQjtRQUNkLE1BQU0sSUFBSSxHQUFXLGdCQUFnQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyRSxNQUFNLElBQUksR0FBbUIsUUFBUSxDQUFBO1FBQ3JDLE9BQU8sYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3ZFLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxNQUFNLENBQUMsb0JBQW9CLENBQUMsSUFBWTtRQUN0QyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQ3RCLDBCQUEwQjtZQUMxQixJQUFJLEdBQUcsZUFBTSxDQUFDLElBQUksQ0FDaEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQy9ELEtBQUssQ0FDTixDQUFBLENBQUMsdUNBQXVDO1NBQzFDO1FBQ0QsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLEVBQUUsRUFBRTtZQUN0QixNQUFNLE1BQU0sR0FBVyxlQUFNLENBQUMsSUFBSSxDQUNoQyxJQUFBLHFCQUFVLEVBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUMzQyxDQUFBO1lBQ0QsTUFBTSxPQUFPLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FDakMsSUFBQSxxQkFBVSxFQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FDaEQsQ0FBQTtZQUNELE9BQU8sT0FBTyxDQUFBO1NBQ2Y7UUFDRCwwQkFBMEI7UUFDMUIsTUFBTSxJQUFJLHVCQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUNyRCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILG1CQUFtQjtRQUNqQixPQUFPLGNBQWMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQTtJQUN4RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGtCQUFrQjtRQUNoQixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZDLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxJQUFJLENBQUMsR0FBVztRQUNkLE1BQU0sTUFBTSxHQUEwQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFO1lBQ3RFLFNBQVMsRUFBRSxJQUFJO1NBQ2hCLENBQUMsQ0FBQTtRQUNGLE1BQU0sUUFBUSxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDeEMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzVDLE1BQU0sQ0FBQyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUEsQ0FBQyx5REFBeUQ7UUFDbkgsTUFBTSxDQUFDLEdBQVcsZUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQSxDQUFDLHlEQUF5RDtRQUNuSCxNQUFNLE1BQU0sR0FBVyxlQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUMxRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxHQUFXLEVBQUUsTUFBYztRQUMvQyxPQUFPLENBQW1CLEVBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQyxDQUFBO0lBQzNGLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxHQUFtQjtRQUN2QyxNQUFNLFFBQVEsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3hDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6QyxNQUFNLENBQUMsR0FBVyxlQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBLENBQUMseURBQXlEO1FBQ2hILE1BQU0sQ0FBQyxHQUFXLGVBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUEsQ0FBQyx5REFBeUQ7UUFDaEgsTUFBTSxNQUFNLEdBQVcsZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDMUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxHQUFXLEVBQUUsR0FBVztRQUM3QixNQUFNLE1BQU0sR0FBaUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hFLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE9BQU8sQ0FBQyxHQUFXLEVBQUUsR0FBVztRQUM5QixNQUFNLE1BQU0sR0FBaUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3hFLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDaEUsT0FBTyxlQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUE7SUFDN0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxVQUFVO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFBO0lBQ3JCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsVUFBVSxDQUFDLE9BQWU7UUFDeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7SUFDeEIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFBO0lBQ2pCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLEdBQVc7UUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7SUFDaEIsQ0FBQztDQVFGO0FBOU9ELDRDQThPQztBQUVEOzs7O0dBSUc7QUFDSCxNQUFzQixpQkFFcEIsU0FBUSwyQkFBNkI7SUFRckMsTUFBTSxDQUFDLE1BQW1CO1FBQ3hCLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDdEIsQ0FBQztDQVVGO0FBdEJELDhDQXNCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKiBAbW9kdWxlIENvbW1vbi1TRUNQMjU2azFLZXlDaGFpblxuICovXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgKiBhcyBlbGxpcHRpYyBmcm9tIFwiZWxsaXB0aWNcIlxuaW1wb3J0IGNyZWF0ZUhhc2ggZnJvbSBcImNyZWF0ZS1oYXNoXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0IHsgU3RhbmRhcmRLZXlQYWlyLCBTdGFuZGFyZEtleUNoYWluIH0gZnJvbSBcIi4va2V5Y2hhaW5cIlxuaW1wb3J0IHsgUHVibGljS2V5RXJyb3IgfSBmcm9tIFwiLi4vdXRpbHMvZXJyb3JzXCJcbmltcG9ydCB7IEJOSW5wdXQgfSBmcm9tIFwiZWxsaXB0aWNcIlxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZFR5cGUgfSBmcm9tIFwiLi4vdXRpbHNcIlxuaW1wb3J0IHsgU2lnbmF0dXJlUmVxdWVzdCwgRWNkc2FTaWduYXR1cmUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IEVDOiB0eXBlb2YgZWxsaXB0aWMuZWMgPSBlbGxpcHRpYy5lY1xuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuY29uc3QgZWM6IGVsbGlwdGljLmVjID0gbmV3IEVDKFwic2VjcDI1NmsxXCIpXG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5jb25zdCBlY3BhcmFtczogYW55ID0gZWMuY3VydmVcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IEJOOiBhbnkgPSBlY3BhcmFtcy5uLmNvbnN0cnVjdG9yXG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXG5cbi8qKlxuICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIHByaXZhdGUgYW5kIHB1YmxpYyBrZXlwYWlyIG9uIHRoZSBQbGF0Zm9ybSBDaGFpbi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNFQ1AyNTZrMUtleVBhaXIgZXh0ZW5kcyBTdGFuZGFyZEtleVBhaXIge1xuICBwcm90ZWN0ZWQga2V5cGFpcjogZWxsaXB0aWMuZWMuS2V5UGFpclxuICBwcm90ZWN0ZWQgY2hhaW5JRDogc3RyaW5nID0gXCJcIlxuICBwcm90ZWN0ZWQgaHJwOiBzdHJpbmcgPSBcIlwiXG5cbiAgLyoqXG4gICAqIEBpZ25vcmVcbiAgICovXG4gIHByb3RlY3RlZCBfc2lnRnJvbVNpZ0J1ZmZlcihzaWc6IEJ1ZmZlcik6IGVsbGlwdGljLmVjLlNpZ25hdHVyZU9wdGlvbnMge1xuICAgIGNvbnN0IHI6IEJOSW5wdXQgPSBuZXcgQk4oYmludG9vbHMuY29weUZyb20oc2lnLCAwLCAzMikpXG4gICAgY29uc3QgczogQk5JbnB1dCA9IG5ldyBCTihiaW50b29scy5jb3B5RnJvbShzaWcsIDMyLCA2NCkpXG4gICAgY29uc3QgcmVjb3ZlcnlQYXJhbTogbnVtYmVyID0gYmludG9vbHNcbiAgICAgIC5jb3B5RnJvbShzaWcsIDY0LCA2NSlcbiAgICAgIC5yZWFkVUludEJFKDAsIDEpXG4gICAgY29uc3Qgc2lnT3B0ID0ge1xuICAgICAgcjogcixcbiAgICAgIHM6IHMsXG4gICAgICByZWNvdmVyeVBhcmFtOiByZWNvdmVyeVBhcmFtXG4gICAgfVxuICAgIHJldHVybiBzaWdPcHRcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBuZXcga2V5cGFpci5cbiAgICovXG4gIGdlbmVyYXRlS2V5KCkge1xuICAgIHRoaXMua2V5cGFpciA9IGVjLmdlbktleVBhaXIoKVxuXG4gICAgLy8gZG9pbmcgaGV4IHRyYW5zbGF0aW9uIHRvIGdldCBCdWZmZXIgY2xhc3NcbiAgICB0aGlzLnByaXZrID0gQnVmZmVyLmZyb20oXG4gICAgICB0aGlzLmtleXBhaXIuZ2V0UHJpdmF0ZShcImhleFwiKS5wYWRTdGFydCg2NCwgXCIwXCIpLFxuICAgICAgXCJoZXhcIlxuICAgIClcbiAgICB0aGlzLnB1YmsgPSBCdWZmZXIuZnJvbShcbiAgICAgIHRoaXMua2V5cGFpci5nZXRQdWJsaWModHJ1ZSwgXCJoZXhcIikucGFkU3RhcnQoNjYsIFwiMFwiKSxcbiAgICAgIFwiaGV4XCJcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0cyBhIHByaXZhdGUga2V5IGFuZCBnZW5lcmF0ZXMgdGhlIGFwcHJvcHJpYXRlIHB1YmxpYyBrZXkuXG4gICAqXG4gICAqIEBwYXJhbSBwcml2ayBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGluZyB0aGUgcHJpdmF0ZSBrZXlcbiAgICpcbiAgICogQHJldHVybnMgdHJ1ZSBvbiBzdWNjZXNzLCBmYWxzZSBvbiBmYWlsdXJlXG4gICAqL1xuICBpbXBvcnRLZXkocHJpdms6IEJ1ZmZlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGlzUHJpdmF0ZUtleSA9IChwcml2ay5sZW5ndGggPT0gMzIpXG4gICAgaWYgKGlzUHJpdmF0ZUtleSkge1xuICAgICAgdGhpcy5rZXlwYWlyID0gZWMua2V5RnJvbVByaXZhdGUocHJpdmsudG9TdHJpbmcoXCJoZXhcIiksIFwiaGV4XCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMua2V5cGFpciA9IGVjLmtleUZyb21QdWJsaWMocHJpdmsudG9TdHJpbmcoXCJoZXhcIiksIFwiaGV4XCIpXG4gICAgfVxuICAgIC8vIGRvaW5nIGhleCB0cmFuc2xhdGlvbiB0byBnZXQgQnVmZmVyIGNsYXNzXG4gICAgdHJ5IHtcbiAgICAgIGlmIChpc1ByaXZhdGVLZXkpIHtcbiAgICAgICAgdGhpcy5wcml2ayA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICAgIHRoaXMua2V5cGFpci5nZXRQcml2YXRlKFwiaGV4XCIpLnBhZFN0YXJ0KDY0LCBcIjBcIiksXG4gICAgICAgICAgXCJoZXhcIlxuICAgICAgICApXG4gICAgICB9XG4gICAgICB0aGlzLnB1YmsgPSBCdWZmZXIuZnJvbShcbiAgICAgICAgdGhpcy5rZXlwYWlyLmdldFB1YmxpYyh0cnVlLCBcImhleFwiKS5wYWRTdGFydCg2NiwgXCIwXCIpLFxuICAgICAgICBcImhleFwiXG4gICAgICApXG4gICAgICByZXR1cm4gdHJ1ZSAvLyBzaWxseSBJIGtub3csIGJ1dCB0aGUgaW50ZXJmYWNlIHJlcXVpcmVzIHNvIGl0IHJldHVybnMgdHJ1ZSBvbiBzdWNjZXNzLCBzbyBpZiBCdWZmZXIgZmFpbHMgdmFsaWRhdGlvbi4uLlxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYWRkcmVzcyBhcyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxuICAgKlxuICAgKiBAcmV0dXJucyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhZGRyZXNzXG4gICAqL1xuICBnZXRBZGRyZXNzKCk6IEJ1ZmZlciB7XG4gICAgcmV0dXJuIFNFQ1AyNTZrMUtleVBhaXIuYWRkcmVzc0Zyb21QdWJsaWNLZXkodGhpcy5wdWJrKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFkZHJlc3MncyBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAqXG4gICAqIEByZXR1cm5zIEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBhZGRyZXNzXG4gICAqL1xuICBnZXRBZGRyZXNzU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYWRkcjogQnVmZmVyID0gU0VDUDI1NmsxS2V5UGFpci5hZGRyZXNzRnJvbVB1YmxpY0tleSh0aGlzLnB1YmspXG4gICAgY29uc3QgdHlwZTogU2VyaWFsaXplZFR5cGUgPSBcImJlY2gzMlwiXG4gICAgcmV0dXJuIHNlcmlhbGl6YXRpb24uYnVmZmVyVG9UeXBlKGFkZHIsIHR5cGUsIHRoaXMuaHJwLCB0aGlzLmNoYWluSUQpXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBhZGRyZXNzIGdpdmVuIGEgcHVibGljIGtleS5cbiAgICpcbiAgICogQHBhcmFtIHB1YmsgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRpbmcgdGhlIHB1YmxpYyBrZXlcbiAgICpcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIGFkZHJlc3Mgb2YgdGhlIHB1YmxpYyBrZXkuXG4gICAqL1xuICBzdGF0aWMgYWRkcmVzc0Zyb21QdWJsaWNLZXkocHViazogQnVmZmVyKTogQnVmZmVyIHtcbiAgICBpZiAocHViay5sZW5ndGggPT09IDY1KSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgcHViayA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICBlYy5rZXlGcm9tUHVibGljKHB1YmspLmdldFB1YmxpYyh0cnVlLCBcImhleFwiKS5wYWRTdGFydCg2NiwgXCIwXCIpLFxuICAgICAgICBcImhleFwiXG4gICAgICApIC8vIG1ha2UgY29tcGFjdCwgc3RpY2sgYmFjayBpbnRvIGJ1ZmZlclxuICAgIH1cbiAgICBpZiAocHViay5sZW5ndGggPT09IDMzKSB7XG4gICAgICBjb25zdCBzaGEyNTY6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKFxuICAgICAgICBjcmVhdGVIYXNoKFwic2hhMjU2XCIpLnVwZGF0ZShwdWJrKS5kaWdlc3QoKVxuICAgICAgKVxuICAgICAgY29uc3QgcmlwZXNoYTogQnVmZmVyID0gQnVmZmVyLmZyb20oXG4gICAgICAgIGNyZWF0ZUhhc2goXCJyaXBlbWQxNjBcIikudXBkYXRlKHNoYTI1NikuZGlnZXN0KClcbiAgICAgIClcbiAgICAgIHJldHVybiByaXBlc2hhXG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgdGhyb3cgbmV3IFB1YmxpY0tleUVycm9yKFwiVW5hYmxlIHRvIG1ha2UgYWRkcmVzcy5cIilcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwcml2YXRlIGtleS5cbiAgICpcbiAgICogQHJldHVybnMgQSBjYjU4IHNlcmlhbGl6ZWQgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBwcml2YXRlIGtleVxuICAgKi9cbiAgZ2V0UHJpdmF0ZUtleVN0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiBgUHJpdmF0ZUtleS0ke2JpbnRvb2xzLmNiNThFbmNvZGUodGhpcy5wcml2ayl9YFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHB1YmxpYyBrZXkuXG4gICAqXG4gICAqIEByZXR1cm5zIEEgY2I1OCBzZXJpYWxpemVkIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgcHVibGljIGtleVxuICAgKi9cbiAgZ2V0UHVibGljS2V5U3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGJpbnRvb2xzLmNiNThFbmNvZGUodGhpcy5wdWJrKVxuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIGEgbWVzc2FnZSwgc2lnbnMgaXQsIGFuZCByZXR1cm5zIHRoZSBzaWduYXR1cmUuXG4gICAqXG4gICAqIEBwYXJhbSBtc2cgVGhlIG1lc3NhZ2UgdG8gc2lnbiwgYmUgc3VyZSB0byBoYXNoIGZpcnN0IGlmIGV4cGVjdGVkXG4gICAqXG4gICAqIEByZXR1cm5zIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gY29udGFpbmluZyB0aGUgc2lnbmF0dXJlXG4gICAqL1xuICBzaWduKG1zZzogQnVmZmVyKTogQnVmZmVyIHtcbiAgICBjb25zdCBzaWdPYmo6IGVsbGlwdGljLmVjLlNpZ25hdHVyZSA9IHRoaXMua2V5cGFpci5zaWduKG1zZywgdW5kZWZpbmVkLCB7XG4gICAgICBjYW5vbmljYWw6IHRydWVcbiAgICB9KVxuICAgIGNvbnN0IHJlY292ZXJ5OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMSlcbiAgICByZWNvdmVyeS53cml0ZVVJbnQ4KHNpZ09iai5yZWNvdmVyeVBhcmFtLCAwKVxuICAgIGNvbnN0IHI6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHNpZ09iai5yLnRvQXJyYXkoXCJiZVwiLCAzMikpIC8vd2UgaGF2ZSB0byBza2lwIG5hdGl2ZSBCdWZmZXIgY2xhc3MsIHNvIHRoaXMgaXMgdGhlIHdheVxuICAgIGNvbnN0IHM6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHNpZ09iai5zLnRvQXJyYXkoXCJiZVwiLCAzMikpIC8vd2UgaGF2ZSB0byBza2lwIG5hdGl2ZSBCdWZmZXIgY2xhc3MsIHNvIHRoaXMgaXMgdGhlIHdheVxuICAgIGNvbnN0IHJlc3VsdDogQnVmZmVyID0gQnVmZmVyLmNvbmNhdChbciwgcywgcmVjb3ZlcnldLCA2NSlcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cblxuICBwcmVwYXJlVW5zaWduZWRIYXNoZXMobXNnOiBCdWZmZXIsIHNpZ25lcjogQnVmZmVyKSB7XG4gICAgcmV0dXJuIFs8U2lnbmF0dXJlUmVxdWVzdD57bWVzc2FnZTogbXNnLnRvU3RyaW5nKCdoZXgnKSwgc2lnbmVyOiBzaWduZXIudG9TdHJpbmcoJ2hleCcpfV1cbiAgfVxuXG4gIHNpZ25XaXRoUmF3U2lnbmF0dXJlcyhzaWc6IEVjZHNhU2lnbmF0dXJlKSB7XG4gICAgY29uc3QgcmVjb3Zlcnk6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxKVxuICAgIHJlY292ZXJ5LndyaXRlVUludDgoc2lnLnJlY292ZXJ5UGFyYW0sIDApXG4gICAgY29uc3QgcjogQnVmZmVyID0gQnVmZmVyLmZyb20oc2lnLnIudG9BcnJheShcImJlXCIsIDMyKSkgLy93ZSBoYXZlIHRvIHNraXAgbmF0aXZlIEJ1ZmZlciBjbGFzcywgc28gdGhpcyBpcyB0aGUgd2F5XG4gICAgY29uc3QgczogQnVmZmVyID0gQnVmZmVyLmZyb20oc2lnLnMudG9BcnJheShcImJlXCIsIDMyKSkgLy93ZSBoYXZlIHRvIHNraXAgbmF0aXZlIEJ1ZmZlciBjbGFzcywgc28gdGhpcyBpcyB0aGUgd2F5XG4gICAgY29uc3QgcmVzdWx0OiBCdWZmZXIgPSBCdWZmZXIuY29uY2F0KFtyLCBzLCByZWNvdmVyeV0sIDY1KVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGF0IHRoZSBwcml2YXRlIGtleSBhc3NvY2lhdGVkIHdpdGggdGhlIHByb3ZpZGVkIHB1YmxpYyBrZXkgcHJvZHVjZXMgdGhlIHNpZ25hdHVyZSBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBtc2cgVGhlIG1lc3NhZ2UgYXNzb2NpYXRlZCB3aXRoIHRoZSBzaWduYXR1cmVcbiAgICogQHBhcmFtIHNpZyBUaGUgc2lnbmF0dXJlIG9mIHRoZSBzaWduZWQgbWVzc2FnZVxuICAgKlxuICAgKiBAcmV0dXJucyBUcnVlIG9uIHN1Y2Nlc3MsIGZhbHNlIG9uIGZhaWx1cmVcbiAgICovXG4gIHZlcmlmeShtc2c6IEJ1ZmZlciwgc2lnOiBCdWZmZXIpOiBib29sZWFuIHtcbiAgICBjb25zdCBzaWdPYmo6IGVsbGlwdGljLmVjLlNpZ25hdHVyZU9wdGlvbnMgPSB0aGlzLl9zaWdGcm9tU2lnQnVmZmVyKHNpZylcbiAgICByZXR1cm4gZWMudmVyaWZ5KG1zZywgc2lnT2JqLCB0aGlzLmtleXBhaXIpXG4gIH1cblxuICAvKipcbiAgICogUmVjb3ZlcnMgdGhlIHB1YmxpYyBrZXkgb2YgYSBtZXNzYWdlIHNpZ25lciBmcm9tIGEgbWVzc2FnZSBhbmQgaXRzIGFzc29jaWF0ZWQgc2lnbmF0dXJlLlxuICAgKlxuICAgKiBAcGFyYW0gbXNnIFRoZSBtZXNzYWdlIHRoYXQncyBzaWduZWRcbiAgICogQHBhcmFtIHNpZyBUaGUgc2lnbmF0dXJlIHRoYXQncyBzaWduZWQgb24gdGhlIG1lc3NhZ2VcbiAgICpcbiAgICogQHJldHVybnMgQSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIHRoZSBwdWJsaWMga2V5IG9mIHRoZSBzaWduZXJcbiAgICovXG4gIHJlY292ZXIobXNnOiBCdWZmZXIsIHNpZzogQnVmZmVyKTogQnVmZmVyIHtcbiAgICBjb25zdCBzaWdPYmo6IGVsbGlwdGljLmVjLlNpZ25hdHVyZU9wdGlvbnMgPSB0aGlzLl9zaWdGcm9tU2lnQnVmZmVyKHNpZylcbiAgICBjb25zdCBwdWJrID0gZWMucmVjb3ZlclB1YktleShtc2csIHNpZ09iaiwgc2lnT2JqLnJlY292ZXJ5UGFyYW0pXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHB1YmsuZW5jb2RlQ29tcHJlc3NlZCgpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNoYWluSUQgYXNzb2NpYXRlZCB3aXRoIHRoaXMga2V5LlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgW1tLZXlQYWlyXV0ncyBjaGFpbklEXG4gICAqL1xuICBnZXRDaGFpbklEKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2hhaW5JRFxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHRoZSBjaGFpbklEIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleS5cbiAgICpcbiAgICogQHBhcmFtIGNoYWluSUQgU3RyaW5nIGZvciB0aGUgY2hhaW5JRFxuICAgKi9cbiAgc2V0Q2hhaW5JRChjaGFpbklEOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmNoYWluSUQgPSBjaGFpbklEXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgSHVtYW4tUmVhZGFibGUtUGFydCBvZiB0aGUgbmV0d29yayBhc3NvY2lhdGVkIHdpdGggdGhpcyBrZXkuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBbW0tleVBhaXJdXSdzIEh1bWFuLVJlYWRhYmxlLVBhcnQgb2YgdGhlIG5ldHdvcmsncyBCZWNoMzIgYWRkcmVzc2luZyBzY2hlbWVcbiAgICovXG4gIGdldEhSUCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmhycFxuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHRoZSBIdW1hbi1SZWFkYWJsZS1QYXJ0IG9mIHRoZSBuZXR3b3JrIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGtleS5cbiAgICpcbiAgICogQHBhcmFtIGhycCBTdHJpbmcgZm9yIHRoZSBIdW1hbi1SZWFkYWJsZS1QYXJ0IG9mIEJlY2gzMiBhZGRyZXNzZXNcbiAgICovXG4gIHNldEhSUChocnA6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaHJwID0gaHJwXG4gIH1cblxuICBjb25zdHJ1Y3RvcihocnA6IHN0cmluZywgY2hhaW5JRDogc3RyaW5nKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuY2hhaW5JRCA9IGNoYWluSURcbiAgICB0aGlzLmhycCA9IGhycFxuICAgIHRoaXMuZ2VuZXJhdGVLZXkoKVxuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIGtleSBjaGFpbiBpbiBBdmFsYW5jaGUuXG4gKlxuICogQHR5cGVwYXJhbSBTRUNQMjU2azFLZXlQYWlyIENsYXNzIGV4dGVuZGluZyBbW1N0YW5kYXJkS2V5UGFpcl1dIHdoaWNoIGlzIHVzZWQgYXMgdGhlIGtleSBpbiBbW1NFQ1AyNTZrMUtleUNoYWluXV1cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNFQ1AyNTZrMUtleUNoYWluPFxuICBTRUNQS1BDbGFzcyBleHRlbmRzIFNFQ1AyNTZrMUtleVBhaXJcbj4gZXh0ZW5kcyBTdGFuZGFyZEtleUNoYWluPFNFQ1BLUENsYXNzPiB7XG4gIC8qKlxuICAgKiBNYWtlcyBhIG5ldyBrZXkgcGFpciwgcmV0dXJucyB0aGUgYWRkcmVzcy5cbiAgICpcbiAgICogQHJldHVybnMgQWRkcmVzcyBvZiB0aGUgbmV3IGtleSBwYWlyXG4gICAqL1xuICBtYWtlS2V5OiAoKSA9PiBTRUNQS1BDbGFzc1xuXG4gIGFkZEtleShuZXdLZXk6IFNFQ1BLUENsYXNzKTogdm9pZCB7XG4gICAgc3VwZXIuYWRkS2V5KG5ld0tleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIHByaXZhdGUga2V5LCBtYWtlcyBhIG5ldyBrZXkgcGFpciwgcmV0dXJucyB0aGUgYWRkcmVzcy5cbiAgICpcbiAgICogQHBhcmFtIHByaXZrIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb3IgY2I1OCBzZXJpYWxpemVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaXZhdGUga2V5XG4gICAqXG4gICAqIEByZXR1cm5zIEFkZHJlc3Mgb2YgdGhlIG5ldyBrZXkgcGFpclxuICAgKi9cbiAgaW1wb3J0S2V5OiAocHJpdms6IEJ1ZmZlciB8IHN0cmluZykgPT4gU0VDUEtQQ2xhc3Ncbn1cbiJdfQ==