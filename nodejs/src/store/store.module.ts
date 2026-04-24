import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, storeSchema } from './schemas/store.schema';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports:[CloudinaryModule,MongooseModule.forFeature([{name:Store.name, schema:storeSchema}])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
