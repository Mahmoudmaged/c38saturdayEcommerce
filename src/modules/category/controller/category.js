import { create, find, findById, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/category.model.js";
import subCategories from "../../../../DB/model/subCategory.model.js";

import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handelError.js";
import { paginate } from "../../../services/pagination.js";


export const createCategory = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new Error('Image is required', { cause: 400 }))
    } else {
        const { name } = req.body
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `ECommerce/saturday/categories` })
        const result = await create({
            model: categoryModel,
            data: {
                name,
                image: secure_url, createdBy: req.user._id, publicImageId: public_id
            }
        })
        if (!result) {
            await cloudinary.uploader.destroy(public_id)
            return next(new Error('fail to add u category', { cause: 400 }))
        } else {
            return res.status(201).json({ message: "Done", result })
        }
    }
})

export const updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: 'ECommerce/saturday/categories' })
        req.body.image = secure_url
        req.body.publicImageId = public_id
    }
    const result = await findOneAndUpdate({
        model: categoryModel,
        filter: { _id: id },
        data: req.body
    })
    if (!result) {
        await cloudinary.uploader.destroy(req.body.publicImageId)
        return next(new Error('fail to add u category', { cause: 400 }))
    } else {
        if (req.file) {
            await cloudinary.uploader.destroy(result.publicImageId)
        }
        return res.status(201).json({ message: "Done", result })
    }
})

export const getCategory = asyncHandler(async (req, res, next) => {

    const { id } = req.params
    const category = await findById({
        model: categoryModel, filter: { _id: id }, populate: [{
            path: 'createdBy',
            select: "userName email"
        }]
    })
    return res.status(200).json({ message: "Done", category })

})

export const categories = asyncHandler(async (req, res, next) => {

    const { skip, limit } = paginate(req.query.page, req.query.size)

    const result = await find({
        model: categoryModel,
        filter: {},
        skip,
        limit,
        populate: [
            {
                path: 'createdBy',
                select: "userName email"
            },
            {
                path: 'subcategoryId'
            }
        ]
    })
    return res.status(200).json({ message: "Done", result })
})