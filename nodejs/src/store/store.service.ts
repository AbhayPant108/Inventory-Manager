import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, MongooseError, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Store, StoreDocument } from './schemas/store.schema';
import { CreateStoreDto } from './dtos/create-store.dto';
import { QueryStoreDto } from './dtos/query-store.dto';
import { UpdateStoreDto } from './dtos/update-store.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { join } from 'path';

@Injectable()
export class StoreService {
    constructor(
        @InjectModel(Store.name) 
        private readonly storeModel:Model<Store>,
        private readonly cloudinaryService: CloudinaryService
    ) {}
    async create(createStoreDto: CreateStoreDto,userID:string,file:Express.Multer.File) {
        // Step 1: Validate the user's id
        this.ensureValidObjectId(userID,'owner id');  // validate refrence ids
        try {
            // Step 2: Upload image
            if(file) createStoreDto.image = await this.uploadStoreImage(file.filename)
          // Step 3: Create a new store document
          const store = await this.storeModel.create({
            ...createStoreDto,
            owner_id:new Types.ObjectId(userID)
          })
          // Step 4: return the created document
          return store
        } catch (error) {
          // handle error
          if(createStoreDto.image) await this.cloudinaryService.deleteFile(createStoreDto.image.public_id)
          this.handlePersistenceError(error);
        }
      }
    async findAll(queryDto: QueryStoreDto = {},userID:string) {
          // Step 1: Generate the filter object based on query
          const filters = this.buildFilters(queryDto);
          this.ensureValidObjectId(userID,'owner id')
          filters.owner_id = userID
          // Step 2: Find inventories docs using filter object
          const stores = await this.storeModel
            .find(filters)
            .sort({ updatedAt: -1, createdAt: -1 })
            .exec();
          // Step 3: Return the items array
          return stores
      }
    async findOne(id: string,userID:string) {
    const inventory = await this.findStoreOrThrow(id,userID);
    return inventory
      }
    private buildFilters(queryDto:QueryStoreDto) {
        const filters: Record<string, any> = {};
        if (queryDto.store_name) {
          filters.store_name = {
            $regex: queryDto.store_name,
            $options: 'i',
          };
        }
    
        if (queryDto.location) {
            filters.location = {
            $regex: queryDto.location,
            $options: 'i',
          };
        }
    
        if (queryDto.store_type) {
          filters.store_type = queryDto.store_type
        }
    
        return filters;
      }
    async update(id: string, updateStoreDto: UpdateStoreDto,userID:string,file:Express.Multer.File) {
        try{
        // Step 1: Check if the inventory doc exsists
        const store = await this.findStoreOrThrow(id,userID);
        // Step 2: Handle File if exists
        if(file) updateStoreDto.image = await this.uploadStoreImage(file.filename)
        // Step 3: Copy the data to store doc
        Object.assign(store, updateStoreDto);
        await store.save()
        // Step 4: Return the document
        return store
        }catch(error){
            this.handlePersistenceError(error)
        }
      }
    async delete(id: string,userID:string) {
    const inventory = await this.findStoreOrThrow(id,userID);

    try {
      await inventory.deleteOne();
      return;
    } catch (error) {
      this.handlePersistenceError(error);
    }
  }
    private async uploadStoreImage(fileName:string){
        const filePath = join(__dirname,'..','..','..','uploads/stores',fileName)
        const result = await this.cloudinaryService.uploadFile(filePath)
        return result
      }
    private async findStoreOrThrow(id: string,userID:string) {
        this.ensureValidObjectId(id, 'store id');
        this.ensureValidObjectId(userID,'owner id')
    
        const store = await this.storeModel.findOne({_id:id,owner_id:userID}).exec();
    
        if (!store) {
          throw new NotFoundException('Store not found.');
        }
    
        return store;
      }
    
 
    
      private ensureValidObjectId(value: string, fieldName: string) {
        if (!Types.ObjectId.isValid(value)) {
          throw new BadRequestException(
            `${fieldName} must be a valid MongoDB ObjectId.`,
          );
        }
      }
    
    
      private handlePersistenceError(error: any): never {
        if (error?.code === 11000) {
          throw new ConflictException(
            'An inventory record already exists for this store, supplier, product, and location.',
          );
        }
    
        if (error?.name === 'ValidationError') {
          throw new BadRequestException('Validation failed.');
        }
    
        if (error instanceof MongooseError) {
          throw new InternalServerErrorException(
            'Failed to complete the inventory operation.',
          );
        }
    
        throw error;
      }
    }
    

