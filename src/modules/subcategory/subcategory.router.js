import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./subcategory.endPoint.js";
import * as subCategoryController from './controller/subCategory.js'
const router = Router({ mergeParams: true })

router.post('/', auth(endPoint.createSubCategory),
    myMulter(fileValidation.image).single('image'),
    subCategoryController.createSubCategory)

router.put('/:subcategoryId', auth(endPoint.updateSubCategory),
    myMulter(fileValidation.image).single('image'),
    subCategoryController.updateSubCategory)


// router.get('/', auth(endPoint.getSubCategories),
//     subCategoryController.getCategoryWithSubcategories)
    
router.get('/list', subCategoryController.subcategories)
router.get('/:subcategoryId', subCategoryController.getSubCategoryByID)






export default router