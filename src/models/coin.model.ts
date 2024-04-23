import { Model, Schema, Document, model } from 'mongoose';
import { defaultModel } from '@models/default.model';
import { ICoin } from '@interfaces/model.interface';

type TCoinModel = Model<ICoin>;

const CoinSchema = new Schema<ICoin, TCoinModel>({
  total_volume: defaultModel.string,
  price_change_percentage_24h: defaultModel.string,
  cgkId: defaultModel.string,
  weight: defaultModel.number,
  coinMarketCapId: defaultModel.string,
  isDefaultShow: defaultModel.booleanFalse,
  symbol: defaultModel.string,
  decimal: defaultModel.number,
  name: defaultModel.string,
  image: defaultModel.string,
  price: defaultModel.string,
  chain: defaultModel.string,
  ethPrice: defaultModel.string,
  btcPrice: defaultModel.string,
  balance: defaultModel.number,
  address: defaultModel.string,
  isActive: defaultModel.boolean,
});

const CoinModel: TCoinModel = model<ICoin, TCoinModel>(
  'Coin',
    CoinSchema,
);

