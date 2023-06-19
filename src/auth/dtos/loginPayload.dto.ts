import { User } from "@prisma/client";

export class loginPayloadDto {
    id: number;
    typeUser: number;


    constructor(private readonly user: User) {
        this.id = user.id;
        this.typeUser = user.typeUser;
    }

    toJSON(): any {
        return {
          id: this.id,
          typeUser: this.typeUser,
        };
    }
}