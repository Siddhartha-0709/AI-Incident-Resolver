import { Router } from "express";
import { createUser, getUserByEmail, loginUser, deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.route('/create-user').post(createUser);
router.route('/login-user').post(loginUser);
router.route('/get-user').get(getUserByEmail);
router.route('/delete-user').delete(deleteUser);

export default router;