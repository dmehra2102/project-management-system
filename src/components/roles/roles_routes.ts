import { Router } from "express";
import { body } from "express-validator";
import { Routes } from "../../utils/route";
import { validate } from "../../utils/validator";
import { RoleController } from "./roles_controller";

const validRoleInput = [
  body("name").trim().notEmpty().withMessage("It should be required"),
  body("description")
    .isLength({ max: 200 })
    .withMessage("It has maximum limit of 200 characters"),
];

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
      .post(validate(validRoleInput), this.roleController.addHandler);

    this.router
      .route(`${this.baseEndPoint}/:id`)
      .get(this.roleController.getDetailsHandler)
      .put(validate(validRoleInput), this.roleController.updateHandler)
      .delete(this.roleController.deleteHandler);
  }
}
