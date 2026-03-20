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


@Schema({
  timestamps:true,
  toJSON: {
    transform: (doc, ret: Record<string, any>) => {
      // 1. Convert _id (ObjectId) to string 'id' for frontend
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }

      // 2. Flatten image object to just the URL string
      // Use optional chaining for safety
      if (ret.image?.url) {
        ret.image = ret.image.url;
      }

      // 3. Cleanup Mongoose internals
      delete ret.__v;
      
      return ret;
    },
  },
}) // Automatically adds createdAt and updatedAt fields
export class Product {
  @Prop({ required: true, trim: true,index:'text' })
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