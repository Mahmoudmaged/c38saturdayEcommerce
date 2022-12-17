import { findById, updateOne } from "../../../../DB/DBMethods.js";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handelError.js";



export const add = asyncHandler(async (req, res, next) => {
    const { productId } = req.params

    const product = await findById({
        model: productModel,
        filter: productId
    })
    if (!product) {
        return next(new Error('In-valid product ID', { cause: 404 }))
    }
    await updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: { $addToSet: { wishlist: product._id } }
    })
    return res.status(200).json({ message: "Done" })
})


export const remove = asyncHandler(async (req, res, next) => {
    const { productId } = req.params

    const product = await findById({
        model: productModel,
        filter: productId
    })
    if (!product) {
        return next(new Error('In-valid product ID', { cause: 404 }))
    }
    await updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: { $pull: { wishlist: product._id } }
    })
    return res.status(200).json({ message: "Done" })
})