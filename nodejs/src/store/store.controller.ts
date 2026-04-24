import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { type MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { type PayloadDto } from '../auth/dtos/payload.dto';
import { User } from '../auth/user.decorator';
import { ZodValidationPipe } from '../zodValidation.pipe';
import ApiResponse from '../../utils/api.response';
import {
  createStoreZodSchema,
  type CreateStoreDto,
} from './dtos/create-store.dto';
import {
  queryStoreSchema,
  type QueryStoreDto,
} from './dtos/query-store.dto';
import {
  updateStoreZodSchema,
  type UpdateStoreDto,
} from './dtos/update-store.dto';
import { StoreService } from './store.service';
import { AuthGuard } from 'src/auth/auth.guard';

const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/stores',
    filename: (_req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      callback(null, `store-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

@Controller('store')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body(new ZodValidationPipe(createStoreZodSchema))
    createStoreDto: CreateStoreDto,
    @User() user: PayloadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const store = await this.storeService.create(createStoreDto, user.id, file);

    return new ApiResponse(
      'Store created successfully.',
      HttpStatus.CREATED,
      store,
    );
  }

  @Get()
  async findAll(
    @Query(new ZodValidationPipe(queryStoreSchema))
    queryStoreDto: QueryStoreDto,
    @User() user: PayloadDto,
  ) {
    const stores = await this.storeService.findAll(queryStoreDto, user.id);

    return new ApiResponse('Stores fetched successfully.', HttpStatus.OK, stores);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @User() user: PayloadDto) {
    const store = await this.storeService.findOne(id, user.id);

    return new ApiResponse('Store fetched successfully.', HttpStatus.OK, store);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStoreZodSchema))
    updateStoreDto: UpdateStoreDto,
    @User() user: PayloadDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updatedStore = await this.storeService.update(
      id,
      updateStoreDto,
      user.id,
      file,
    );

    return new ApiResponse(
      'Store updated successfully.',
      HttpStatus.OK,
      updatedStore,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @User() user: PayloadDto) {
    await this.storeService.delete(id, user.id);

    return new ApiResponse('Store deleted successfully.', HttpStatus.OK);
  }
}
