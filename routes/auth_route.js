import express from 'express';
import { signup,login,myProfile,logout } from '../controllers/user_controller.js';
import { protectRoute } from '../middleware/auth.js';

const authRouter = express.Router();


//user endpoints authentication

authRouter.post('/signup',signup);
authRouter.post('/login',login);
authRouter.post('/logout',protectRoute,logout);
authRouter.get('/me',protectRoute,myProfile);


export default authRouter;