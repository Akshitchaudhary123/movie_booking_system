import { Module } from '@nestjs/common';
import { RoleRepository } from './repositories/role.repository';
import { PrismaRoleRepository } from './repositories/prisma-role.repository';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { RoleService } from './roles.service';

@Module({

    imports:[PrismaModule],
    exports:[RoleService],
    providers:[{
        provide:RoleRepository,
        useClass:PrismaRoleRepository
    },
    RoleService
]
})
export class RolesModule {}
