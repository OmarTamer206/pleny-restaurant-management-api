import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserRestaurantDto {
  @ApiProperty({ example: '5', description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({
    example: '2',
    description: 'Restaurant ID',
  })
  @IsString()
  restaurantId: string;
}
