import { Schema, model, Types } from "mongoose";


const brandSchema = new Schema({

    name: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase: true,
        trim: [true]
    },
    slug: String,
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
    }
    ,
    publicImageId: String
}, {
    timestamps: true
})


const brandModel = model('Brand', brandSchema)
export default brandModel