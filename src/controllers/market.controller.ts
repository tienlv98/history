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

export class UsersService {
  public get(id: number, name?: string): User {
    return {
      id,
      email: 'jane@doe.com',
      name: name ?? 'Jane Doe',
      status: 'Happy',
      phoneNumbers: [],
    };
  }

  public create(userCreationParams: UserCreationParams): User {
    return {
      id: Math.floor(Math.random() * 10000),
      status: 'Happy',
      ...userCreationParams,
    };
  }
}



@Route('wallet')
export class HistoryController extends Controller {
  @Get('approval')
  public async getUser(
    @Query() address?: string,
    @Query() chain?: string,
    @Query() page?: string,
    @Query() size?: string,
  ): Promise<any> {
    return await WalletServices.getApproval({ address, chain, page, size })
  }

  @SuccessResponse('201', 'Created')
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams,
  ): Promise<void> {
    this.setStatus(201); // set return status 201
    new UsersService().create(requestBody);
    return;
  }
}
