"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyChain = exports.KeyPair = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-KeyChain
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const secp256k1_1 = require("../../common/secp256k1");
const utils_1 = require("../../utils");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = utils_1.Serialization.getInstance();
/**
 * Class for representing a private and public keypair on the Platform Chain.
 */
class KeyPair extends secp256k1_1.SECP256k1KeyPair {
    clone() {
        let newkp = new KeyPair(this.hrp, this.chainID);
        newkp.importKey(bintools.copyFrom(this.getPrivateKey()));
        return newkp;
    }
    create(...args) {
        if (args.length == 2) {
            return new KeyPair(args[0], args[1]);
        }
        return new KeyPair(this.hrp, this.chainID);
    }
}
exports.KeyPair = KeyPair;
/**
 * Class for representing a key chain in Avalanche.
 *
 * @typeparam KeyPair Class extending [[KeyPair]] which is used as the key in [[KeyChain]]
 */
class KeyChain extends secp256k1_1.SECP256k1KeyChain {
    /**
     * Returns instance of KeyChain.
     */
    constructor(hrp, chainID) {
        super();
        this.hrp = "";
        this.chainID = "";
        /**
         * Makes a new key pair, returns the address.
         *
         * @returns The new key pair
         */
        this.makeKey = () => {
            let keypair = new KeyPair(this.hrp, this.chainID);
            this.addKey(keypair);
            return keypair;
        };
        this.addKey = (newKey) => {
            newKey.setChainID(this.chainID);
            super.addKey(newKey);
        };
        /**
         * Given a private key, makes a new key pair, returns the address.
         *
         * @param privk A {@link https://github.com/feross/buffer|Buffer} or cb58 serialized string representing the private key
         *
         * @returns The new key pair
         */
        this.importKey = (privk) => {
            let keypair = new KeyPair(this.hrp, this.chainID);
            let pk;
            if (typeof privk == "string") {
                if (privk.startsWith(utils_1.PrivateKeyPrefix)) {
                    pk = bintools.cb58Decode(privk.split("-")[1]);
                }
                else if (privk.startsWith(utils_1.PublicKeyPrefix)) {
                    pk = buffer_1.Buffer.from(privk.split("-")[1], "hex");
                }
            }
            else {
                pk = bintools.copyFrom(privk);
            }
            keypair.importKey(pk);
            if (!(keypair.getAddress().toString("hex") in this.keys)) {
                this.addKey(keypair);
            }
            return keypair;
        };
        this.hrp = hrp;
        this.chainID = chainID;
    }
    create(...args) {
        if (args.length == 2) {
            return new KeyChain(args[0], args[1]);
        }
        return new KeyChain(this.hrp, this.chainID);
    }
    clone() {
        const newkc = new KeyChain(this.hrp, this.chainID);
        for (let k in this.keys) {
            newkc.addKey(this.keys[`${k}`].clone());
        }
        return newkc;
    }
    union(kc) {
        let newkc = kc.clone();
        for (let k in this.keys) {
            newkc.addKey(this.keys[`${k}`].clone());
        }
        return newkc;
    }
}
exports.KeyChain = KeyChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Y2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2tleWNoYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxvRUFBMkM7QUFDM0Msc0RBQTRFO0FBQzVFLHVDQUE4RjtBQUU5Rjs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLHFCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFaEU7O0dBRUc7QUFDSCxNQUFhLE9BQVEsU0FBUSw0QkFBZ0I7SUFDM0MsS0FBSztRQUNILElBQUksS0FBSyxHQUFZLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3hELEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3hELE9BQU8sS0FBYSxDQUFBO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxJQUFXO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7WUFDcEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFTLENBQUE7U0FDN0M7UUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBUyxDQUFBO0lBQ3BELENBQUM7Q0FDRjtBQWJELDBCQWFDO0FBRUQ7Ozs7R0FJRztBQUNILE1BQWEsUUFBUyxTQUFRLDZCQUEwQjtJQXFFdEQ7O09BRUc7SUFDSCxZQUFZLEdBQVcsRUFBRSxPQUFlO1FBQ3RDLEtBQUssRUFBRSxDQUFBO1FB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QyxLQUFLLEVBQUUsQ0FBQTtRQUNoQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1NBQ3hDO1FBQ0QsT0FBTyxLQUFhLENBQUE7SUFDdEIsQ0FBQztDQVVGO0FBN0VELDRCQTZFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKiBAbW9kdWxlIEFQSS1QbGF0Zm9ybVZNLUtleUNoYWluXG4gKi9cbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vLi4vdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0IHsgU0VDUDI1NmsxS2V5Q2hhaW4sIFNFQ1AyNTZrMUtleVBhaXIgfSBmcm9tIFwiLi4vLi4vY29tbW9uL3NlY3AyNTZrMVwiXG5pbXBvcnQgeyBQdWJsaWNLZXlQcmVmaXgsIFByaXZhdGVLZXlQcmVmaXgsIFNlcmlhbGl6YXRpb24sIFNlcmlhbGl6ZWRUeXBlIH0gZnJvbSBcIi4uLy4uL3V0aWxzXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcblxuLyoqXG4gKiBDbGFzcyBmb3IgcmVwcmVzZW50aW5nIGEgcHJpdmF0ZSBhbmQgcHVibGljIGtleXBhaXIgb24gdGhlIFBsYXRmb3JtIENoYWluLlxuICovXG5leHBvcnQgY2xhc3MgS2V5UGFpciBleHRlbmRzIFNFQ1AyNTZrMUtleVBhaXIge1xuICBjbG9uZSgpOiB0aGlzIHtcbiAgICBsZXQgbmV3a3A6IEtleVBhaXIgPSBuZXcgS2V5UGFpcih0aGlzLmhycCwgdGhpcy5jaGFpbklEKVxuICAgIG5ld2twLmltcG9ydEtleShiaW50b29scy5jb3B5RnJvbSh0aGlzLmdldFByaXZhdGVLZXkoKSkpXG4gICAgcmV0dXJuIG5ld2twIGFzIHRoaXNcbiAgfVxuXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAyKSB7XG4gICAgICByZXR1cm4gbmV3IEtleVBhaXIoYXJnc1swXSwgYXJnc1sxXSkgYXMgdGhpc1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEtleVBhaXIodGhpcy5ocnAsIHRoaXMuY2hhaW5JRCkgYXMgdGhpc1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIGtleSBjaGFpbiBpbiBBdmFsYW5jaGUuXG4gKlxuICogQHR5cGVwYXJhbSBLZXlQYWlyIENsYXNzIGV4dGVuZGluZyBbW0tleVBhaXJdXSB3aGljaCBpcyB1c2VkIGFzIHRoZSBrZXkgaW4gW1tLZXlDaGFpbl1dXG4gKi9cbmV4cG9ydCBjbGFzcyBLZXlDaGFpbiBleHRlbmRzIFNFQ1AyNTZrMUtleUNoYWluPEtleVBhaXI+IHtcbiAgaHJwOiBzdHJpbmcgPSBcIlwiXG4gIGNoYWluSUQ6IHN0cmluZyA9IFwiXCJcblxuICAvKipcbiAgICogTWFrZXMgYSBuZXcga2V5IHBhaXIsIHJldHVybnMgdGhlIGFkZHJlc3MuXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBuZXcga2V5IHBhaXJcbiAgICovXG4gIG1ha2VLZXkgPSAoKTogS2V5UGFpciA9PiB7XG4gICAgbGV0IGtleXBhaXI6IEtleVBhaXIgPSBuZXcgS2V5UGFpcih0aGlzLmhycCwgdGhpcy5jaGFpbklEKVxuICAgIHRoaXMuYWRkS2V5KGtleXBhaXIpXG4gICAgcmV0dXJuIGtleXBhaXJcbiAgfVxuXG4gIGFkZEtleSA9IChuZXdLZXk6IEtleVBhaXIpID0+IHtcbiAgICBuZXdLZXkuc2V0Q2hhaW5JRCh0aGlzLmNoYWluSUQpXG4gICAgc3VwZXIuYWRkS2V5KG5ld0tleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIHByaXZhdGUga2V5LCBtYWtlcyBhIG5ldyBrZXkgcGFpciwgcmV0dXJucyB0aGUgYWRkcmVzcy5cbiAgICpcbiAgICogQHBhcmFtIHByaXZrIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gb3IgY2I1OCBzZXJpYWxpemVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaXZhdGUga2V5XG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBuZXcga2V5IHBhaXJcbiAgICovXG4gIGltcG9ydEtleSA9IChwcml2azogQnVmZmVyIHwgc3RyaW5nKTogS2V5UGFpciA9PiB7XG4gICAgbGV0IGtleXBhaXI6IEtleVBhaXIgPSBuZXcgS2V5UGFpcih0aGlzLmhycCwgdGhpcy5jaGFpbklEKVxuICAgIGxldCBwazogQnVmZmVyXG4gICAgaWYgKHR5cGVvZiBwcml2ayA9PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAocHJpdmsuc3RhcnRzV2l0aChQcml2YXRlS2V5UHJlZml4KSkge1xuICAgICAgICBwayA9IGJpbnRvb2xzLmNiNThEZWNvZGUocHJpdmsuc3BsaXQoXCItXCIpWzFdKTtcbiAgICAgIH0gZWxzZSBpZiAocHJpdmsuc3RhcnRzV2l0aChQdWJsaWNLZXlQcmVmaXgpKSB7XG4gICAgICAgIHBrID0gQnVmZmVyLmZyb20ocHJpdmsuc3BsaXQoXCItXCIpWzFdLCBcImhleFwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICBwayA9IGJpbnRvb2xzLmNvcHlGcm9tKHByaXZrIGFzIEJ1ZmZlcik7XG4gICAgfVxuICAgIGtleXBhaXIuaW1wb3J0S2V5KHBrKVxuICAgIGlmICghKGtleXBhaXIuZ2V0QWRkcmVzcygpLnRvU3RyaW5nKFwiaGV4XCIpIGluIHRoaXMua2V5cykpIHtcbiAgICAgIHRoaXMuYWRkS2V5KGtleXBhaXIpXG4gICAgfVxuICAgIHJldHVybiBrZXlwYWlyXG4gIH1cblxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPT0gMikge1xuICAgICAgcmV0dXJuIG5ldyBLZXlDaGFpbihhcmdzWzBdLCBhcmdzWzFdKSBhcyB0aGlzXG4gICAgfVxuICAgIHJldHVybiBuZXcgS2V5Q2hhaW4odGhpcy5ocnAsIHRoaXMuY2hhaW5JRCkgYXMgdGhpc1xuICB9XG5cbiAgY2xvbmUoKTogdGhpcyB7XG4gICAgY29uc3QgbmV3a2M6IEtleUNoYWluID0gbmV3IEtleUNoYWluKHRoaXMuaHJwLCB0aGlzLmNoYWluSUQpXG4gICAgZm9yIChsZXQgayBpbiB0aGlzLmtleXMpIHtcbiAgICAgIG5ld2tjLmFkZEtleSh0aGlzLmtleXNbYCR7a31gXS5jbG9uZSgpKVxuICAgIH1cbiAgICByZXR1cm4gbmV3a2MgYXMgdGhpc1xuICB9XG5cbiAgdW5pb24oa2M6IHRoaXMpOiB0aGlzIHtcbiAgICBsZXQgbmV3a2M6IEtleUNoYWluID0ga2MuY2xvbmUoKVxuICAgIGZvciAobGV0IGsgaW4gdGhpcy5rZXlzKSB7XG4gICAgICBuZXdrYy5hZGRLZXkodGhpcy5rZXlzW2Ake2t9YF0uY2xvbmUoKSlcbiAgICB9XG4gICAgcmV0dXJuIG5ld2tjIGFzIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGluc3RhbmNlIG9mIEtleUNoYWluLlxuICAgKi9cbiAgY29uc3RydWN0b3IoaHJwOiBzdHJpbmcsIGNoYWluSUQ6IHN0cmluZykge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmhycCA9IGhycFxuICAgIHRoaXMuY2hhaW5JRCA9IGNoYWluSURcbiAgfVxufVxuIl19