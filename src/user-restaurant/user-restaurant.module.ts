import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UserRestaurant,
  UserRestaurantSchema,
} from './schemas/user-restaurant.schema';
import { UserRestaurantController } from './user-restaurant.controller';
import { UserRestaurantService } from './user-restaurant.service';
import { User } from 'src/user/schemas/user.schema';
import {
  Restaurant,
  RestaurantSchema,
} from 'src/restaurant/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserRestaurant.name, schema: UserRestaurantSchema },
      { name: User.name, schema: User },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [UserRestaurantController],
  providers: [UserRestaurantService],
  exports: [MongooseModule],
})
export class UserRestaurantModule {}
