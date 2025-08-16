import { Router } from "express";

export interface Routes {
  baseEndPoint: string;
  router: Router;
}
