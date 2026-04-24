import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { LoginUserDto } from './dtos/login.dto';
import bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel:Model<User>,
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService
    ) {}
    async loginUser(loginUserDto:LoginUserDto){
        const existedUser = await this.UserModel.findOne({email:loginUserDto.email}).select('+password +full_name')
        if(!existedUser) throw new NotFoundException('User with this email does not exists.')
        const isPasswordCorrect = bcrypt.compareSync(loginUserDto.password,existedUser.get('password'))
        if(!isPasswordCorrect) throw new UnauthorizedException('Incorrect Password')

        const payload = { id:existedUser.id, username: existedUser.username, email:existedUser.email };
        console.log(existedUser);
        return {
        access_token: await this.jwtService.signAsync(payload,{secret:this.configService.get('JWT_SECRET_KEY')}),
        user:existedUser.toObject()
        };
       
    }


}
