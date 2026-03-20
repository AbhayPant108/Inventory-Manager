import { OmitType, PartialType } from '@nestjs/mapped-types';
import {CreateUserZodSchema, type CreateUserDto } from './create-user.dto';
import z from 'zod';

export const UpdateUserZodSchema = 
CreateUserZodSchema.omit({
    password:true,
    email:true,
    username:true
}).partial()

export type UpdateUserDto = z.infer<typeof UpdateUserZodSchema>
