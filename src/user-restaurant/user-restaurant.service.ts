import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRestaurant } from './schemas/user-restaurant.schema';
import { UserRestaurantDto } from './dto/user-restaurant.dto';
import { User } from '../user/schemas/user.schema';
import { Restaurant } from '../restaurant/schemas/restaurant.schema';

@Injectable()
export class UserRestaurantService {
  constructor(
    @InjectModel(UserRestaurant.name)
    private readonly userRestaurantModel: Model<UserRestaurant>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<Restaurant>,
  ) {}

  async followUserToRestaurant(body: UserRestaurantDto) {
    // gather and validate IDs coming from the request body

    const userId = body.userId;
    const restaurantId = body.restaurantId;

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid User ID format');
    }
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new BadRequestException('Invalid Restaurant ID format');
    }

    // Convert string IDs to ObjectId

    const userObjectId = new Types.ObjectId(userId);
    const restaurantObjectId = new Types.ObjectId(restaurantId);

    // Check if User and Restaurant exist

    const userExists = await this.userModel.exists({ _id: userObjectId });
    if (!userExists) {
      throw new NotFoundException('User does not exist');
    }

    const restaurantExists = await this.restaurantModel.exists({
      _id: restaurantObjectId,
    });
    if (!restaurantExists) {
      throw new NotFoundException('Restaurant does not exist');
    }

    // check for existing follow relationship between both ids to avoid duplicates

    const existingRecord = await this.userRestaurantModel.findOne({
      user: userObjectId,
      restaurant: restaurantObjectId,
    });

    // if found, throw error

    if (existingRecord) {
      throw new BadRequestException(
        'User already follows this restaurant. Duplicate not allowed.',
      );
    }

    try {
      const newUserRestaurant = await this.userRestaurantModel.create({
        user: userObjectId,
        restaurant: restaurantObjectId,
      });
      return {
        message: 'User followed restaurant successfully ',
        data: newUserRestaurant,
        statusCode: 201,
      };
    } catch (error) {
      throw new BadRequestException(
        'Failed to make the follow operation : ' + error,
      );
    }
  }
}
