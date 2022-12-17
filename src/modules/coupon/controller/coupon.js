import { create, find, findByIdAndUpdate } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/coupon.js";
import { asyncHandler } from "../../../services/handelError.js";



export const coupons = asyncHandler(async (req, res, next) => {
    const coupon = await find({
        model:couponModel,
        filter: { name: req.params.name , deleted:false }
    })
    return res.status(200).json({ message: "Done", coupon })
})
export const createCoupon = asyncHandler(async (req, res, next) => {

    req.body.createdBy = req.user._id
    const coupon = await create({
        model: couponModel,
        data: req.body
    })
    return coupon ? res.status(201).json({ message: "Done" }) : next(new Error('fail to create', { cause: 400 }))
})


export const updateCoupon = asyncHandler(async (req, res, next) => {

    req.body.updatedBy = req.user._id
    const coupon = await findByIdAndUpdate({
        model: couponModel,
        filter: { _id: req.params.id },
        data: req.body
    })
    return coupon ? res.status(200).json({ message: "Done" }) : next(new Error('fail to update', { cause: 400 }))
})


export const deleteCoupon = asyncHandler(async (req, res, next) => {

    const coupon = await findByIdAndUpdate({
        model: couponModel,
        filter: { _id: req.params.id },
        data: { deleted: true, deletedBy: req.user._id }
    })
    return coupon ? res.status(200).json({ message: "Done" }) : next(new Error('fail to Delete', { cause: 400 }))
})