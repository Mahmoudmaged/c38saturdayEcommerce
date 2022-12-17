import { Schema, model, Types } from "mongoose";


const subCategorySchema = new Schema({

    name: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true
    },
    image: {
        type: String,
        required: [true, 'image is required'],
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [
            true,
            'can not at category without owner'
        ]
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        required: [
            true,
            'can not at Subcategory without Category'
        ]
    },
    publicImageId:String


}, {
    timestamps: true
})


const subCategoryModel = model('SubCategory', subCategorySchema)
export default subCategoryModel