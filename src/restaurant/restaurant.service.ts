import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Model, Types } from 'mongoose';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(@InjectModel(Restaurant.name) private model: Model<Restaurant>) {}

  async create(body: CreateRestaurantDto) {
    // Checking required fields and their validity

    if (!body.nameEn || !body.nameAr || !body.slug || !body.cuisines) {
      throw new BadRequestException(
        'nameEn, nameAr, slug, and cuisines are required fields',
      );
    }

    if (!Array.isArray(body.cuisines) || body.cuisines.length === 0) {
      throw new BadRequestException('cuisines must be a non-empty array');
    }

    if (body.cuisines.length > 3) {
      throw new BadRequestException('cuisines must be between 1 - 3 only');
    }

    if (
      !body.location ||
      body.location.type !== 'Point' ||
      !Array.isArray(body.location.coordinates) ||
      body.location.coordinates.length !== 2
    ) {
      throw new BadRequestException(
        'location must be a valid GeoJSON Point with [latitude, longitude]',
      );
    }

    // Checking that GeoJSON coordinates are valid

    const [lat, lng] = body.location.coordinates;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new BadRequestException(
        'location coordinates must be valid [latitude, longitude]',
      );
    }

    // Check for unique slug

    const exists = await this.model.exists({ slug: body.slug });
    if (exists) {
      throw new BadRequestException(
        `A restaurant with slug "${body.slug}" already exists`,
      );
    }

    try {
      const newRestaurant = await this.model.create(body);
      return {
        message: 'Restaurant created successfully',
        data: newRestaurant,
        statusCode: 201,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create Restaurant : ' + error);
    }
  }

  async findAll(cuisine?: string) {
    // Validate cuisine parameter if provided

    if (cuisine && typeof cuisine !== 'string') {
      throw new BadRequestException('cuisine must be a string');
    }

    // Gather filtered restaurants by cuisine if exist , or return all restaurants

    const filter = cuisine ? { cuisines: cuisine } : {};
    const restaurants = await this.model.find(filter).exec();

    // If no restaurants found, throw NotFoundException

    if (!restaurants || restaurants.length === 0) {
      throw new NotFoundException(
        cuisine
          ? `No restaurants found with cuisine: ${cuisine}`
          : 'No restaurants found',
      );
    }
    return {
      data: restaurants,
      message: `${restaurants.length} restaurant(s) found`,
      statusCode: 200,
    };
  }

  async findByIdOrSlug(identifier: string) {
    // Validate identifier existence

    if (!identifier) {
      throw new BadRequestException('Mongo_ID or Slug is required');
    }

    // check if identifier is a valid MongoDB ObjectId

    const isObjectId = Types.ObjectId.isValid(identifier);

    // if it is a valid ObjectId, search by _id, else search by slug

    const restaurant = isObjectId
      ? await this.model.findById(identifier)
      : await this.model.findOne({ slug: identifier });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return {
      data: restaurant,
      message: `Restaurant found`,
      statusCode: 200,
    };
  }

  async findNearby(location: number[]) {
    // Validate location parameters
    if (
      !Array.isArray(location) ||
      location.length !== 2 ||
      typeof location[0] !== 'number' ||
      typeof location[1] !== 'number'
    ) {
      throw new BadRequestException(
        'Location must be an array of [latitude, longitude]',
      );
    }

    const [lat, lng] = location;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new BadRequestException(
        'Location coordinates must be within valid ranges',
      );
    }
    // Find restaurants within 1 km radius using geospatial query

    const restaurants = await this.model.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: location,
          },
          $maxDistance: 1000,
        },
      },
    });

    return {
      data: restaurants,
      message: `${restaurants.length} restaurant(s) found within 1 km of this location`,
      statusCode: 200,
    };
  }
}
