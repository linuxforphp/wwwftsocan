"use strict";
/**
 * @packageDocumentation
 * @module Common-Transactions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVMStandardTx = exports.EVMStandardUnsignedTx = exports.EVMStandardBaseTx = void 0;
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const input_1 = require("./input");
const output_1 = require("./output");
const constants_1 = require("../utils/constants");
const serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serializer = serialization_1.Serialization.getInstance();
/**
 * Class representing a base for all transactions.
 */
class EVMStandardBaseTx extends serialization_1.Serializable {
    /**
     * Class representing a StandardBaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     */
    constructor(networkID = constants_1.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16)) {
        super();
        this._typeName = "EVMStandardBaseTx";
        this._typeID = undefined;
        this.networkID = buffer_1.Buffer.alloc(4);
        this.blockchainID = buffer_1.Buffer.alloc(32);
        this.networkID.writeUInt32BE(networkID, 0);
        this.blockchainID = blockchainID;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { networkID: serializer.encoder(this.networkID, encoding, "Buffer", "decimalString"), blockchainID: serializer.encoder(this.blockchainID, encoding, "Buffer", "cb58") });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.networkID = serializer.decoder(fields["networkID"], encoding, "decimalString", "Buffer", 4);
        this.blockchainID = serializer.decoder(fields["blockchainID"], encoding, "cb58", "Buffer", 32);
    }
    /**
     * Returns the NetworkID as a number
     */
    getNetworkID() {
        return this.networkID.readUInt32BE(0);
    }
    /**
     * Returns the Buffer representation of the BlockchainID
     */
    getBlockchainID() {
        return this.blockchainID;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardBaseTx]].
     */
    toBuffer() {
        let bsize = this.networkID.length + this.blockchainID.length;
        const barr = [this.networkID, this.blockchainID];
        const buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    }
    /**
     * Returns a base-58 representation of the [[StandardBaseTx]].
     */
    toString() {
        return bintools.bufferToB58(this.toBuffer());
    }
}
exports.EVMStandardBaseTx = EVMStandardBaseTx;
/**
 * Class representing an unsigned transaction.
 */
class EVMStandardUnsignedTx extends serialization_1.Serializable {
    constructor(transaction = undefined, codecID = 0) {
        super();
        this._typeName = "StandardUnsignedTx";
        this._typeID = undefined;
        this.codecID = 0;
        this.codecID = codecID;
        this.transaction = transaction;
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { codecID: serializer.encoder(this.codecID, encoding, "number", "decimalString", 2), transaction: this.transaction.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.codecID = serializer.decoder(fields["codecID"], encoding, "decimalString", "number");
    }
    /**
     * Returns the CodecID as a number
     */
    getCodecID() {
        return this.codecID;
    }
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the CodecID
     */
    getCodecIDBuffer() {
        let codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.codecID, 0);
        return codecBuf;
    }
    /**
     * Returns the inputTotal as a BN
     */
    getInputTotal(assetID) {
        const ins = [];
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        ins.forEach((input) => {
            // only check StandardAmountInputs
            if (input.getInput() instanceof input_1.StandardAmountInput &&
                aIDHex === input.getAssetID().toString("hex")) {
                const i = input.getInput();
                total = total.add(i.getAmount());
            }
        });
        return total;
    }
    /**
     * Returns the outputTotal as a BN
     */
    getOutputTotal(assetID) {
        const outs = [];
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        outs.forEach((out) => {
            // only check StandardAmountOutput
            if (out.getOutput() instanceof output_1.StandardAmountOutput &&
                aIDHex === out.getAssetID().toString("hex")) {
                const output = out.getOutput();
                total = total.add(output.getAmount());
            }
        });
        return total;
    }
    /**
     * Returns the number of burned tokens as a BN
     */
    getBurn(assetID) {
        return this.getInputTotal(assetID).sub(this.getOutputTotal(assetID));
    }
    toBuffer() {
        const codecID = this.getCodecIDBuffer();
        const txtype = buffer_1.Buffer.alloc(4);
        txtype.writeUInt32BE(this.transaction.getTxType(), 0);
        const basebuff = this.transaction.toBuffer();
        return buffer_1.Buffer.concat([codecID, txtype, basebuff], codecID.length + txtype.length + basebuff.length);
    }
}
exports.EVMStandardUnsignedTx = EVMStandardUnsignedTx;
/**
 * Class representing a signed transaction.
 */
class EVMStandardTx extends serialization_1.Serializable {
    /**
     * Class representing a signed transaction.
     *
     * @param unsignedTx Optional [[StandardUnsignedTx]]
     * @param signatures Optional array of [[Credential]]s
     */
    constructor(unsignedTx = undefined, credentials = undefined) {
        super();
        this._typeName = "StandardTx";
        this._typeID = undefined;
        this.unsignedTx = undefined;
        this.credentials = [];
        if (typeof unsignedTx !== "undefined") {
            this.unsignedTx = unsignedTx;
            if (typeof credentials !== "undefined") {
                this.credentials = credentials;
            }
        }
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { unsignedTx: this.unsignedTx.serialize(encoding), credentials: this.credentials.map((c) => c.serialize(encoding)) });
    }
    /**
     * Returns the [[StandardUnsignedTx]]
     */
    getUnsignedTx() {
        return this.unsignedTx;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardTx]].
     */
    toBuffer() {
        const txbuff = this.unsignedTx.toBuffer();
        let bsize = txbuff.length;
        const credlen = buffer_1.Buffer.alloc(4);
        credlen.writeUInt32BE(this.credentials.length, 0);
        const barr = [txbuff, credlen];
        bsize += credlen.length;
        this.credentials.forEach((credential) => {
            const credid = buffer_1.Buffer.alloc(4);
            credid.writeUInt32BE(credential.getCredentialID(), 0);
            barr.push(credid);
            bsize += credid.length;
            const credbuff = credential.toBuffer();
            bsize += credbuff.length;
            barr.push(credbuff);
        });
        const buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    }
    /**
     * Takes a base-58 string containing an [[StandardTx]], parses it, populates the class, and returns the length of the Tx in bytes.
     *
     * @param serialized A base-58 string containing a raw [[StandardTx]]
     *
     * @returns The length of the raw [[StandardTx]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    fromString(serialized) {
        return this.fromBuffer(bintools.cb58Decode(serialized));
    }
    /**
     * Returns a cb58 representation of the [[StandardTx]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    toString() {
        return bintools.cb58Encode(this.toBuffer());
    }
    toStringHex() {
        return `0x${bintools.addChecksum(this.toBuffer()).toString("hex")}`;
    }
}
exports.EVMStandardTx = EVMStandardTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZtdHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29tbW9uL2V2bXR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7Ozs7OztBQUVILG9DQUFnQztBQUNoQyxpRUFBd0M7QUFFeEMsa0RBQXNCO0FBRXRCLG1DQUF3RTtBQUN4RSxxQ0FBMkU7QUFDM0Usa0RBQXFEO0FBQ3JELDBEQUkrQjtBQUUvQjs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxVQUFVLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFN0Q7O0dBRUc7QUFDSCxNQUFzQixpQkFHcEIsU0FBUSw0QkFBWTtJQXNGcEI7Ozs7Ozs7T0FPRztJQUNILFlBQ0UsWUFBb0IsNEJBQWdCLEVBQ3BDLGVBQXVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztRQUUzQyxLQUFLLEVBQUUsQ0FBQTtRQWpHQyxjQUFTLEdBQUcsbUJBQW1CLENBQUE7UUFDL0IsWUFBTyxHQUFHLFNBQVMsQ0FBQTtRQXVDbkIsY0FBUyxHQUFXLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkMsaUJBQVksR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBeUQvQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDMUMsSUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUE7SUFDbEMsQ0FBQztJQWpHRCxTQUFTLENBQUMsV0FBK0IsS0FBSztRQUM1QyxJQUFJLE1BQU0sR0FBVyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzlDLHVDQUNLLE1BQU0sS0FDVCxTQUFTLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FDM0IsSUFBSSxDQUFDLFNBQVMs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LENBQUMsRUFBRSxDQUFBO0lBQ3JFLENBQUM7Q0FvQkY7QUF0R0Qsc0NBc0dDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqIEBtb2R1bGUgQ29tbW9uLVRyYW5zYWN0aW9uc1xuICovXG5cbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0IHsgQ3JlZGVudGlhbCB9IGZyb20gXCIuL2NyZWRlbnRpYWxzXCJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxuaW1wb3J0IHsgU3RhbmRhcmRLZXlDaGFpbiwgU3RhbmRhcmRLZXlQYWlyIH0gZnJvbSBcIi4va2V5Y2hhaW5cIlxuaW1wb3J0IHsgU3RhbmRhcmRBbW91bnRJbnB1dCwgU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dCB9IGZyb20gXCIuL2lucHV0XCJcbmltcG9ydCB7IFN0YW5kYXJkQW1vdW50T3V0cHV0LCBTdGFuZGFyZFRyYW5zZmVyYWJsZU91dHB1dCB9IGZyb20gXCIuL291dHB1dFwiXG5pbXBvcnQgeyBEZWZhdWx0TmV0d29ya0lEIH0gZnJvbSBcIi4uL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQge1xuICBTZXJpYWxpemFibGUsXG4gIFNlcmlhbGl6YXRpb24sXG4gIFNlcmlhbGl6ZWRFbmNvZGluZ1xufSBmcm9tIFwiLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXG5cbi8qKlxuICogQGlnbm9yZVxuICovXG5jb25zdCBiaW50b29sczogQmluVG9vbHMgPSBCaW5Ub29scy5nZXRJbnN0YW5jZSgpXG5jb25zdCBzZXJpYWxpemVyOiBTZXJpYWxpemF0aW9uID0gU2VyaWFsaXphdGlvbi5nZXRJbnN0YW5jZSgpXG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgYmFzZSBmb3IgYWxsIHRyYW5zYWN0aW9ucy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEVWTVN0YW5kYXJkQmFzZVR4PFxuICBLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyLFxuICBLQ0NsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlDaGFpbjxLUENsYXNzPlxuPiBleHRlbmRzIFNlcmlhbGl6YWJsZSB7XG4gIHByb3RlY3RlZCBfdHlwZU5hbWUgPSBcIkVWTVN0YW5kYXJkQmFzZVR4XCJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcblxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmllbGRzLFxuICAgICAgbmV0d29ya0lEOiBzZXJpYWxpemVyLmVuY29kZXIoXG4gICAgICAgIHRoaXMubmV0d29ya0lELFxuICAgICAgICBlbmNvZGluZyxcbiAgICAgICAgXCJCdWZmZXJcIixcbiAgICAgICAgXCJkZWNpbWFsU3RyaW5nXCJcbiAgICAgICksXG4gICAgICBibG9ja2NoYWluSUQ6IHNlcmlhbGl6ZXIuZW5jb2RlcihcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluSUQsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBcIkJ1ZmZlclwiLFxuICAgICAgICBcImNiNThcIlxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXG4gICAgdGhpcy5uZXR3b3JrSUQgPSBzZXJpYWxpemVyLmRlY29kZXIoXG4gICAgICBmaWVsZHNbXCJuZXR3b3JrSURcIl0sXG4gICAgICBlbmNvZGluZyxcbiAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxuICAgICAgXCJCdWZmZXJcIixcbiAgICAgIDRcbiAgICApXG4gICAgdGhpcy5ibG9ja2NoYWluSUQgPSBzZXJpYWxpemVyLmRlY29kZXIoXG4gICAgICBmaWVsZHNbXCJibG9ja2NoYWluSURcIl0sXG4gICAgICBlbmNvZGluZyxcbiAgICAgIFwiY2I1OFwiLFxuICAgICAgXCJCdWZmZXJcIixcbiAgICAgIDMyXG4gICAgKVxuICB9XG5cbiAgcHJvdGVjdGVkIG5ldHdvcmtJRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gIHByb3RlY3RlZCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXVxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0VHhUeXBlKCk6IG51bWJlclxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBOZXR3b3JrSUQgYXMgYSBudW1iZXJcbiAgICovXG4gIGdldE5ldHdvcmtJRCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm5ldHdvcmtJRC5yZWFkVUludDMyQkUoMClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBCdWZmZXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIEJsb2NrY2hhaW5JRFxuICAgKi9cbiAgZ2V0QmxvY2tjaGFpbklEKCk6IEJ1ZmZlciB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tjaGFpbklEXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW1N0YW5kYXJkQmFzZVR4XV0uXG4gICAqL1xuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xuICAgIGxldCBic2l6ZTogbnVtYmVyID0gdGhpcy5uZXR3b3JrSUQubGVuZ3RoICsgdGhpcy5ibG9ja2NoYWluSUQubGVuZ3RoXG4gICAgY29uc3QgYmFycjogQnVmZmVyW10gPSBbdGhpcy5uZXR3b3JrSUQsIHRoaXMuYmxvY2tjaGFpbklEXVxuICAgIGNvbnN0IGJ1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoYmFyciwgYnNpemUpXG4gICAgcmV0dXJuIGJ1ZmZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYmFzZS01OCByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tTdGFuZGFyZEJhc2VUeF1dLlxuICAgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYmludG9vbHMuYnVmZmVyVG9CNTgodGhpcy50b0J1ZmZlcigpKVxuICB9XG5cbiAgYWJzdHJhY3QgY2xvbmUoKTogdGhpc1xuXG4gIGFic3RyYWN0IGNyZWF0ZSguLi5hcmdzOiBhbnlbXSk6IHRoaXNcblxuICBhYnN0cmFjdCBzZWxlY3QoaWQ6IG51bWJlciwgLi4uYXJnczogYW55W10pOiB0aGlzXG5cbiAgLyoqXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhIFN0YW5kYXJkQmFzZVR4IHdoaWNoIGlzIHRoZSBmb3VuZGF0aW9uIGZvciBhbGwgdHJhbnNhY3Rpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE9wdGlvbmFsIG5ldHdvcmtJRCwgW1tEZWZhdWx0TmV0d29ya0lEXV1cbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbCBibG9ja2NoYWluSUQsIGRlZmF1bHQgQnVmZmVyLmFsbG9jKDMyLCAxNilcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zXG4gICAqIEBwYXJhbSBpbnMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpXG4gICkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm5ldHdvcmtJRC53cml0ZVVJbnQzMkJFKG5ldHdvcmtJRCwgMClcbiAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IGJsb2NrY2hhaW5JRFxuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRVZNU3RhbmRhcmRVbnNpZ25lZFR4PFxuICBLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyLFxuICBLQ0NsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlDaGFpbjxLUENsYXNzPixcbiAgU0JUeCBleHRlbmRzIEVWTVN0YW5kYXJkQmFzZVR4PEtQQ2xhc3MsIEtDQ2xhc3M+XG4+IGV4dGVuZHMgU2VyaWFsaXphYmxlIHtcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiU3RhbmRhcmRVbnNpZ25lZFR4XCJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcblxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmllbGRzLFxuICAgICAgY29kZWNJRDogc2VyaWFsaXplci5lbmNvZGVyKFxuICAgICAgICB0aGlzLmNvZGVjSUQsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBcIm51bWJlclwiLFxuICAgICAgICBcImRlY2ltYWxTdHJpbmdcIixcbiAgICAgICAgMlxuICAgICAgKSxcbiAgICAgIHRyYW5zYWN0aW9uOiB0aGlzLnRyYW5zYWN0aW9uLnNlcmlhbGl6ZShlbmNvZGluZylcbiAgICB9XG4gIH1cblxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxuICAgIHRoaXMuY29kZWNJRCA9IHNlcmlhbGl6ZXIuZGVjb2RlcihcbiAgICAgIGZpZWxkc1tcImNvZGVjSURcIl0sXG4gICAgICBlbmNvZGluZyxcbiAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxuICAgICAgXCJudW1iZXJcIlxuICAgIClcbiAgfVxuXG4gIHByb3RlY3RlZCBjb2RlY0lEOiBudW1iZXIgPSAwXG4gIHByb3RlY3RlZCB0cmFuc2FjdGlvbjogU0JUeFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBDb2RlY0lEIGFzIGEgbnVtYmVyXG4gICAqL1xuICBnZXRDb2RlY0lEKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuY29kZWNJRFxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBDb2RlY0lEXG4gICAqL1xuICBnZXRDb2RlY0lEQnVmZmVyKCk6IEJ1ZmZlciB7XG4gICAgbGV0IGNvZGVjQnVmOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMilcbiAgICBjb2RlY0J1Zi53cml0ZVVJbnQxNkJFKHRoaXMuY29kZWNJRCwgMClcbiAgICByZXR1cm4gY29kZWNCdWZcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpbnB1dFRvdGFsIGFzIGEgQk5cbiAgICovXG4gIGdldElucHV0VG90YWwoYXNzZXRJRDogQnVmZmVyKTogQk4ge1xuICAgIGNvbnN0IGluczogU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dFtdID0gW11cbiAgICBjb25zdCBhSURIZXg6IHN0cmluZyA9IGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcbiAgICBsZXQgdG90YWw6IEJOID0gbmV3IEJOKDApXG4gICAgaW5zLmZvckVhY2goKGlucHV0OiBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0KSA9PiB7XG4gICAgICAvLyBvbmx5IGNoZWNrIFN0YW5kYXJkQW1vdW50SW5wdXRzXG4gICAgICBpZiAoXG4gICAgICAgIGlucHV0LmdldElucHV0KCkgaW5zdGFuY2VvZiBTdGFuZGFyZEFtb3VudElucHV0ICYmXG4gICAgICAgIGFJREhleCA9PT0gaW5wdXQuZ2V0QXNzZXRJRCgpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgaSA9IGlucHV0LmdldElucHV0KCkgYXMgU3RhbmRhcmRBbW91bnRJbnB1dFxuICAgICAgICB0b3RhbCA9IHRvdGFsLmFkZChpLmdldEFtb3VudCgpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRvdGFsXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgb3V0cHV0VG90YWwgYXMgYSBCTlxuICAgKi9cbiAgZ2V0T3V0cHV0VG90YWwoYXNzZXRJRDogQnVmZmVyKTogQk4ge1xuICAgIGNvbnN0IG91dHM6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0W10gPSBbXVxuICAgIGNvbnN0IGFJREhleDogc3RyaW5nID0gYXNzZXRJRC50b1N0cmluZyhcImhleFwiKVxuICAgIGxldCB0b3RhbDogQk4gPSBuZXcgQk4oMClcblxuICAgIG91dHMuZm9yRWFjaCgob3V0OiBTdGFuZGFyZFRyYW5zZmVyYWJsZU91dHB1dCkgPT4ge1xuICAgICAgLy8gb25seSBjaGVjayBTdGFuZGFyZEFtb3VudE91dHB1dFxuICAgICAgaWYgKFxuICAgICAgICBvdXQuZ2V0T3V0cHV0KCkgaW5zdGFuY2VvZiBTdGFuZGFyZEFtb3VudE91dHB1dCAmJlxuICAgICAgICBhSURIZXggPT09IG91dC5nZXRBc3NldElEKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgICkge1xuICAgICAgICBjb25zdCBvdXRwdXQ6IFN0YW5kYXJkQW1vdW50T3V0cHV0ID1cbiAgICAgICAgICBvdXQuZ2V0T3V0cHV0KCkgYXMgU3RhbmRhcmRBbW91bnRPdXRwdXRcbiAgICAgICAgdG90YWwgPSB0b3RhbC5hZGQob3V0cHV0LmdldEFtb3VudCgpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRvdGFsXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGJ1cm5lZCB0b2tlbnMgYXMgYSBCTlxuICAgKi9cbiAgZ2V0QnVybihhc3NldElEOiBCdWZmZXIpOiBCTiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5wdXRUb3RhbChhc3NldElEKS5zdWIodGhpcy5nZXRPdXRwdXRUb3RhbChhc3NldElEKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBUcmFuc2FjdGlvblxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0VHJhbnNhY3Rpb24oKTogU0JUeFxuXG4gIGFic3RyYWN0IGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyXG5cbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcbiAgICBjb25zdCBjb2RlY0lEOiBCdWZmZXIgPSB0aGlzLmdldENvZGVjSURCdWZmZXIoKVxuICAgIGNvbnN0IHR4dHlwZTogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgdHh0eXBlLndyaXRlVUludDMyQkUodGhpcy50cmFuc2FjdGlvbi5nZXRUeFR5cGUoKSwgMClcbiAgICBjb25zdCBiYXNlYnVmZjogQnVmZmVyID0gdGhpcy50cmFuc2FjdGlvbi50b0J1ZmZlcigpXG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoXG4gICAgICBbY29kZWNJRCwgdHh0eXBlLCBiYXNlYnVmZl0sXG4gICAgICBjb2RlY0lELmxlbmd0aCArIHR4dHlwZS5sZW5ndGggKyBiYXNlYnVmZi5sZW5ndGhcbiAgICApXG4gIH1cblxuICAvKipcbiAgICogU2lnbnMgdGhpcyBbW1Vuc2lnbmVkVHhdXSBhbmQgcmV0dXJucyBzaWduZWQgW1tTdGFuZGFyZFR4XV1cbiAgICpcbiAgICogQHBhcmFtIGtjIEFuIFtbS2V5Q2hhaW5dXSB1c2VkIGluIHNpZ25pbmdcbiAgICpcbiAgICogQHJldHVybnMgQSBzaWduZWQgW1tTdGFuZGFyZFR4XV1cbiAgICovXG4gIGFic3RyYWN0IHNpZ24oXG4gICAga2M6IEtDQ2xhc3NcbiAgKTogRVZNU3RhbmRhcmRUeDxcbiAgICBLUENsYXNzLFxuICAgIEtDQ2xhc3MsXG4gICAgRVZNU3RhbmRhcmRVbnNpZ25lZFR4PEtQQ2xhc3MsIEtDQ2xhc3MsIFNCVHg+XG4gID5cblxuICBjb25zdHJ1Y3Rvcih0cmFuc2FjdGlvbjogU0JUeCA9IHVuZGVmaW5lZCwgY29kZWNJRDogbnVtYmVyID0gMCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLmNvZGVjSUQgPSBjb2RlY0lEXG4gICAgdGhpcy50cmFuc2FjdGlvbiA9IHRyYW5zYWN0aW9uXG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzaWduZWQgdHJhbnNhY3Rpb24uXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBFVk1TdGFuZGFyZFR4PFxuICBLUENsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlQYWlyLFxuICBLQ0NsYXNzIGV4dGVuZHMgU3RhbmRhcmRLZXlDaGFpbjxLUENsYXNzPixcbiAgU1VCVHggZXh0ZW5kcyBFVk1TdGFuZGFyZFVuc2lnbmVkVHg8XG4gICAgS1BDbGFzcyxcbiAgICBLQ0NsYXNzLFxuICAgIEVWTVN0YW5kYXJkQmFzZVR4PEtQQ2xhc3MsIEtDQ2xhc3M+XG4gID5cbj4gZXh0ZW5kcyBTZXJpYWxpemFibGUge1xuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJTdGFuZGFyZFR4XCJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcblxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmllbGRzLFxuICAgICAgdW5zaWduZWRUeDogdGhpcy51bnNpZ25lZFR4LnNlcmlhbGl6ZShlbmNvZGluZyksXG4gICAgICBjcmVkZW50aWFsczogdGhpcy5jcmVkZW50aWFscy5tYXAoKGMpID0+IGMuc2VyaWFsaXplKGVuY29kaW5nKSlcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdW5zaWduZWRUeDogU1VCVHggPSB1bmRlZmluZWRcbiAgcHJvdGVjdGVkIGNyZWRlbnRpYWxzOiBDcmVkZW50aWFsW10gPSBbXVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBbW1N0YW5kYXJkVW5zaWduZWRUeF1dXG4gICAqL1xuICBnZXRVbnNpZ25lZFR4KCk6IFNVQlR4IHtcbiAgICByZXR1cm4gdGhpcy51bnNpZ25lZFR4XG4gIH1cblxuICBhYnN0cmFjdCBmcm9tQnVmZmVyKGJ5dGVzOiBCdWZmZXIsIG9mZnNldD86IG51bWJlcik6IG51bWJlclxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRUeF1dLlxuICAgKi9cbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcbiAgICBjb25zdCB0eGJ1ZmY6IEJ1ZmZlciA9IHRoaXMudW5zaWduZWRUeC50b0J1ZmZlcigpXG4gICAgbGV0IGJzaXplOiBudW1iZXIgPSB0eGJ1ZmYubGVuZ3RoXG4gICAgY29uc3QgY3JlZGxlbjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgY3JlZGxlbi53cml0ZVVJbnQzMkJFKHRoaXMuY3JlZGVudGlhbHMubGVuZ3RoLCAwKVxuICAgIGNvbnN0IGJhcnI6IEJ1ZmZlcltdID0gW3R4YnVmZiwgY3JlZGxlbl1cbiAgICBic2l6ZSArPSBjcmVkbGVuLmxlbmd0aFxuICAgIHRoaXMuY3JlZGVudGlhbHMuZm9yRWFjaCgoY3JlZGVudGlhbDogQ3JlZGVudGlhbCkgPT4ge1xuICAgICAgY29uc3QgY3JlZGlkOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgICAgIGNyZWRpZC53cml0ZVVJbnQzMkJFKGNyZWRlbnRpYWwuZ2V0Q3JlZGVudGlhbElEKCksIDApXG4gICAgICBiYXJyLnB1c2goY3JlZGlkKVxuICAgICAgYnNpemUgKz0gY3JlZGlkLmxlbmd0aFxuICAgICAgY29uc3QgY3JlZGJ1ZmY6IEJ1ZmZlciA9IGNyZWRlbnRpYWwudG9CdWZmZXIoKVxuICAgICAgYnNpemUgKz0gY3JlZGJ1ZmYubGVuZ3RoXG4gICAgICBiYXJyLnB1c2goY3JlZGJ1ZmYpXG4gICAgfSlcbiAgICBjb25zdCBidWZmOiBCdWZmZXIgPSBCdWZmZXIuY29uY2F0KGJhcnIsIGJzaXplKVxuICAgIHJldHVybiBidWZmXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSBiYXNlLTU4IHN0cmluZyBjb250YWluaW5nIGFuIFtbU3RhbmRhcmRUeF1dLCBwYXJzZXMgaXQsIHBvcHVsYXRlcyB0aGUgY2xhc3MsIGFuZCByZXR1cm5zIHRoZSBsZW5ndGggb2YgdGhlIFR4IGluIGJ5dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gc2VyaWFsaXplZCBBIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYSByYXcgW1tTdGFuZGFyZFR4XV1cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGxlbmd0aCBvZiB0aGUgcmF3IFtbU3RhbmRhcmRUeF1dXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqIHVubGlrZSBtb3N0IGZyb21TdHJpbmdzLCBpdCBleHBlY3RzIHRoZSBzdHJpbmcgdG8gYmUgc2VyaWFsaXplZCBpbiBjYjU4IGZvcm1hdFxuICAgKi9cbiAgZnJvbVN0cmluZyhzZXJpYWxpemVkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmZyb21CdWZmZXIoYmludG9vbHMuY2I1OERlY29kZShzZXJpYWxpemVkKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY2I1OCByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tTdGFuZGFyZFR4XV0uXG4gICAqXG4gICAqIEByZW1hcmtzXG4gICAqIHVubGlrZSBtb3N0IHRvU3RyaW5ncywgdGhpcyByZXR1cm5zIGluIGNiNTggc2VyaWFsaXphdGlvbiBmb3JtYXRcbiAgICovXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGJpbnRvb2xzLmNiNThFbmNvZGUodGhpcy50b0J1ZmZlcigpKVxuICB9XG5cbiAgdG9TdHJpbmdIZXgoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDB4JHtiaW50b29scy5hZGRDaGVja3N1bSh0aGlzLnRvQnVmZmVyKCkpLnRvU3RyaW5nKFwiaGV4XCIpfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzaWduZWQgdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB1bnNpZ25lZFR4IE9wdGlvbmFsIFtbU3RhbmRhcmRVbnNpZ25lZFR4XV1cbiAgICogQHBhcmFtIHNpZ25hdHVyZXMgT3B0aW9uYWwgYXJyYXkgb2YgW1tDcmVkZW50aWFsXV1zXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICB1bnNpZ25lZFR4OiBTVUJUeCA9IHVuZGVmaW5lZCxcbiAgICBjcmVkZW50aWFsczogQ3JlZGVudGlhbFtdID0gdW5kZWZpbmVkXG4gICkge1xuICAgIHN1cGVyKClcbiAgICBpZiAodHlwZW9mIHVuc2lnbmVkVHggIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMudW5zaWduZWRUeCA9IHVuc2lnbmVkVHhcbiAgICAgIGlmICh0eXBlb2YgY3JlZGVudGlhbHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGNyZWRlbnRpYWxzXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=