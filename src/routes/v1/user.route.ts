import { Router } from 'express';

import { userController } from '../../controllers';
import validate from '../../middlewares/validate';
import { validateUser } from '../../validations';
import authJWT from '../../middlewares/auth';

const router = Router();

router.use(authJWT('manageUsers'));

router
  .route('/')
  .post(validate(validateUser.createUserSchema), userController.createUser)
  .get(userController.getUsers);
router
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
