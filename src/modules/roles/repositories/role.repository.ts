
import { Injectable } from "@nestjs/common";
import {Role} from "@prisma/client"

@Injectable()
export abstract class RoleRepository{


     abstract findByName(name:String):Promise<Role|null>

     abstract findById(id:String):Promise<Role|null>


}