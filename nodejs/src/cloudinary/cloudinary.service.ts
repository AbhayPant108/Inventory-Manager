import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { error } from 'console';
import fs from 'fs'
@Injectable()
export class CloudinaryService {
    async uploadFile(filePath:string){
        try{
            const result = await cloudinary.uploader.upload(filePath)
            return {
                public_id:result.public_id,
                url:result.url
            }
        }catch(error){
            console.log(error);
            throw new InternalServerErrorException('Failed to upload to cloud.')
        }finally{
            fs.unlink(filePath,(error)=>{
                if(error) console.log("Error deleting file: ",error);
            })
        }
    }   
    async deleteFile(public_id:string){
        try {
            await cloudinary.uploader.destroy(public_id)
            return 
        } catch (error) {
            throw new InternalServerErrorException('Failed to delete image.')
        }
    }
}
