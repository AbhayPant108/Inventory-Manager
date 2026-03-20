import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import {createProductSchema, type CreateProductDto } from './dtos/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'src/zodValidation.pipe';
import { diskStorage } from 'multer';
import path, { extname } from 'path';
import { log } from 'console';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import {type UpdateProductDto, updateProductSchema } from './dtos/update-product.dto';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { file } from 'zod';

const multerOptions:MulterOptions = {
  storage:diskStorage({
      destination:'./uploads/products',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, `prod-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
}

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  // @Roles(['admin'])
  // @UseGuards(RoleGuard)
  @UseInterceptors(FileInterceptor('product_image',multerOptions))
  async addProduct(
    @Body(new ZodValidationPipe(createProductSchema)) createProductDto:CreateProductDto,
    @UploadedFile() file:Express.Multer.File
  ){
    if(!file) throw new BadRequestException('Product image is required.')
    await this.productService.create(createProductDto,file)
    return {
      message:'Product added Successfully.',
      statusCode:HttpStatus.CREATED
    }
  }

  @Get()
  async getAll(){
    const products = await this.productService.findAll()
    return {
      message:'Fetched all products.',
      results:products,
      statusCode:HttpStatus.OK
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('product_image',multerOptions))
  async update(@Param('id') id:string,@Body(new ZodValidationPipe(updateProductSchema)) updateProductDto:UpdateProductDto,@UploadedFile() file?:Express.Multer.File){
    const updatedProduct = await this.productService.update(updateProductDto,id,file)
    return {
      message:'Product updated successfully',
      results:updatedProduct,
      statusCode:HttpStatus.OK
    }
  }

  @Delete(':id')
  async delete(@Param('id') id:string){
    await this.productService.delete(id)
    return {
      message:'Product deleted successfully.',
      statusCode:HttpStatus.OK
    }
  }

}
