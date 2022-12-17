import { Router } from "express";
import * as registerController from './controller/registration.js'
import { validation } from '../../middleware/validation.js'
import * as validators  from './auth.validation.js'
const router = Router()



//signup 
router.post('/signup', validation(validators.signup), registerController.signup)

//confirmEmail
router.get('/confirmEmail/:token', validation(validators.token), registerController.confirmEmail)


//login
router.post('/login',validation(validators.login), registerController.login)


export default router