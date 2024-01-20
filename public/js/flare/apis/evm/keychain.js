"use strict";
/**
 * @packageDocumentation
 * @module API-EVM-KeyChain
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyChain = exports.KeyPair = void 0;
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
 * Class for representing a private and public keypair on an AVM Chain.
 */
class KeyPair extends secp256k1_1.SECP256k1KeyPair {
    clone() {
        const newkp = new KeyPair(this.hrp, this.chainID);
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
 * @typeparam KeyPair Class extending [[SECP256k1KeyChain]] which is used as the key in [[KeyChain]]
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
            const keypair = new KeyPair(this.hrp, this.chainID);
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
         * @param privk A {@link https://github.com/feross/buffer|Buffer}
         * or cb58 serialized string representing the private key
         *
         * @returns The new key pair
         */
        this.importKey = (privk) => {
            const keypair = new KeyPair(this.hrp, this.chainID);
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
        const newkc = kc.clone();
        for (let k in this.keys) {
            newkc.addKey(this.keys[`${k}`].clone());
        }
        return newkc;
    }
}
exports.KeyChain = KeyChain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Y2hhaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9ldm0va2V5Y2hhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRzs7Ozs7O0FBRUgsb0NBQWdDO0FBQ2hDLG9FQUEyQztBQUMzQyxzREFBNEU7QUFDNUUsdUNBQThGO0FBRTlGOztHQUVHO0FBQ0gsTUFBTSxRQUFRLEdBQWEsa0JBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUNqRCxNQUFNLGFBQWEsR0FBa0IscUJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtBQUVoRTs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLDRCQUFnQjtJQUMzQyxLQUFLO1FBQ0gsTUFBTSxLQUFLLEdBQVksSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDMUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDeEQsT0FBTyxLQUFhLENBQUE7SUFDdEIsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHLElBQVc7UUFDbkIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUNwQixPQUFPLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQVMsQ0FBQTtTQUM3QztRQUNELE9BQU8sSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFTLENBQUE7SUFDcEQsQ0FBQztDQUNGO0FBYkQsMEJBYUM7QUFFRDs7OztHQUlHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsNkJBQTBCO0lBc0V0RDs7T0FFRztJQUNILFlBQVksR0FBVyxFQUFFLE9BQWU7UUFDdEMsS0FBSyxFQUFFLENBQUE7UUF6RVQsUUFB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LEVBQUUsQ0FBQTtRQUNsQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1NBQ3hDO1FBQ0QsT0FBTyxLQUFhLENBQUE7SUFDdEIsQ0FBQztDQVVGO0FBOUVELDRCQThFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXG4gKiBAbW9kdWxlIEFQSS1FVk0tS2V5Q2hhaW5cbiAqL1xuXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCB7IFNFQ1AyNTZrMUtleUNoYWluLCBTRUNQMjU2azFLZXlQYWlyIH0gZnJvbSBcIi4uLy4uL2NvbW1vbi9zZWNwMjU2azFcIlxuaW1wb3J0IHsgU2VyaWFsaXphdGlvbiwgU2VyaWFsaXplZFR5cGUsIFByaXZhdGVLZXlQcmVmaXgsIFB1YmxpY0tleVByZWZpeCB9IGZyb20gXCIuLi8uLi91dGlsc1wiXG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5jb25zdCBzZXJpYWxpemF0aW9uOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXG5cbi8qKlxuICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIHByaXZhdGUgYW5kIHB1YmxpYyBrZXlwYWlyIG9uIGFuIEFWTSBDaGFpbi5cbiAqL1xuZXhwb3J0IGNsYXNzIEtleVBhaXIgZXh0ZW5kcyBTRUNQMjU2azFLZXlQYWlyIHtcbiAgY2xvbmUoKTogdGhpcyB7XG4gICAgY29uc3QgbmV3a3A6IEtleVBhaXIgPSBuZXcgS2V5UGFpcih0aGlzLmhycCwgdGhpcy5jaGFpbklEKVxuICAgIG5ld2twLmltcG9ydEtleShiaW50b29scy5jb3B5RnJvbSh0aGlzLmdldFByaXZhdGVLZXkoKSkpXG4gICAgcmV0dXJuIG5ld2twIGFzIHRoaXNcbiAgfVxuXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAyKSB7XG4gICAgICByZXR1cm4gbmV3IEtleVBhaXIoYXJnc1swXSwgYXJnc1sxXSkgYXMgdGhpc1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEtleVBhaXIodGhpcy5ocnAsIHRoaXMuY2hhaW5JRCkgYXMgdGhpc1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIHJlcHJlc2VudGluZyBhIGtleSBjaGFpbiBpbiBBdmFsYW5jaGUuXG4gKlxuICogQHR5cGVwYXJhbSBLZXlQYWlyIENsYXNzIGV4dGVuZGluZyBbW1NFQ1AyNTZrMUtleUNoYWluXV0gd2hpY2ggaXMgdXNlZCBhcyB0aGUga2V5IGluIFtbS2V5Q2hhaW5dXVxuICovXG5leHBvcnQgY2xhc3MgS2V5Q2hhaW4gZXh0ZW5kcyBTRUNQMjU2azFLZXlDaGFpbjxLZXlQYWlyPiB7XG4gIGhycDogc3RyaW5nID0gXCJcIlxuICBjaGFpbklEOiBzdHJpbmcgPSBcIlwiXG5cbiAgLyoqXG4gICAqIE1ha2VzIGEgbmV3IGtleSBwYWlyLCByZXR1cm5zIHRoZSBhZGRyZXNzLlxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbmV3IGtleSBwYWlyXG4gICAqL1xuICBtYWtlS2V5ID0gKCk6IEtleVBhaXIgPT4ge1xuICAgIGNvbnN0IGtleXBhaXI6IEtleVBhaXIgPSBuZXcgS2V5UGFpcih0aGlzLmhycCwgdGhpcy5jaGFpbklEKVxuICAgIHRoaXMuYWRkS2V5KGtleXBhaXIpXG4gICAgcmV0dXJuIGtleXBhaXJcbiAgfVxuXG4gIGFkZEtleSA9IChuZXdLZXk6IEtleVBhaXIpID0+IHtcbiAgICBuZXdLZXkuc2V0Q2hhaW5JRCh0aGlzLmNoYWluSUQpXG4gICAgc3VwZXIuYWRkS2V5KG5ld0tleSlcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlbiBhIHByaXZhdGUga2V5LCBtYWtlcyBhIG5ldyBrZXkgcGFpciwgcmV0dXJucyB0aGUgYWRkcmVzcy5cbiAgICpcbiAgICogQHBhcmFtIHByaXZrIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn1cbiAgICogb3IgY2I1OCBzZXJpYWxpemVkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIHByaXZhdGUga2V5XG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBuZXcga2V5IHBhaXJcbiAgICovXG4gIGltcG9ydEtleSA9IChwcml2azogQnVmZmVyIHwgc3RyaW5nKTogS2V5UGFpciA9PiB7XG4gICAgY29uc3Qga2V5cGFpcjogS2V5UGFpciA9IG5ldyBLZXlQYWlyKHRoaXMuaHJwLCB0aGlzLmNoYWluSUQpXG4gICAgbGV0IHBrOiBCdWZmZXJcbiAgICBpZiAodHlwZW9mIHByaXZrID09IFwic3RyaW5nXCIpIHtcbiAgICAgIGlmIChwcml2ay5zdGFydHNXaXRoKFByaXZhdGVLZXlQcmVmaXgpKSB7XG4gICAgICAgIHBrID0gYmludG9vbHMuY2I1OERlY29kZShwcml2ay5zcGxpdChcIi1cIilbMV0pO1xuICAgICAgfSBlbHNlIGlmIChwcml2ay5zdGFydHNXaXRoKFB1YmxpY0tleVByZWZpeCkpIHtcbiAgICAgICAgcGsgPSBCdWZmZXIuZnJvbShwcml2ay5zcGxpdChcIi1cIilbMV0sIFwiaGV4XCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHBrID0gYmludG9vbHMuY29weUZyb20ocHJpdmsgYXMgQnVmZmVyKTtcbiAgICB9XG4gICAga2V5cGFpci5pbXBvcnRLZXkocGspXG4gICAgaWYgKCEoa2V5cGFpci5nZXRBZGRyZXNzKCkudG9TdHJpbmcoXCJoZXhcIikgaW4gdGhpcy5rZXlzKSkge1xuICAgICAgdGhpcy5hZGRLZXkoa2V5cGFpcilcbiAgICB9XG4gICAgcmV0dXJuIGtleXBhaXJcbiAgfVxuXG4gIGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXMge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PSAyKSB7XG4gICAgICByZXR1cm4gbmV3IEtleUNoYWluKGFyZ3NbMF0sIGFyZ3NbMV0pIGFzIHRoaXNcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBLZXlDaGFpbih0aGlzLmhycCwgdGhpcy5jaGFpbklEKSBhcyB0aGlzXG4gIH1cblxuICBjbG9uZSgpOiB0aGlzIHtcbiAgICBjb25zdCBuZXdrYzogS2V5Q2hhaW4gPSBuZXcgS2V5Q2hhaW4odGhpcy5ocnAsIHRoaXMuY2hhaW5JRClcbiAgICBmb3IgKGxldCBrIGluIHRoaXMua2V5cykge1xuICAgICAgbmV3a2MuYWRkS2V5KHRoaXMua2V5c1tgJHtrfWBdLmNsb25lKCkpXG4gICAgfVxuICAgIHJldHVybiBuZXdrYyBhcyB0aGlzXG4gIH1cblxuICB1bmlvbihrYzogdGhpcyk6IHRoaXMge1xuICAgIGNvbnN0IG5ld2tjOiBLZXlDaGFpbiA9IGtjLmNsb25lKClcbiAgICBmb3IgKGxldCBrIGluIHRoaXMua2V5cykge1xuICAgICAgbmV3a2MuYWRkS2V5KHRoaXMua2V5c1tgJHtrfWBdLmNsb25lKCkpXG4gICAgfVxuICAgIHJldHVybiBuZXdrYyBhcyB0aGlzXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBpbnN0YW5jZSBvZiBLZXlDaGFpbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGhycDogc3RyaW5nLCBjaGFpbklEOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpXG4gICAgdGhpcy5ocnAgPSBocnBcbiAgICB0aGlzLmNoYWluSUQgPSBjaGFpbklEXG4gIH1cbn1cbiJdfQ==