import { Body, Controller ,Get,HttpCode,Post} from '@nestjs/common';
import { STATUS_CODES } from 'http';
import {type CreateUserDto ,CreateUserZodSchema} from 'src/user/dto/create-user.dto';
import { ZodValidationPipe } from 'src/zodValidation.pipe';
import { UserService } from 'src/user/user.service';
import { type LoginUserDto ,LoginUserZodSchema } from './dtos/login.dto';
import { AuthService } from './auth.service';

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
    async login(@Body(new ZodValidationPipe(LoginUserZodSchema)) loginUserDto:LoginUserDto ){
        await this.authService.loginUser(loginUserDto)
    }
}
