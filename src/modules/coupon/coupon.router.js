import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./coupon.endPoint.js";
import * as coupon from './controller/coupon.js'
const router = Router()




router.get('/:name', coupon.coupons)
router.post('/', auth(endPoint.create), coupon.createCoupon)

router.put('/:id', auth(endPoint.create), coupon.updateCoupon)

router.patch('/:id/delete', auth(endPoint.create), coupon.deleteCoupon)





export default router