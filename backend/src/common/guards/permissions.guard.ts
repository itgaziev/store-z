import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ModelNameEnum } from "../enums/model-name.enum";
import { AccessEnum } from "../enums/access.enum";

export const PERMISSIONS_KEY = 'permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<{ model: ModelNameEnum; access: AccessEnum }[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        if (!user.role) {
            return false;
        }

        if (user.role.name === 'ADMIN') {
            return true;
        }

        const rolePermissions = user.role.permissions || [];

        return requiredPermissions.some(({ model, access }) => {
            const requiredAccessIdx = Number(AccessEnum[access]);

            const permission = rolePermissions.find(p => p.modelName === model);
            if (!permission) {
                return false;
            }

            const userAccessIdx = Number(AccessEnum[permission.access as keyof typeof AccessEnum]);
            return userAccessIdx >= requiredAccessIdx;
        });
    }
}