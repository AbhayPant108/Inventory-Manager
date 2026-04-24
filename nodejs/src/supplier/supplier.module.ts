import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Supplier.name,
        schema: SupplierSchema,
      },
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, AuthGuard],
})
export class SupplierModule {}
