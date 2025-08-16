import cluster from "cluster";
import { ExpressServer } from "./express_server";
import { RoleRoutes } from "./routes";

const server = new ExpressServer([new RoleRoutes()]);

server.start();

process.on("uncaughtException", (error: Error) => {
  console.error(`Uncaught exception in worker process ${process.pid}:`, error);
  server.closeServer();

  setTimeout(() => {
    cluster.fork();
    cluster.worker.disconnect();
  }, 1000);
});
