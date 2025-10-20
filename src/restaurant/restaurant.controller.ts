import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  ParseFloatPipe,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

ApiTags('Restaurants');
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly service: RestaurantService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  create(@Body() dto: CreateRestaurantDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiQuery({ name: 'cuisine', required: false })
  list(@Query('cuisine') cuisine?: string) {
    return this.service.findAll(cuisine);
  }

  @Get('/nearby')
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
  ) {
    return this.service.findNearby([lat, lng]);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Mongo ID or slug' })
  get(@Param('id') id: string) {
    return this.service.findByIdOrSlug(id);
  }
}
