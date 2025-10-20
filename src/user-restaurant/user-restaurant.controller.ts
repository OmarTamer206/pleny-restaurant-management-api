import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { UserRestaurantDto } from './dto/user-restaurant.dto';
import { UserRestaurantService } from './user-restaurant.service';

@ApiTags('User - Restaurant')
@Controller('UserRestaurant')
export class UserRestaurantController {
  constructor(private readonly service: UserRestaurantService) {}

  @Post()
  @ApiBody({ type: UserRestaurantDto })
  UserRestaurant(@Body() body: UserRestaurantDto) {
    return this.service.followUserToRestaurant(body);
  }
}
