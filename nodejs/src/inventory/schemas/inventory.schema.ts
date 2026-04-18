import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { INVENTORY_STATUSES, type InventoryStatus } from '../inventory.constants';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema({
  timestamps: true,
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

      ret.available_quantity = Math.max(
        (ret.quantity ?? 0) - (ret.reserved_quantity ?? 0),
        0,
      );

      delete ret.__v;
      delete ret.user_id
      return ret;
    },
  },
})
export class Inventory {
  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
    index: true,
  })
  user_id: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Store', index: true })
  store_id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'Supplier',
    index: true,
  })
  supplier_id: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    required: true,
    ref: 'Product',
    index: true,
  })
  product_id: Types.ObjectId;

  @Prop({ required: true, min: 0, default: 0 })
  quantity: number;

  @Prop({ required: true, min: 0, default: 0 })
  reserved_quantity: number;

  @Prop({ required: true, min: 0, default: 0 })
  low_stock_threshold: number;

  @Prop({
    type: String,
    enum: INVENTORY_STATUSES,
    default: 'OUT_OF_STOCK',
    index: true,
  })
  status: InventoryStatus;

  @Prop({ required: true, trim: true })
  location_in_store: string;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.index(
  {
    user_id: 1,
    store_id: 1,
    supplier_id: 1,
    product_id: 1,
    location_in_store: 1,
  },
  {
    unique: true,
    name: 'inventory_unique_stock_location',
  },
);
