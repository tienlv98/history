import RecordServices from '@services/recordService';
import WalletServices from '@services/walletMigrate';
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa';

export interface User {
  id: number;
  email: string;
  name: string;
  status?: 'Happy' | 'Sad';
  phoneNumbers: string[];
}

export type UserCreationParams = Pick<User, 'email' | 'name' | 'phoneNumbers'>;

interface HistoryParams {
  address: string,
  token: {
    address: string,
    chain: string,
    decimal: string
  },
  page?: number,
  size?: number
}
@Route('wallet')
export class HistoryController extends Controller {
  @Get('approval')
  public async getApproval(
    @Query() address?: string,
    @Query() chain?: string,
    @Query() page?: string,
    @Query() size?: string,
  ): Promise<any> {
    return await WalletServices.getApproval({ address, chain, page, size })
  }

  @SuccessResponse('201', 'Created')
  @Post('history')
  public async getHistory(
    @Body() requestBody: HistoryParams,
  ): Promise<any> {
    this.setStatus(201); // set return status 201
    return await WalletServices.getHistory(requestBody)
  }
}

@Route('log')
export class RecordController extends Controller {
  @Post('')
  public async record(
    @Body() requestBody: any,
  ): Promise<any> {
    this.setStatus(201); // set return status 201
    return await RecordServices.logRecord(requestBody)
  }

  @Post('dapps')
  public async recordDapp(
    @Body() requestBody: any,
  ): Promise<any> {
    this.setStatus(201); // set return status 201
    return await RecordServices.logDappsRecord(requestBody)
  }
}
