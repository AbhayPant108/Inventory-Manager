import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Connection, Model, MongooseError } from 'mongoose';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { join } from 'path';
import fs from 'fs';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private ProductModel:Model<Product>,
        @InjectConnection() private readonly connection:Connection ,
        private cloudinaryService:CloudinaryService
    ){}
    async create(createProductDto:CreateProductDto,file:Express.Multer.File){
        try{
            const filepath = join(__dirname,'..','..','..','uploads/products',file.filename)
            createProductDto.image = await this.cloudinaryService.uploadFile(filepath)
            const newProduct = await this.ProductModel.create(createProductDto)
            return newProduct
            
        }catch(error){
            if(error.name == 'ValidationError') throw new BadRequestException('Validation failed.',error.message)
            if(error instanceof MongooseError) throw new InternalServerErrorException()
            throw error
        }
    }

    async findAll(){
        // 1. Fetch products
    const products = await this.ProductModel.find().lean().exec();
    
    // 2. Base URL from environment variables
    const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000/uploads/';

    // 3. Map and format
    return products.map(product => ({
      ...product,
      image: product.image ? product.image.url:'',
    }));
    }
    async update(updateProductDto:UpdateProductDto,productID:string,file?:Express.Multer.File){
        const session = await this.connection.startSession()
        session.startTransaction()
        try{
            if(file){
                const filepath = join(__dirname,'../../..','uploads/products',file.filename)
                const product = await this.ProductModel.findById(productID,null,{session}).select('+image.public_id').lean().exec()
                if(!product){ 
                    this.deletePhysicalFile(filepath)
                    throw new NotFoundException('Product not found.')
                }
                updateProductDto.image = await this.cloudinaryService.uploadFile(filepath)
                const updatedProduct = await this.ProductModel.findByIdAndUpdate(
                productID,
                updateProductDto,
                {
                    returnDocument:'after',
                    session
                }
                ).lean().exec()
                await this.cloudinaryService.deleteFile(product?.image.public_id)
                session.commitTransaction()
                return {
                ...updatedProduct,
                image:updatedProduct?.image.url
            }
            }
            const updatedProduct = await this.ProductModel.findByIdAndUpdate(
                productID,
                updateProductDto,
                {
                    returnDocument:'after',
                    session
                }
            ).lean().exec()
            session.commitTransaction()
            return {
                ...updatedProduct,
                image:updatedProduct?.image.url
            }
        }catch(error){
            session.abortTransaction()
            if(updateProductDto.image?.public_id){
                await this.cloudinaryService.deleteFile(updateProductDto.image.public_id)
            }
            if(error.name == 'ValidationError') throw new BadRequestException('Validation Failed.')
            if(error instanceof MongooseError) throw new InternalServerErrorException('Something went wrong.')
            throw error
        }
    }
    async delete(productID:string){
        const session = await this.connection.startSession()
        session.startTransaction()
        try{
            const product =await this.ProductModel.findById(productID,null,{session}).select('+image.public_id').lean().exec()
            if(!product) throw new NotFoundException('Product not found.')
            await this.ProductModel.findByIdAndDelete(productID,{session})
            await this.cloudinaryService.deleteFile(product.image.public_id)
            session.commitTransaction()
            return ;
        }catch(error){
            session.abortTransaction()
            if(error instanceof MongooseError) throw new InternalServerErrorException('Failed to delete.')
            throw error
        }
    }
    deletePhysicalFile(filepath){
          fs.unlink(filepath,(error)=>{
                        if(error) console.log("Error deleting file: ",error);
                    })
    }
}
