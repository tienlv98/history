import { Model, model, Schema } from 'mongoose';
import { defaultModel } from '@models/default.model';
import { ICoinData } from '@interfaces/model.interface';

type TCoinDataModel = Model<ICoinData>;

const CoinDataSchema = new Schema<ICoinData, TCoinDataModel>({
  id: defaultModel.string,
  symbol: defaultModel.string,
  name: defaultModel.string,
  address: { type: String },
  image: defaultModel.string,

  current_price: defaultModel.string,
  ath: defaultModel.string,
  bandPrice: defaultModel.string,
  market_cap: defaultModel.string,
  market_cap_rank: defaultModel.number,
  total_volume: defaultModel.string,
  high_24h: defaultModel.string,
  low_24h: defaultModel.string,
  price_change_24h: defaultModel.string,
  price_change_percentage_24h: defaultModel.string,
  market_cap_change_24h: defaultModel.string,
  market_cap_change_percentage_24h: defaultModel.string,
  circulating_supply: defaultModel.string,
  max_supply: defaultModel.string,
  fully_diluted_valuation: defaultModel.string,
  total_supply: defaultModel.string,
  eth: defaultModel.object,
  btc: defaultModel.object,
});

const CoinDataModel: TCoinDataModel = model<ICoinData, TCoinDataModel>(
  'CoinData',
  CoinDataSchema,
);
