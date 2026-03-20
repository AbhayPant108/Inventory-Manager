import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// Defines the document type for Mongoose queries
export type ProductDocument = HydratedDocument<Product>;
@Schema({id:false})
class Image{
  @Prop({required:true})
  url:string

  @Prop({required:true,select:false})
  public_id:string
}
@Schema({ timestamps: true }) // Automatically adds createdAt and updatedAt fields
export class Product {
  @Prop({ required: true, trim: true })
  product_name: string;

  @Prop({ required: true })
  description: string;

  @Prop({type:Image,required: false, default: {},_id:false })
  image: Image;

  @Prop({ required: true, min: 0 }) // Ensures price cannot be negative
  price: number;

  @Prop({ required: true, index: true }) // Indexed for faster category-based queries
  category: string;
}

// Generates the Mongoose schema from the NestJS class
export const ProductSchema = SchemaFactory.createForClass(Product);