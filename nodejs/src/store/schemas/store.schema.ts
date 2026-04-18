import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, SchemaTypes, Types } from "mongoose";
import { STORE_TYPES,type StoreTypes } from "../store-type.constants";

@Schema({_id:false})
class Image{
  @Prop({required:true})
  url:string

  @Prop({required:true,select:false})
  public_id:string
}

@Schema({
    timestamps:true,
    toJSON: {
    transform: (_doc, ret: Record<string, any>) => {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }

      for (const field of ['store_id', 'supplier_id', 'product_id']) {
        if (ret[field] && typeof ret[field] !== 'string') {
          ret[field] = ret[field].toString();
        }
      }

      delete ret.__v;
      delete ret.user_id

      return ret;
    }
}})
export class Store{
    @Prop({required:true})
    store_name:string

    @Prop({required:true})
    location:string

    @Prop({type:SchemaTypes.ObjectId,ref:'User',required:true})
    owner_id:Types.ObjectId

    @Prop({type:String,enum:STORE_TYPES,required:false})
    store_type:StoreTypes

    @Prop({required:false,type:Image})
    image:Image

}

export const storeSchema = SchemaFactory.createForClass(Store)
export type StoreDocument = HydratedDocument<Store>