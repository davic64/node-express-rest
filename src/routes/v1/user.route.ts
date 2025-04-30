import { Router } from "express";
import { userController } from "../../controllers";
import validate from "../../middlewares/validate";
import { validateUser } from "../../validations";

const router = Router();
router.post(
  "/",
  validate(validateUser.createUserSchema),
  userController.createUser
);
export default router;
