import { ReturnUserDto } from "src/user/dtos/returnUser.dto";

export interface returnLoginDto {
    user: ReturnUserDto;
    acessToken: string;
}