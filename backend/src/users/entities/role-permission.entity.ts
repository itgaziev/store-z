import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { ModelNameEnum } from "@/common/enums/model-name.enum";
import { AccessEnum } from "@/common/enums/access.enum";

@Entity('role_permissions')
export class RolePermission {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ name: 'role_id' })
    roleId: number;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ type: 'enum', enum: ModelNameEnum })
    modelName: ModelNameEnum;

    @Column({ type: 'enum', enum: AccessEnum })
    access: AccessEnum;
}