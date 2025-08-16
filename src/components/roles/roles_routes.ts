import { Router } from "express";
import { Routes } from "../../utils/route";
import { RoleController } from "./roles_controller";

export class RoleRoutes implements Routes {
  public baseEndPoint = "/api/roles";
  public router: Router = Router();
  private roleController = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.baseEndPoint)
      .get(this.roleController.getAllHandler)
      .post(this.roleController.addHandler);

    this.router
      .route(`${this.baseEndPoint}/:id`)
      .get(this.roleController.getDetailsHandler)
      .put(this.roleController.updateHandler)
      .delete(this.roleController.deleteHandler);
  }
}
