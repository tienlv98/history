import { Response as ResponseExpress } from 'express';


export interface Response extends ResponseExpress {
  zap: (data: any) => void;
}
