import express, { Router } from "express";
import ibexAuthMiddleWare from "@ibex/app/middleware";
import { getCurrencyHandler } from "@ibex/app/controller/currency";

const router: Router = express.Router();

router.get("/", ibexAuthMiddleWare, getCurrencyHandler);

export default router;
