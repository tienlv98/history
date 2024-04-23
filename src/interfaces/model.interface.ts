export interface ICoin {
  total_volume: string;
  price_change_percentage_24h: string;
  cgkId: string;
  weight: number;
  coinMarketCapId: string;
  isDefaultShow: boolean;
  symbol: string;
  decimal: number;
  name: string;
  image: string;
  price: string;
  chain: string;
  ethPrice: string;
  btcPrice: string;
  balance: number;
  address: string;
  isActive: boolean;
}

export interface ICoinData {
  id: string;
  symbol: string;
  name: string;
  address: string;
  image: string;

  current_price: string;
  ath: string;
  bandPrice: string;
  market_cap: string;
  market_cap_rank: number;
  total_volume: string;
  high_24h: string;
  low_24h: string;
  price_change_24h: string;
  price_change_percentage_24h: string;
  market_cap_change_24h: string;
  market_cap_change_percentage_24h: string;
  circulating_supply: string;
  max_supply: string;
  fully_diluted_valuation: string;
  total_supply: string;
  eth: object;
  btc: object;
}

export interface ICryptoData {
  bandProtocol: object;
  ethGas: object;
  evmGas: object;
  remitano: object;
  globalData: object;
  huobiData: object;
  bvNexData: object;
  cryptoPrice: object;
  marginData: any[];
  listCoinEvent: any[];
}
