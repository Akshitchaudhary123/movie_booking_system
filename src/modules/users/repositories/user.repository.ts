import {User} from "@prisma/client";

import { CreateUserData } from "../types/user.type";

export abstract class UserRepository{


    abstract findById(id: string): Promise<User | null>;

    abstract findByEmail(email: string): Promise<User | null>;

    abstract create(data: CreateUserData): Promise<User>;

}