import cluster from "cluster";
import { ExpressServer } from "./express_server";
import {
  ProjectRoutes,
  RoleRoutes,
  UserRoutes,
  TaskRoutes,
  CommentRoutes,
} from "./routes";

const server = new ExpressServer([
  new RoleRoutes(),
  new UserRoutes(),
  new TaskRoutes(),
  new CommentRoutes(),
  new ProjectRoutes(),
]);

server.start();

process.on("uncaughtException", (error: Error) => {
  console.error(`Uncaught exception in worker process ${process.pid}:`, error);
  server.closeServer();

  setTimeout(() => {
    cluster.fork();
    cluster.worker.disconnect();
  }, 1000);
});
