import { Controller ,Get,Post} from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get()
    sendMessage(){
        return {message:"Hello Nestjs !"}
    }
}
