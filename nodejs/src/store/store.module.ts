import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [StoreController,CloudinaryModule],
  providers: [StoreService],
})
export class StoreModule {}
