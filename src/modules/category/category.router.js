import { Router } from "express";
import { auth,  } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./category.endPoint.js";
import * as categoryController from './controller/category.js'
import subcategoryRouter from "../subcategory/subcategory.router.js";
const router = Router()


router.use('/:categoryId/subCategory' , subcategoryRouter)

router.post('/', auth(endPoint.createCategory), myMulter(fileValidation.image).single('image'),
    categoryController.createCategory)

router.put('/:id', auth(endPoint.updateCategory), myMulter(fileValidation.image).single('image'),
    categoryController.updateCategory)


router.get('/', auth(endPoint.getCategories),categoryController.categories)

router.get('/:id', categoryController.getCategory)




export default router