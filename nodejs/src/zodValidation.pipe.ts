import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform, ValidationError } from "@nestjs/common";
import { ZodError, ZodSchema ,z } from "zod";


export class ZodValidationPipe implements PipeTransform{
    constructor(private schema:ZodSchema) {}
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            const validateValue = this.schema.parse(value)
            return validateValue
        }catch(error){
            
            if(error instanceof ZodError){
                throw new BadRequestException(
                    {
                        message:"Validation failed.",
                        errors:z.flattenError(error).fieldErrors
                    },
                    {
                        cause:error.cause
                    }
                )
            }
        }

    }
}