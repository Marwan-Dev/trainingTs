import { Router } from 'express';
import * as controllers from '../../controllers/users.controllers';
const routes = Router();

routes.route('/').get(controllers.getAllUsers).post(controllers.createUser);
routes
  .route('/:id')
  .get(controllers.getUserByID)
  .patch(controllers.updateUser)
  .delete(controllers.deleteUser);

routes.route('/signin').post(controllers.signIn);
export default routes;
