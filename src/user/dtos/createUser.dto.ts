import { IsString , IsInt} from "class-validator";

export class CreateUserDto {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsInt()
    typeUser: number;
}