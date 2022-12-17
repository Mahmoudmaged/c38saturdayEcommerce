import { Router } from "express";
import * as productController from './controller/product.js'
import { myMulter, fileValidation } from '../../services/multer.js'
import { endPoint } from './product.endPoint.js'
import { auth } from "../../middleware/auth.js";
import wishlist from '../wishlist/wishlist.router.js'
import review from '../reviews/reviews.router.js'

const router = Router()



router.use('/:productId/wishlist', wishlist)
router.use('/:productId/review', review)


router.get('/',
    productController.productsList
)



router.post('/',
    auth(endPoint.create),
    myMulter(fileValidation.image).array('image', 7),
    productController.createProduct
)

router.put('/:id',
    auth(endPoint.update),
    myMulter(fileValidation.image).array('image', 7),
    productController.updateProduct
)





export default router