import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/auth/dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Register the new user
  async register(registerDto: RegisterDto) {
    // 1. check if the user already exists
    const { email, password } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        'User already exists! Please try with a different email',
      );
    }

    // 2. hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. create the user
    const newlyCreatedUser = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    // 4. Remove the password from the response
    const { password: _, ...result } = newlyCreatedUser;
    // 5. return the user
    return result;
  }

  // Login the user
  async login(LoginDto: LoginDto) {
    // 1. check if the user exists
    const { email, password } = LoginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials! Please try again.');
    }
    // 2. check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials! Please try again.');
    }
    // 3. generate a JWT token
    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload);

    // 4. Remove the password from the response
    const { password: _, ...result } = user;    

    // 5. return the user
    return { ...result, token };
  }
}
