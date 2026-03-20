import { Injectable, ConflictException, InternalServerErrorException, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, MongooseError } from 'mongoose';
import bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel:Model<User>) {}
  async createUser(createUserDto: CreateUserDto) {
    try{
      const existedUser = await this.UserModel.findOne({
        $or:[
          {username:createUserDto.username},
          {email:createUserDto.email}
        ]
      }).lean().exec()
      if(existedUser) throw new ConflictException('User with this username or email already exists.')
      createUserDto.password = bcrypt.hashSync(createUserDto.password,10)
      const newUser = await this.UserModel.create(createUserDto)
      return newUser
    }catch(error){
      if(error.name == 'ValidationError') throw new BadRequestException('Validation failed.')
      if(error instanceof MongooseError) throw new InternalServerErrorException()
      throw error
    }

}

  updateUser(id: number, user: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

}
