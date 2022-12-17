import { Router } from "express";
import { auth, } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./brand.endPoint.js";
import * as brandController from './controller/brand.js'
const router = Router()

router.post('/', auth(endPoint.create), myMulter(fileValidation.image).single('image'),
    brandController.createBrand)

router.put('/:id', auth(endPoint.update), myMulter(fileValidation.image).single('image'),
    brandController.updateBrand)

router.get("/", auth(endPoint.get), brandController.brands)







export default router