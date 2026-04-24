import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type SupplierDocument = HydratedDocument<Supplier>;

@Schema({
  timestamps: true,
  _id:false,
  toJSON: {
    transform: (_doc, ret: Record<string, any>) => {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }

      delete ret.__v;
      delete ret.owner_id;

      return ret;
    },
  },
})
export class Supplier {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true, index: true })
  id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  supplier_name: string;

  @Prop({ required: false, trim: true })
  contact_person?: string;

  @Prop({ required: false, trim: true, lowercase: true })
  email?: string;

  @Prop({ required: false, trim: true })
  phone?: string;

  @Prop({ required: false, trim: true })
  address?: string;

  @Prop({ required: false, trim: true })
  notes?: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.index(
  {
    id: 1,
    supplier_name: 1,
  },
  {
    unique: true,
    name: 'supplier_unique_per_owner',
  },
);
