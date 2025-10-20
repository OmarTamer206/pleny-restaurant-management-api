import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { UserRestaurant } from '../user-restaurant/schemas/user-restaurant.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserRestaurant.name)
    private userRestaurantModel: Model<UserRestaurant>,
  ) {}

  async createUser(body: CreateUserDto) {
    // validate required fields

    if (!body.fullName || typeof body.fullName !== 'string') {
      throw new BadRequestException(
        'fullName is required and must be a string',
      );
    }

    if (
      !Array.isArray(body.favoriteCuisines) ||
      body.favoriteCuisines.length === 0
    ) {
      throw new BadRequestException(
        'favoriteCuisines must be a non-empty array of strings',
      );
    }

    try {
      const newUser = await this.userModel.create(body);
      return {
        message: 'User created successfully',
        data: newUser,
        statusCode: 201,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create user : ' + error);
    }
  }

  async getAllUsers() {
    const users = await this.userModel.find().lean();

    // If no users found, throw NotFoundException

    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return {
      message: `${users.length} Users found`,
      data: users,
      statusCode: 200,
    };
  }

  async getRecommendations(userId: string) {
    //validate userId Existence and format

    if (!userId) {
      throw new BadRequestException('userId is required');
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid userId format');
    }

    // Search fot the user by ID

    const user = await this.userModel.findById(userId).lean();

    if (!user) {
      throw new Error('User not found');
    }
    // Find other users who share at least one favorite cuisine with the given user

    const usersWithSameCuisines = await this.userModel
      .find({
        _id: { $ne: new Types.ObjectId(userId) },
        favoriteCuisines: { $in: user.favoriteCuisines },
      })
      .lean<
        { _id: Types.ObjectId; fullName: string; favoriteCuisines: string[] }[]
      >();

    // If no similar users found , then there is no restaurant recommendations

    if (usersWithSameCuisines.length === 0) {
      throw new NotFoundException(
        'No similar users found based on favorite cuisines , therefore no recommendations available',
      );
    }

    // if there is similar users , then gather their ids and find the restaurants followed by them

    const otherUserIds = usersWithSameCuisines.map(
      (u) => new Types.ObjectId(u._id.toString()),
    );

    // Aggregate to find unique restaurants followed by these users using the users ids and looking up into userRestaurant collection
    // then gathering restaurants followed

    const userRestaurants = await this.userRestaurantModel.aggregate<{
      _id: Types.ObjectId;
      nameEn: string;
      slug: string;
    }>([
      {
        $match: {
          user: { $in: otherUserIds },
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'restaurant',
          foreignField: '_id',
          as: 'restaurant',
        },
      },
      { $unwind: '$restaurant' },
      {
        $group: {
          _id: '$restaurant._id',
          nameEn: { $first: '$restaurant.nameEn' },
          slug: { $first: '$restaurant.slug' },
        },
      },
    ]);

    return {
      message: `${usersWithSameCuisines.length} Users found , ${userRestaurants.length} Restaurants recommended`,
      data: {
        users: usersWithSameCuisines.map((u) => ({
          _id: u._id.toString(),
          fullName: u.fullName,
          favoriteCuisines: u.favoriteCuisines,
        })),
        restaurants: userRestaurants.map((r) => ({
          _id: r._id.toString(),
          nameEn: r.nameEn,
          slug: r.slug,
        })),
      },
      statusCode: 200,
    };
  }
}
