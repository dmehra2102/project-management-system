import { Router } from "express";
import { Routes } from "../../utils/route";
import { CommentController } from "./comments_controller";

export class CommentRoutes implements Routes {
  public baseEndPoint: string = "/api/comments";
  public router: Router = Router();
  private commentsController = new CommentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.baseEndPoint)
      .get(this.commentsController.getDetailsHandler)
      .post(this.commentsController.addHandler);

    this.router
      .route(`${this.baseEndPoint}/:id`)
      .get(this.commentsController.getDetailsHandler)
      .put(this.commentsController.updateHandler)
      .delete(this.commentsController.deleteHandler);
  }
}
