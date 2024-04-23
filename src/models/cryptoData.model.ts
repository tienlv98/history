import { Model, model, Schema } from 'mongoose';
import { defaultModel } from '@models/default.model';
import { ICoinData, ICryptoData } from '@interfaces/model.interface';

type TCryptoDataModel = Model<ICryptoData>;

const CryptoDataSchema = new Schema<ICryptoData, TCryptoDataModel>({
  bandProtocol: defaultModel.object,
  ethGas: defaultModel.object,
  evmGas: defaultModel.object,
  remitano: defaultModel.object,
  globalData: defaultModel.object,
  huobiData: defaultModel.object,
  bvNexData: defaultModel.object,
  cryptoPrice: defaultModel.object,
  marginData: Array<any>,
  listCoinEvent: Array<any>,
});

const CryptoDataModel: TCryptoDataModel = model<ICryptoData, TCryptoDataModel>(
  'CoinData',
  CryptoDataSchema,
);
