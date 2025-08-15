import { DataSource } from "typeorm";
import { IServerConfig } from "./config";
import * as config from "../../server_config.json";

export class DatabaseUtil {
  public server_config: IServerConfig = config;

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
        entities: [],
        synchronize: true,
        logging: false,
      });

      await AppDataSource.initialize();
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }
}
