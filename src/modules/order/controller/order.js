import { create, find, findById, findOne, updateOne } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/model/coupon.js";
import orderModel from "../../../../DB/model/order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHandler } from "../../../services/handelError.js";



export const createOrder = asyncHandler(async (req, res, next) => {

    const { products, couponId, address, phone } = req.body;
    let finalProducts = []
    let sumTotalPrice = 0;
    let finalPriceAfterDiscount = 0

    for (let i = 0; i < products.length; i++) {
        let product = products[i]
        console.log(product.productId);
        const checkedProduct = await findOne({
            model: productModel,
            filter: { _id: product.productId, stock: { $gte: product.quantity } }
        })
        console.log(checkedProduct);
        if (!checkedProduct) {
            return next(new Error(`fail to place this item to the order ${product.productId} `, { cause: 400 }))
        }

        product.totalPrice = (product.quantity * checkedProduct.finalPrice)
        sumTotalPrice = sumTotalPrice + product.totalPrice
        finalProducts.push(product)
    }


    req.body.totalPrice = sumTotalPrice


    if (couponId) {
        const coupon = await findOne({
            model: couponModel,
            filter: { _id: couponId, usedBy: { $nin: req.user._id } }
        })
        if (!coupon) {
            return next(new Error('in-valid coupon', { cause: 400 }))
        }
        finalPriceAfterDiscount = req.body.totalPrice - (req.body.totalPrice * (coupon.amount / 100))

    } else {
        finalPriceAfterDiscount = req.body.totalPrice
    }

    // res.json(finalProducts)
    const order = await create({
        model: orderModel,
        data: {
            userId: req.user._id,
            finalPrice: finalPriceAfterDiscount,
            totalPrice: sumTotalPrice,
            products: finalProducts,
            address,
            phone,
            couponId
        }
    })

    if (order) {
        if (couponId) {
            await updateOne({
                model: couponModel,
                filter: { _id: couponId },
                data: { $addToSet: { usedBy: req.user._id } }
            })
        }
        return res.status(201).json({ message: "Done", order })
    } else {
        return res.status(400).json({ message: "Fail" })
    }


})