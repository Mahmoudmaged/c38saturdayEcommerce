
import { Schema, model, Types } from "mongoose";


const reviewSchema = new Schema({


    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'can not at category without owner'
        ]
    },

    productId: {
        type: Types.ObjectId,
        ref: 'Product',
        required: [
            true,
            'can not at category without owner'
        ]
    },

    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'minimum rating 1'],
        max: [5, 'Max rating 5'],
    }

}, {
    timestamps: true
})


const reviewModel = model('Review', reviewSchema)
export default reviewModel