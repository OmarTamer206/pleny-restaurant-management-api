import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayMinSize } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Omar Tamer' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: ['Burgers', 'Asian'] })
  @IsArray()
  @ArrayMinSize(1)
  favoriteCuisines: string[];
}
