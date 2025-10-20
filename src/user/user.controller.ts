import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }

  @Get()
  getAll() {
    return this.service.getAllUsers();
  }

  @Get('recommendations/:userId')
  getRecommendation(@Param('userId') userId: string) {
    return this.service.getRecommendations(userId);
  }
}
