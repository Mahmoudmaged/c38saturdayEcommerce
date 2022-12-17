
import { Schema, model, Types } from "mongoose";


const productSchema = new Schema({

    name: {
        type: String,
        unique: [true, 'name must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true,
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    images: {
        type: [String],
        required: [true, 'images is required'],
    },
    publicImageIds: [String],

    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'Can not add Product without owner'
        ]
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
    },
    stock: {
        type: Number,
        default: 0,
        required: [true, 'Start-stock is required'],
    },
    amount: {
        type: Number,
        default: 0
    }
    ,
    soldCount: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    discount: {
        default: 0,
        type: Number
    },
    finalPrice: {
        type: Number,
        required: [true, 'FinalPrice is required'],
    },
    colors: [String],
    sizes: { type: [String], enum: ['sm', 'l', 'xl', 'm'] },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [true, 'categoryId is required'],
    },
    subcategoryId: {
        type: Types.ObjectId,
        ref: 'SubCategory',
        required: [true, 'subCategoryId is required'],
    },
    brandId: {
        type: Types.ObjectId,
        ref: 'Brand',
        required: [true, 'brandId is required'],
    },


}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

})

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'productId',
});
const productModel = model('Product', productSchema)
export default productModel