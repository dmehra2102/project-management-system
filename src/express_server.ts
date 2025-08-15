import { DatabaseUtil } from "./utils/db";
import { createServer, Server } from "http";
import express, { Application } from "express";
import { IServerConfig } from "./utils/config";
import * as config from "../server_config.json";

export class ExpressServer {
  private app: Application;
  private server: Server | null = null;
  public server_config: IServerConfig = config;

  constructor() {
    this.app = express();

    this.setupMiddleware();
    this.connectToDatabase();
  }

  private connectToDatabase() {
    new DatabaseUtil();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
  }

  public start(): void {
    const { port } = this.server_config;
    this.server = createServer(this.app);

    this.server.listen(port, () => {
      console.log(`✅ Server running on port ${port} (PID: ${process.pid})`);
    });

    // Handling Graceful shutdown
    process.on("SIGTERM", () => this.closeServer());
    process.on("SIGINT", () => this.closeServer());
  }

  public closeServer(): void {
    if (this.server) {
      this.server.close(() => {
        console.log("🛑 Server closed");
        process.exit(0);
      });
    }
  }
}
