import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CustomerService } from '../customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from 'src/utils/password/decrypt.password';

@Injectable()
export class AuthService {
  constructor(private customersService: CustomerService, private jwtService: JwtService) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.customersService.findOneByEmail(email);
    if (!await comparePassword(pass, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.customer_id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
