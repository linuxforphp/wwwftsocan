"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportTx = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-ImportTx
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const constants_1 = require("./constants");
const inputs_1 = require("./inputs");
const credentials_1 = require("./credentials");
const credentials_2 = require("../../common/credentials");
const basetx_1 = require("./basetx");
const constants_2 = require("../../utils/constants");
const serialization_1 = require("../../utils/serialization");
const errors_1 = require("../../utils/errors");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
/**
 * Class representing an unsigned Import transaction.
 */
class ImportTx extends basetx_1.BaseTx {
    /**
     * Class representing an unsigned Import transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     * @param sourceChain Optiona chainid for the source inputs to import. Default platform chainid.
     * @param importIns Array of [[TransferableInput]]s used in the transaction
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, sourceChain = undefined, importIns = undefined) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "ImportTx";
        this._typeID = constants_1.PlatformVMConstants.IMPORTTX;
        this.sourceChain = buffer_1.Buffer.alloc(32);
        this.numIns = buffer_1.Buffer.alloc(4);
        this.importIns = [];
        this.sourceChain = sourceChain; // do no correct, if it's wrong it'll bomb on toBuffer
        if (typeof importIns !== "undefined" && Array.isArray(importIns)) {
            for (let i = 0; i < importIns.length; i++) {
                if (!(importIns[`${i}`] instanceof inputs_1.TransferableInput)) {
                    throw new errors_1.TransferableInputError("Error - ImportTx.constructor: invalid TransferableInput in array parameter 'importIns'");
                }
            }
            this.importIns = importIns;
        }
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { sourceChain: serialization.encoder(this.sourceChain, encoding, "Buffer", "cb58"), importIns: this.importIns.map((i) => i.serialize(encoding)) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.sourceChain = serialization.decoder(fields["sourceChain"], encoding, "cb58", "Buffer", 32);
        this.importIns = fields["importIns"].map((i) => {
            let ii = new inputs_1.TransferableInput();
            ii.deserialize(i, encoding);
            return ii;
        });
        this.numIns = buffer_1.Buffer.alloc(4);
        this.numIns.writeUInt32BE(this.importIns.length, 0);
    }
    /**
     * Returns the id of the [[ImportTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing an [[ImportTx]], parses it, populates the class, and returns the length of the [[ImportTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ImportTx]]
     *
     * @returns The length of the raw [[ImportTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.sourceChain = bintools.copyFrom(bytes, offset, offset + 32);
        offset += 32;
        this.numIns = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const numIns = this.numIns.readUInt32BE(0);
        for (let i = 0; i < numIns; i++) {
            const anIn = new inputs_1.TransferableInput();
            offset = anIn.fromBuffer(bytes, offset);
            this.importIns.push(anIn);
        }
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ImportTx]].
     */
    toBuffer() {
        if (typeof this.sourceChain === "undefined") {
            throw new errors_1.ChainIdError("ImportTx.toBuffer -- this.sourceChain is undefined");
        }
        this.numIns.writeUInt32BE(this.importIns.length, 0);
        let barr = [super.toBuffer(), this.sourceChain, this.numIns];
        this.importIns = this.importIns.sort(inputs_1.TransferableInput.comparator());
        for (let i = 0; i < this.importIns.length; i++) {
            barr.push(this.importIns[`${i}`].toBuffer());
        }
        return buffer_1.Buffer.concat(barr);
    }
    /**
     * Returns an array of [[TransferableInput]]s in this transaction.
     */
    getImportInputs() {
        return this.importIns;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the source chainid.
     */
    getSourceChain() {
        return this.sourceChain;
    }
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    sign(msg, kc) {
        const creds = super.sign(msg, kc);
        for (let i = 0; i < this.importIns.length; i++) {
            const cred = (0, credentials_1.SelectCredentialClass)(this.importIns[`${i}`].getInput().getCredentialID());
            const sigidxs = this.importIns[`${i}`].getInput().getSigIdxs();
            for (let j = 0; j < sigidxs.length; j++) {
                const keypair = kc.getKey(sigidxs[`${j}`].getSource());
                const signval = keypair.sign(msg);
                const sig = new credentials_2.Signature();
                sig.fromBuffer(signval);
                cred.addSignature(sig);
            }
            creds.push(cred);
        }
        return creds;
    }
    prepareUnsignedHashes(msg, kc) {
        const reqs = super.prepareUnsignedHashes(msg, kc);
        for (let i = 0; i < this.importIns.length; i++) {
            const sigidxs = this.importIns[`${i}`].getInput().getSigIdxs();
            for (let j = 0; j < sigidxs.length; j++) {
                const source = sigidxs[`${j}`].getSource();
                reqs.push({
                    message: msg.toString('hex'),
                    signer: source.toString('hex')
                });
            }
        }
        return reqs;
    }
    signWithRawSignatures(signatures, kc) {
        const creds = super.signWithRawSignatures(signatures, kc);
        for (let i = 0; i < this.importIns.length; i++) {
            const cred = (0, credentials_1.SelectCredentialClass)(this.importIns[`${i}`].getInput().getCredentialID());
            const sigidxs = this.importIns[`${i}`].getInput().getSigIdxs();
            for (let j = 0; j < sigidxs.length; j++) {
                const ecdsaSig = signatures.shift();
                const keypair = kc.getKey(sigidxs[`${j}`].getSource());
                const signval = keypair.signWithRawSignatures(ecdsaSig);
                const sig = new credentials_2.Signature();
                sig.fromBuffer(signval);
                cred.addSignature(sig);
            }
            creds.push(cred);
        }
        return creds;
    }
    clone() {
        let newbase = new ImportTx();
        newbase.fromBuffer(this.toBuffer());
        return newbase;
    }
    create(...args) {
        return new ImportTx(...args);
    }
}
exports.ImportTx = ImportTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wb3J0dHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBpcy9wbGF0Zm9ybXZtL2ltcG9ydHR4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxvRUFBMkM7QUFDM0MsMkNBQWlEO0FBRWpELHFDQUE0QztBQUU1QywrQ0FBcUQ7QUFDckQsMERBQXdFO0FBQ3hFLHFDQUFpQztBQUNqQyxxREFBd0Q7QUFDeEQsNkRBQTZFO0FBQzdFLCtDQUF5RTtBQUd6RTs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFaEU7O0dBRUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxlQUFNO0lBNktsQzs7Ozs7Ozs7OztPQVVHO0lBQ0gsWUFDRSxZQUFvQiw0QkFBZ0IsRUFDcEMsZUFBdUIsZUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQzNDLE9BQTZCLFNBQVMsRUFDdEMsTUFBMkIsU0FBUyxFQUNwQyxPQUFlLFNBQVMsRUFDeEIsY0FBc0IsU0FBUyxFQUMvQixZQUFpQyxTQUFTO1FBRTFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7UUFoTXZDLGNBQVMsR0FBRyxVQUFVLENBQUE7UUFDdEIsWUFBTyxHQUFHLCtCQUFtQixDQUFDLFFBQVEsQ0FBQTtRQWlDdEMsZ0JBQVcsR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3RDLFdBQU0sR0FBVyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2hDLGNBQVMsR0FBd0IsRUFBRSxDQUFBO1FBNkozQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcs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b2R1bGUgQVBJLVBsYXRmb3JtVk0tSW1wb3J0VHhcbiAqL1xuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuLi8uLi91dGlscy9iaW50b29sc1wiXG5pbXBvcnQgeyBQbGF0Zm9ybVZNQ29uc3RhbnRzIH0gZnJvbSBcIi4vY29uc3RhbnRzXCJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZU91dHB1dCB9IGZyb20gXCIuL291dHB1dHNcIlxuaW1wb3J0IHsgVHJhbnNmZXJhYmxlSW5wdXQgfSBmcm9tIFwiLi9pbnB1dHNcIlxuaW1wb3J0IHsgS2V5Q2hhaW4sIEtleVBhaXIgfSBmcm9tIFwiLi9rZXljaGFpblwiXG5pbXBvcnQgeyBTZWxlY3RDcmVkZW50aWFsQ2xhc3MgfSBmcm9tIFwiLi9jcmVkZW50aWFsc1wiXG5pbXBvcnQgeyBTaWduYXR1cmUsIFNpZ0lkeCwgQ3JlZGVudGlhbCB9IGZyb20gXCIuLi8uLi9jb21tb24vY3JlZGVudGlhbHNcIlxuaW1wb3J0IHsgQmFzZVR4IH0gZnJvbSBcIi4vYmFzZXR4XCJcbmltcG9ydCB7IERlZmF1bHROZXR3b3JrSUQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY29uc3RhbnRzXCJcbmltcG9ydCB7IFNlcmlhbGl6YXRpb24sIFNlcmlhbGl6ZWRFbmNvZGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9zZXJpYWxpemF0aW9uXCJcbmltcG9ydCB7IENoYWluSWRFcnJvciwgVHJhbnNmZXJhYmxlSW5wdXRFcnJvciB9IGZyb20gXCIuLi8uLi91dGlscy9lcnJvcnNcIlxuaW1wb3J0IHsgRWNkc2FTaWduYXR1cmUsIFNpZ25hdHVyZVJlcXVlc3QgfSBmcm9tIFwiLi4vLi4vY29tbW9uXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgSW1wb3J0IHRyYW5zYWN0aW9uLlxuICovXG5leHBvcnQgY2xhc3MgSW1wb3J0VHggZXh0ZW5kcyBCYXNlVHgge1xuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJJbXBvcnRUeFwiXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gUGxhdGZvcm1WTUNvbnN0YW50cy5JTVBPUlRUWFxuXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XG4gICAgbGV0IGZpZWxkczogb2JqZWN0ID0gc3VwZXIuc2VyaWFsaXplKGVuY29kaW5nKVxuICAgIHJldHVybiB7XG4gICAgICAuLi5maWVsZHMsXG4gICAgICBzb3VyY2VDaGFpbjogc2VyaWFsaXphdGlvbi5lbmNvZGVyKFxuICAgICAgICB0aGlzLnNvdXJjZUNoYWluLFxuICAgICAgICBlbmNvZGluZyxcbiAgICAgICAgXCJCdWZmZXJcIixcbiAgICAgICAgXCJjYjU4XCJcbiAgICAgICksXG4gICAgICBpbXBvcnRJbnM6IHRoaXMuaW1wb3J0SW5zLm1hcCgoaSkgPT4gaS5zZXJpYWxpemUoZW5jb2RpbmcpKVxuICAgIH1cbiAgfVxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxuICAgIHRoaXMuc291cmNlQ2hhaW4gPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXG4gICAgICBmaWVsZHNbXCJzb3VyY2VDaGFpblwiXSxcbiAgICAgIGVuY29kaW5nLFxuICAgICAgXCJjYjU4XCIsXG4gICAgICBcIkJ1ZmZlclwiLFxuICAgICAgMzJcbiAgICApXG4gICAgdGhpcy5pbXBvcnRJbnMgPSBmaWVsZHNbXCJpbXBvcnRJbnNcIl0ubWFwKChpOiBvYmplY3QpID0+IHtcbiAgICAgIGxldCBpaTogVHJhbnNmZXJhYmxlSW5wdXQgPSBuZXcgVHJhbnNmZXJhYmxlSW5wdXQoKVxuICAgICAgaWkuZGVzZXJpYWxpemUoaSwgZW5jb2RpbmcpXG4gICAgICByZXR1cm4gaWlcbiAgICB9KVxuICAgIHRoaXMubnVtSW5zID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgdGhpcy5udW1JbnMud3JpdGVVSW50MzJCRSh0aGlzLmltcG9ydElucy5sZW5ndGgsIDApXG4gIH1cblxuICBwcm90ZWN0ZWQgc291cmNlQ2hhaW46IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcbiAgcHJvdGVjdGVkIG51bUluczogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gIHByb3RlY3RlZCBpbXBvcnRJbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSBbXVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBpZCBvZiB0aGUgW1tJbXBvcnRUeF1dXG4gICAqL1xuICBnZXRUeFR5cGUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZUlEXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIGFuIFtbSW1wb3J0VHhdXSwgcGFyc2VzIGl0LCBwb3B1bGF0ZXMgdGhlIGNsYXNzLCBhbmQgcmV0dXJucyB0aGUgbGVuZ3RoIG9mIHRoZSBbW0ltcG9ydFR4XV0gaW4gYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBieXRlcyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYSByYXcgW1tJbXBvcnRUeF1dXG4gICAqXG4gICAqIEByZXR1cm5zIFRoZSBsZW5ndGggb2YgdGhlIHJhdyBbW0ltcG9ydFR4XV1cbiAgICpcbiAgICogQHJlbWFya3MgYXNzdW1lIG5vdC1jaGVja3N1bW1lZFxuICAgKi9cbiAgZnJvbUJ1ZmZlcihieXRlczogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciA9IDApOiBudW1iZXIge1xuICAgIG9mZnNldCA9IHN1cGVyLmZyb21CdWZmZXIoYnl0ZXMsIG9mZnNldClcbiAgICB0aGlzLnNvdXJjZUNoYWluID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXG4gICAgb2Zmc2V0ICs9IDMyXG4gICAgdGhpcy5udW1JbnMgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxuICAgIG9mZnNldCArPSA0XG4gICAgY29uc3QgbnVtSW5zOiBudW1iZXIgPSB0aGlzLm51bUlucy5yZWFkVUludDMyQkUoMClcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgbnVtSW5zOyBpKyspIHtcbiAgICAgIGNvbnN0IGFuSW46IFRyYW5zZmVyYWJsZUlucHV0ID0gbmV3IFRyYW5zZmVyYWJsZUlucHV0KClcbiAgICAgIG9mZnNldCA9IGFuSW4uZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxuICAgICAgdGhpcy5pbXBvcnRJbnMucHVzaChhbkluKVxuICAgIH1cbiAgICByZXR1cm4gb2Zmc2V0XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW0ltcG9ydFR4XV0uXG4gICAqL1xuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zb3VyY2VDaGFpbiA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhyb3cgbmV3IENoYWluSWRFcnJvcihcbiAgICAgICAgXCJJbXBvcnRUeC50b0J1ZmZlciAtLSB0aGlzLnNvdXJjZUNoYWluIGlzIHVuZGVmaW5lZFwiXG4gICAgICApXG4gICAgfVxuICAgIHRoaXMubnVtSW5zLndyaXRlVUludDMyQkUodGhpcy5pbXBvcnRJbnMubGVuZ3RoLCAwKVxuICAgIGxldCBiYXJyOiBCdWZmZXJbXSA9IFtzdXBlci50b0J1ZmZlcigpLCB0aGlzLnNvdXJjZUNoYWluLCB0aGlzLm51bUluc11cbiAgICB0aGlzLmltcG9ydElucyA9IHRoaXMuaW1wb3J0SW5zLnNvcnQoVHJhbnNmZXJhYmxlSW5wdXQuY29tcGFyYXRvcigpKVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLmltcG9ydElucy5sZW5ndGg7IGkrKykge1xuICAgICAgYmFyci5wdXNoKHRoaXMuaW1wb3J0SW5zW2Ake2l9YF0udG9CdWZmZXIoKSlcbiAgICB9XG4gICAgcmV0dXJuIEJ1ZmZlci5jb25jYXQoYmFycilcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBbW1RyYW5zZmVyYWJsZUlucHV0XV1zIGluIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAqL1xuICBnZXRJbXBvcnRJbnB1dHMoKTogVHJhbnNmZXJhYmxlSW5wdXRbXSB7XG4gICAgcmV0dXJuIHRoaXMuaW1wb3J0SW5zXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGZvciB0aGUgc291cmNlIGNoYWluaWQuXG4gICAqL1xuICBnZXRTb3VyY2VDaGFpbigpOiBCdWZmZXIge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZUNoYWluXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIGJ5dGVzIG9mIGFuIFtbVW5zaWduZWRUeF1dIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIFtbQ3JlZGVudGlhbF1dc1xuICAgKlxuICAgKiBAcGFyYW0gbXNnIEEgQnVmZmVyIGZvciB0aGUgW1tVbnNpZ25lZFR4XV1cbiAgICogQHBhcmFtIGtjIEFuIFtbS2V5Q2hhaW5dXSB1c2VkIGluIHNpZ25pbmdcbiAgICpcbiAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgW1tDcmVkZW50aWFsXV1zXG4gICAqL1xuICBzaWduKG1zZzogQnVmZmVyLCBrYzogS2V5Q2hhaW4pOiBDcmVkZW50aWFsW10ge1xuICAgIGNvbnN0IGNyZWRzOiBDcmVkZW50aWFsW10gPSBzdXBlci5zaWduKG1zZywga2MpXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuaW1wb3J0SW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjcmVkOiBDcmVkZW50aWFsID0gU2VsZWN0Q3JlZGVudGlhbENsYXNzKFxuICAgICAgICB0aGlzLmltcG9ydEluc1tgJHtpfWBdLmdldElucHV0KCkuZ2V0Q3JlZGVudGlhbElEKClcbiAgICAgIClcbiAgICAgIGNvbnN0IHNpZ2lkeHM6IFNpZ0lkeFtdID0gdGhpcy5pbXBvcnRJbnNbYCR7aX1gXS5nZXRJbnB1dCgpLmdldFNpZ0lkeHMoKVxuICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHNpZ2lkeHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3Qga2V5cGFpcjogS2V5UGFpciA9IGtjLmdldEtleShzaWdpZHhzW2Ake2p9YF0uZ2V0U291cmNlKCkpXG4gICAgICAgIGNvbnN0IHNpZ252YWw6IEJ1ZmZlciA9IGtleXBhaXIuc2lnbihtc2cpXG4gICAgICAgIGNvbnN0IHNpZzogU2lnbmF0dXJlID0gbmV3IFNpZ25hdHVyZSgpXG4gICAgICAgIHNpZy5mcm9tQnVmZmVyKHNpZ252YWwpXG4gICAgICAgIGNyZWQuYWRkU2lnbmF0dXJlKHNpZylcbiAgICAgIH1cbiAgICAgIGNyZWRzLnB1c2goY3JlZClcbiAgICB9XG4gICAgcmV0dXJuIGNyZWRzXG4gIH1cblxuICBwcmVwYXJlVW5zaWduZWRIYXNoZXMobXNnOiBCdWZmZXIsIGtjOiBLZXlDaGFpbik6IFNpZ25hdHVyZVJlcXVlc3RbXSB7XG4gICAgY29uc3QgcmVxczogU2lnbmF0dXJlUmVxdWVzdFtdID0gc3VwZXIucHJlcGFyZVVuc2lnbmVkSGFzaGVzKG1zZywga2MpXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuaW1wb3J0SW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzaWdpZHhzOiBTaWdJZHhbXSA9IHRoaXMuaW1wb3J0SW5zW2Ake2l9YF0uZ2V0SW5wdXQoKS5nZXRTaWdJZHhzKClcbiAgICAgIGZvciAobGV0IGo6IG51bWJlciA9IDA7IGogPCBzaWdpZHhzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZTogQnVmZmVyID0gc2lnaWR4c1tgJHtqfWBdLmdldFNvdXJjZSgpXG4gICAgICAgIHJlcXMucHVzaCg8U2lnbmF0dXJlUmVxdWVzdD57XG4gICAgICAgICAgbWVzc2FnZTogbXNnLnRvU3RyaW5nKCdoZXgnKSxcbiAgICAgICAgICBzaWduZXI6IHNvdXJjZS50b1N0cmluZygnaGV4JylcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlcXNcbiAgfVxuXG4gIHNpZ25XaXRoUmF3U2lnbmF0dXJlcyhzaWduYXR1cmVzOiBFY2RzYVNpZ25hdHVyZVtdLCBrYzogS2V5Q2hhaW4pOiBDcmVkZW50aWFsW10ge1xuICAgIGNvbnN0IGNyZWRzOiBDcmVkZW50aWFsW10gPSBzdXBlci5zaWduV2l0aFJhd1NpZ25hdHVyZXMoc2lnbmF0dXJlcywga2MpXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuaW1wb3J0SW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjcmVkOiBDcmVkZW50aWFsID0gU2VsZWN0Q3JlZGVudGlhbENsYXNzKFxuICAgICAgICB0aGlzLmltcG9ydEluc1tgJHtpfWBdLmdldElucHV0KCkuZ2V0Q3JlZGVudGlhbElEKClcbiAgICAgIClcbiAgICAgIGNvbnN0IHNpZ2lkeHM6IFNpZ0lkeFtdID0gdGhpcy5pbXBvcnRJbnNbYCR7aX1gXS5nZXRJbnB1dCgpLmdldFNpZ0lkeHMoKVxuICAgICAgZm9yIChsZXQgajogbnVtYmVyID0gMDsgaiA8IHNpZ2lkeHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3QgZWNkc2FTaWc6IEVjZHNhU2lnbmF0dXJlID0gc2lnbmF0dXJlcy5zaGlmdCgpXG4gICAgICAgIGNvbnN0IGtleXBhaXI6IEtleVBhaXIgPSBrYy5nZXRLZXkoc2lnaWR4c1tgJHtqfWBdLmdldFNvdXJjZSgpKVxuICAgICAgICBjb25zdCBzaWdudmFsOiBCdWZmZXIgPSBrZXlwYWlyLnNpZ25XaXRoUmF3U2lnbmF0dXJlcyhlY2RzYVNpZylcbiAgICAgICAgY29uc3Qgc2lnOiBTaWduYXR1cmUgPSBuZXcgU2lnbmF0dXJlKClcbiAgICAgICAgc2lnLmZyb21CdWZmZXIoc2lnbnZhbClcbiAgICAgICAgY3JlZC5hZGRTaWduYXR1cmUoc2lnKVxuICAgICAgfVxuICAgICAgY3JlZHMucHVzaChjcmVkKVxuICAgIH1cbiAgICByZXR1cm4gY3JlZHNcbiAgfVxuXG4gIGNsb25lKCk6IHRoaXMge1xuICAgIGxldCBuZXdiYXNlOiBJbXBvcnRUeCA9IG5ldyBJbXBvcnRUeCgpXG4gICAgbmV3YmFzZS5mcm9tQnVmZmVyKHRoaXMudG9CdWZmZXIoKSlcbiAgICByZXR1cm4gbmV3YmFzZSBhcyB0aGlzXG4gIH1cblxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcbiAgICByZXR1cm4gbmV3IEltcG9ydFR4KC4uLmFyZ3MpIGFzIHRoaXNcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgSW1wb3J0IHRyYW5zYWN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gbmV0d29ya0lEIE9wdGlvbmFsIG5ldHdvcmtJRCwgW1tEZWZhdWx0TmV0d29ya0lEXV1cbiAgICogQHBhcmFtIGJsb2NrY2hhaW5JRCBPcHRpb25hbCBibG9ja2NoYWluSUQsIGRlZmF1bHQgQnVmZmVyLmFsbG9jKDMyLCAxNilcbiAgICogQHBhcmFtIG91dHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlT3V0cHV0XV1zXG4gICAqIEBwYXJhbSBpbnMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXNcbiAgICogQHBhcmFtIG1lbW8gT3B0aW9uYWwge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBtZW1vIGZpZWxkXG4gICAqIEBwYXJhbSBzb3VyY2VDaGFpbiBPcHRpb25hIGNoYWluaWQgZm9yIHRoZSBzb3VyY2UgaW5wdXRzIHRvIGltcG9ydC4gRGVmYXVsdCBwbGF0Zm9ybSBjaGFpbmlkLlxuICAgKiBAcGFyYW0gaW1wb3J0SW5zIEFycmF5IG9mIFtbVHJhbnNmZXJhYmxlSW5wdXRdXXMgdXNlZCBpbiB0aGUgdHJhbnNhY3Rpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxuICAgIG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdW5kZWZpbmVkLFxuICAgIGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHVuZGVmaW5lZCxcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXG4gICAgc291cmNlQ2hhaW46IEJ1ZmZlciA9IHVuZGVmaW5lZCxcbiAgICBpbXBvcnRJbnM6IFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWRcbiAgKSB7XG4gICAgc3VwZXIobmV0d29ya0lELCBibG9ja2NoYWluSUQsIG91dHMsIGlucywgbWVtbylcbiAgICB0aGlzLnNvdXJjZUNoYWluID0gc291cmNlQ2hhaW4gLy8gZG8gbm8gY29ycmVjdCwgaWYgaXQncyB3cm9uZyBpdCdsbCBib21iIG9uIHRvQnVmZmVyXG4gICAgaWYgKHR5cGVvZiBpbXBvcnRJbnMgIT09IFwidW5kZWZpbmVkXCIgJiYgQXJyYXkuaXNBcnJheShpbXBvcnRJbnMpKSB7XG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaW1wb3J0SW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghKGltcG9ydEluc1tgJHtpfWBdIGluc3RhbmNlb2YgVHJhbnNmZXJhYmxlSW5wdXQpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFRyYW5zZmVyYWJsZUlucHV0RXJyb3IoXG4gICAgICAgICAgICBcIkVycm9yIC0gSW1wb3J0VHguY29uc3RydWN0b3I6IGludmFsaWQgVHJhbnNmZXJhYmxlSW5wdXQgaW4gYXJyYXkgcGFyYW1ldGVyICdpbXBvcnRJbnMnXCJcbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuaW1wb3J0SW5zID0gaW1wb3J0SW5zXG4gICAgfVxuICB9XG59XG4iXX0=