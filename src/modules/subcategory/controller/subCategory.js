import { create, find, findById, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import categoryModel from "../../../../DB/model/category.model.js";

import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handelError.js";
import { paginate } from "../../../services/pagination.js";


export const createSubCategory = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new Error('Image is required', { cause: 400 }))
    } else {
        const { name } = req.body
        const { categoryId } = req.params
        const category = await findById({ model: categoryModel, filter: categoryId, select: "_id" })


        if (!category) {
            return next(new Error('In-valid parent category  ID', { cause: 404 }))
        } else {
            const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.file.path, { folder: `ECommerce/saturday/categories/${categoryId}/subcategory` })
            const result = await create({
                model: subCategoryModel,
                data: {
                    name, image: secure_url, categoryId: category._id,
                    createdBy: req.user._id, publicImageId: public_id
                }
            })
            return res.status(201).json({ message: "Done", result })
        }
    }
})

export const updateSubCategory = asyncHandler(async (req, res, next) => {
    const { categoryId, subcategoryId } = req.params
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `ECommerce/saturday/categories/${categoryId}/subcategory` })
        req.body.image = secure_url
        req.body.publicImageId = public_id
    }

    const result = await findOneAndUpdate({
        model: subCategoryModel,
        filter: { _id: subcategoryId },
        data: req.body
    })

    if (!result) {
        await cloudinary.uploader.destroy(req.body.publicImageId)
        return next(new Error("In-valid subcategory id", { cause: 404 }))
    } else {
        if (req.file) {
            await cloudinary.uploader.destroy(result.publicImageId)
        }
        return res.status(200).json({ message: "Done", result })
    }
})

export const getSubCategoryByID = asyncHandler(async (req, res, next) => {

    const { subcategoryId } = req.params
    const category = await findById({
        model: subCategoryModel,
        filter: subcategoryId,
        populate: [
            {
                path: 'createdBy',
                select: "userName email"
            },
            {
                path: 'categoryId'
            }
        ]
    })
    return res.status(200).json({ message: "Done", category })

})

export const subcategories = asyncHandler(async (req, res, next) => {
    console.log("Here");
    const { skip, limit } = paginate(req.query.page, req.query.size)
    const categoryList = await find({
        model: subCategoryModel,
        populate: [
            {
                path: 'createdBy',
                select: "userName email"
            },
            {
                path: 'categoryId'
            }
        ], skip, limit
    })
    return res.status(200).json({ message: "Done", categoryList })
})


export const getCategoryWithSubcategories = asyncHandler(async (req, res, next) => {

    const { categoryId } = req.params
    const { skip, limit } = paginate(req.query.page, req.query.size)
    const categoryList = await find({
        model: subCategoryModel,
        filter: { categoryId: categoryId },
        populate: [
            {
                path: 'createdBy',
                select: "userName email"
            },
            {
                path: 'categoryId'
            }
        ], skip, limit
    })
    return res.status(200).json({ message: "Done", categoryList })
})