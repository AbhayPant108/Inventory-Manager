import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { LoginUserDto } from './dtos/login.dto';
import bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private UserModel:Model<User>) {}
    async loginUser(loginUserDto:LoginUserDto){
        const existedUser = this.UserModel.findOne({email:loginUserDto.email}).select('-id email +password')
        if(!existedUser) throw new NotFoundException('User with this email does not exists.')
        const isPasswordCorrect = bcrypt.compareSync(loginUserDto.password,existedUser.get('password'))
        if(!isPasswordCorrect) throw new UnauthorizedException('Incorrect Password')
    }
}
