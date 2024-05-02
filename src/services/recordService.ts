import mongoose, { Schema } from 'mongoose'

export const model = {
    date: { type: Date },
    sString: { type: String },
    string: { type: String, default: '' },
    numberUnique: { type: Number, required: true, unique: true },
    stringUnique: { type: String, required: true, unique: true },
    sArray: { type: Array },
    array: { type: Array, default: [] },
    number: { type: Number, default: 0 },
    sNumber: { type: Number },
    boolean: { type: Boolean, default: true },
    booleanFalse: { type: Boolean, default: false },
    sObject: { type: Object },
    object: { type: Object, default: {} }
}

const RecordDapps = mongoose.model('RecordDapps',new Schema({
    source: model.string,
    url: model.sString,
    hash: model.sString,
    method: model.sString,
    wallet: model.sString,
    chain: model.sString,
    transaction: model.sObject,
    meta: model.sObject,

    signature: model.sObject,
    signer: model.sString,
    sender: model.sObject,
    signed: model.sObject
}))

const Record = mongoose.model('Record', new Schema({
    from: model.string,
    to: model.string,
    hash: model.string,
    chain: model.string,
    amount: model.number,
    source: model.string,
    message: { type: String },
    memo: { type: String },
    timestamp: model.string,
    createdUser: { type: String },
    contract: model.object,
    options: model.object
}))

export default class RecordServices {
    static async logDappsRecord(params: any) {
        const { url, hash, method, wallet, chain, transaction, meta } = params

        await RecordDapps.create({
            url,
            hash,
            method,
            wallet,
            chain,
            transaction,
            meta,
            // source: req.get('source')
        })
    }

    static async logRecord(params:any) {

        const {
            signature,
            signer,
            sender,
            method,
            signed,

            from,
            to,
            hash,
            chain,
            amount,
            message,
            memo,
            contract,
            timestamp,
            options
        } = params

        if (signer) {
            await RecordDapps.create({
                signature,
                signer,
                sender,
                method,
                signed,
                // source: req.get('source')
            })
        } else {
            await Record.create({
                from,
                to,
                hash,
                chain,
                amount,
                // source: req.get('source'),
                message,
                memo,
                // createdUser: req.user,
                contract,
                timestamp,
                options
            })
        }
    }
}
