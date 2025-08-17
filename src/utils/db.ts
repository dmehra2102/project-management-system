import { DataSource, Repository } from "typeorm";
import { IServerConfig } from "./config";
import * as config from "../../server_config.json";
import { Tasks } from "./../components/tasks/tasks_entity";
import { Users } from "./../components/users/users_entity";
import { Roles } from "./../components/roles/roles_entity";
import { Comments } from "./../components/comments/comments_entity";
import { Projects } from "./../components/projects/projects_entity";

export class DatabaseUtil {
  private static instance: DatabaseUtil;
  public server_config: IServerConfig = config;
  private static connection: DataSource | null = null;
  private repositories: Record<string, Repository<any>> = {};

  constructor() {
    this.connectDatabase();
  }

  private async connectDatabase() {
    try {
      const db_config = this.server_config.db_Config;
      const AppDataSource = new DataSource({
        type: "postgres",
        host: db_config.host,
        port: db_config.port,
        username: db_config.username,
        password: db_config.password,
        database: db_config.dbname,
        entities: [Roles, Users, Projects, Tasks, Comments],
        synchronize: true,
        logging: false,
      });

      await AppDataSource.initialize();
      DatabaseUtil.connection = AppDataSource;
      console.log("Connected to the database");
      return DatabaseUtil.connection;
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  public static async getInstance(): Promise<DatabaseUtil> {
    if (!DatabaseUtil.instance) {
      DatabaseUtil.instance = new DatabaseUtil();
      await DatabaseUtil.instance.connectDatabase();
    }

    return DatabaseUtil.instance;
  }

  public getRepository(entity) {
    try {
      if (DatabaseUtil.connection) {
        const entityName = entity.name;

        if (!this.repositories[entityName]) {
          this.repositories[entityName] =
            DatabaseUtil.connection.getRepository(entity);
        }

        return this.repositories[entityName];
      }
      return null;
    } catch (error) {
      console.error(`Error while getRepository => ${error.message}`);
    }
  }
}
