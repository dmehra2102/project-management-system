import { Router } from "express";
import { Routes } from "../../utils/route";
import { TasksController } from "./tasks_controller";

export class TaskRoutes implements Routes {
  public baseEndPoint: string = "/api/tasks";
  public router: Router = Router();
  private tasksController = new TasksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.baseEndPoint)
      .get(this.tasksController.getAllHandler)
      .post(this.tasksController.addHandler);

    this.router
      .route(`${this.baseEndPoint}/:id`)
      .get(this.tasksController.getDetailsHandler)
      .put(this.tasksController.updateHandler)
      .delete(this.tasksController.deleteHandler);
  }
}
