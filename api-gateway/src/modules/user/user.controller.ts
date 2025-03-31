import {
  Controller,
  Logger,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';

import { UserService } from './user.service';
import { User, Login } from './dto';

@Controller('user')
// @UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() user: User) {
    return this.userService.createUser(user);
  }

  @Post('login')
  async login(@Body() login: Login) {
    return this.userService.login(login);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
