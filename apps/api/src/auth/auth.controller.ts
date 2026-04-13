import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthResponseDto, ProfileResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshAuth } from './decorators/refresh-auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('refresh')
  @RefreshAuth()
  async refresh(@Request() req) {
    const { userId, username, role } = req.user;
    return this.authService.refreshTokens(userId, username, role);
  }

  @Post('login')
  @UseGuards(PassportLocalGuard)
  @ApiOperation({ summary: 'Log in with username and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid username or password.' })
  login(@Request() request) {
    return this.authService.signIn(request.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: AuthResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Get the currently authenticated user profile' })
  @ApiOkResponse({ type: ProfileResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token.' })
  getUserProfile(@Request() request) {
    return request.user;
  }
}
