import { Router } from "express";
import * as review from "./controller/review.js";
import {auth }from '../../middleware/auth.js'
import {endPoint}  from './reviews.endPoint.js'
const router = Router({mergeParams:true})




router.post('/',auth(endPoint.createReview)  ,review.createReview)




export default router