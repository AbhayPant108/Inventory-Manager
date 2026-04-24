import { Body, Controller ,Get,HttpCode,Post, Res} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import {type CreateUserDto ,CreateUserZodSchema} from 'src/user/dto/create-user.dto';
import { ZodValidationPipe } from 'src/zodValidation.pipe';
import { UserService } from 'src/user/user.service';
import { type LoginUserDto ,LoginUserZodSchema } from './dtos/login.dto';
import { AuthService } from './auth.service';
import {type Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService:UserService,private readonly authService:AuthService) {}
    @Post('register')
    async register(@Body(new ZodValidationPipe(CreateUserZodSchema)) createUserDto:CreateUserDto){ 
        await this.userService.createUser(createUserDto);
        return {
            message:'User registered successfully.'
        }
    }
    @Post('login')
    async login(@Body(new ZodValidationPipe(LoginUserZodSchema)) loginUserDto:LoginUserDto ,@Res({passthrough:true}) response:Response){
        const loggedInUser = await this.authService.loginUser(loginUserDto)
        response.cookie('access_token',loggedInUser.access_token,{
            secure:false,
            httpOnly:true,
            path:'/',
            sameSite:'lax',
            maxAge: 1200 * 1000
        })
        return {
            message:'User logged in successfully.',
            user:loggedInUser.user
        }
    }
    @Get('logout')
    async logout(@Res({passthrough:true}) response:Response){
        response.clearCookie('access_token')
        return {
            message:'Logged out successfully.'
        }
    }
}
