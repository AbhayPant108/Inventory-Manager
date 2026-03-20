import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ 
  timestamps: true, // This replaces the explicit date_joined field
  toJSON: { virtuals: true }, // Ensures virtual fields are included in API responses
  toObject: { virtuals: true } // Ensures virtual fields are included in object by find()/findOne() etc
})
export class User {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, trim: true })
  first_name: string;

  @Prop({ required: true, trim: true })
  last_name: string;

  @Prop({ default: false })
  is_staff: boolean;

  @Prop({ default: false })
  is_authenticated: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// DRF classmethod equivalent: Mongoose Virtual Field
UserSchema.virtual('full_name').get(function (this: UserDocument) {
  return `${this.first_name} ${this.last_name}`;
});