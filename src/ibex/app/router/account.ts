import { createAccountHandler, getAccountByIdHandler, listAccountsHandler, updateAccountHandler } from "@ibex/app/controller/account";
import express, { Router } from "express";
import ibexAuthMiddleWare from "../middleware";

const router: Router = express.Router();

router.get("/", listAccountsHandler);
router.post("/", ibexAuthMiddleWare, createAccountHandler);
router.put("/:accountId", ibexAuthMiddleWare, updateAccountHandler);
router.get("/:accountId", getAccountByIdHandler);

// GET /users/:id - Get a user by ID
// router.get('/:id', getUserByIdHandler);

export default router;
