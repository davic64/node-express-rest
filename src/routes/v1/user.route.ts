import { Router } from 'express';
import { userController } from '../../controllers';
import validate from '../../middlewares/validate';
import { validateUser } from '../../validations';

const router = Router();
router
  .route('/')
  .post(validate(validateUser.createUserSchema), userController.createUser)
  .get(userController.getUsers);
router
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .delete(userController.deleteUser);

export default router;
