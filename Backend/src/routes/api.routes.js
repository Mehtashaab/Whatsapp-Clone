import {Router} from 'express';
import { loginUser, logoutUser, registerUser,userDetails,updateUser,searchUser } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';


const router = Router();

// Define routes


router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)


router.route("/userDetails").get(isAuth, userDetails);
router.route("/updateUser").put(updateUser);
router.route("/searchUser").post(searchUser);

export default router;
