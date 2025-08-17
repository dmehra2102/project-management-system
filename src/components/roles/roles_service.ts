import { Repository } from "typeorm";
import { Roles } from "./roles_entity";
import { DatabaseUtil } from "../../utils/db";
import { BaseService } from "../../utils/base_service";

export class RolesService extends BaseService<Roles> {
  constructor() {
    const databaseUtil = new DatabaseUtil();

    const roleRepository: Repository<Roles> = databaseUtil.getRepository(Roles);
    super(roleRepository);
  }
}
