import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class AuthService {
  constructor(private customersService: CustomerService) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.customersService.findOneByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return result;
  }
}