import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CustomerService } from '../customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as passwordUtils from '../utils/password/decrypt.password';

describe('AuthService', () => {
  let service: AuthService;
  let customerService: CustomerService;
  let jwtService: JwtService;

  const mockCustomer = {
    customer_id: 1,
    customer_name: 'Test',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CustomerService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    customerService = module.get<CustomerService>(CustomerService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should authenticate user and return token', async () => {
      jest.spyOn(customerService, 'findOneByEmail').mockResolvedValue(mockCustomer);
      jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('jwt_token');

      const result = await service.signIn('test@example.com', 'password');

      expect(customerService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(passwordUtils.comparePassword).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockCustomer.customer_id,
        email: mockCustomer.email,
      });
      expect(result).toEqual({ access_token: 'jwt_token' });
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      jest.spyOn(customerService, 'findOneByEmail').mockResolvedValue(mockCustomer);
      jest.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(false);

      await expect(service.signIn('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      jest.spyOn(customerService, 'findOneByEmail').mockResolvedValue(null);

      await expect(service.signIn('nonexistent@example.com', 'password'))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});