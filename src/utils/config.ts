export interface IServerConfig {
  port: number;
  db_Config: {
    db: string;
    username: string;
    password: string;
    host: string;
    port: number;
    dbname: string;
  };
}
