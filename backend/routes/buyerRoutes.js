import express from "express";
import { registerBuyer, loginBuyer } from "../controllers/buyerController.js";

const router = express.Router();

router.post("/register", registerBuyer);
router.post("/login", loginBuyer);

export default router;
