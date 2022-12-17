import { asyncHandler } from '../../../services/handelError.js'
import { create, find, findOne } from '../../../../DB/DBMethods.js'
import orderModel from '../../../../DB/model/order.model.js'
import reviewModel from '../../../../DB/model/reviews.model.js'




export const createReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { message, rating } = req.body;
    const { _id } = req.user
    const checkReview = await findOne({
        model: reviewModel,
        filter: { userId: _id, productId }
    })
    if (checkReview) {
        return next(new Error('Already reviewed by you', { cause: 409 }))
    }
    const order = await findOne({
        model: orderModel,
        filter: {
            userId: _id,
            status: "received",
            'products.productId': productId
        },
        populate: [
            {
                path: "products"

            }
        ]
    })

    if (!order) {
        return next(new Error('Sorry u have to finish you order first', { cause: 400 }))
    }

    const review = await create({
        model: reviewModel,
        data: {
            userId: _id,
            productId,
            message,
            rating
        }
    })

    return res.status(200).json({ message: "Done", review })
})