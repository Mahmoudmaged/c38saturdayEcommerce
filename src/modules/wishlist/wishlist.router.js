



import { Router } from "express";
import * as wishList from './controller/wishlist.js'
import { endPoint } from './wishlist.endPoint.js'
import { auth } from "../../middleware/auth.js";
const router = Router({ mergeParams: true })

router.patch('/add', auth(endPoint.add), wishList.add)



router.patch('/remove', auth(endPoint.remove),wishList.remove)




export default router