import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Restaurant } from 'src/restaurant/schemas/restaurant.schema';
import { User } from 'src/user/schemas/user.schema';

@Schema()
export class UserRestaurant extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
  restaurant: Types.ObjectId | Restaurant;
}

export const UserRestaurantSchema =
  SchemaFactory.createForClass(UserRestaurant);
