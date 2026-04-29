import { SetMetadata } from "@nestjs/common";
import { ModelNameEnum } from "../enums/model-name.enum";
import { AccessEnum } from "../enums/access.enum";
import { PERMISSIONS_KEY } from "../guards/permissions.guard";

export const Permissions = (...permissions: { model: ModelNameEnum; access: AccessEnum }[]) => SetMetadata(PERMISSIONS_KEY, permissions)