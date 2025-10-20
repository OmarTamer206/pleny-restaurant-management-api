import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  ArrayMinSize,
  ArrayMaxSize,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

// GeoPoint class to represent location data in GeoJSON format
class GeoPoint {
  @ApiProperty({ example: 'Point' })
  @IsString()
  type: string;

  @ApiProperty({ example: [31.2357, 30.0444], description: '[lat, lng]' })
  @IsArray()
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Burger Zone' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'برجر زون' })
  @IsString()
  nameAr: string;

  @ApiProperty({ example: 'burger-zone' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: ['Burgers', 'Fast Food'],
    minItems: 1,
    maxItems: 3,
    description: '1 to 3 cuisines allowed',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  cuisines: string[];

  @ApiProperty({ type: GeoPoint })
  @ValidateNested()
  @Type(() => GeoPoint)
  location: GeoPoint;
}
