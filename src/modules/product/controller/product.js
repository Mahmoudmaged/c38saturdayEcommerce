import slugify from "slugify";
import { create, find, findById, findByIdAndUpdate, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js";
import subCategoryModel from "../../../../DB/model/subCategory.model.js";
import brandModel from "../../../../DB/model/Brand.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handelError.js";
import productModel from "../../../../DB/model/Product.model.js";
import { paginate } from "../../../services/pagination.js";



export const createProduct = asyncHandler(async (req, res, next) => {

    if (!req.files?.length) {
        return next(new Error('images are required', { cause: 400 }))
    }

    const { name, amount, discount, price, subcategoryId, categoryId, brandId } = req.body
    req.body.slug = slugify(name);
    req.body.stock = amount;

    discount ? req.body.finalPrice = price - (price * (discount / 100)) : req.body.finalPrice = price

    const category = await findOne({
        model: subCategoryModel,
        filter: { _id: subcategoryId, categoryId }
    })
    if (!category) {
        return next(new Error('In-valid category or subcategory IDs', { cause: 404 }))
    }

    const brand = await findOne({
        model: brandModel,
        filter: { _id: brandId }
    })
    if (!brand) {
        return next(new Error('In-valid brand ID', { cause: 404 }))
    }

    const images = []
    const publicImagesId = []

    for (const file of req.files) {
        const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `EcommerceOnline/${name}` })
        images.push(secure_url)
        publicImagesId.push(public_id)
    }

    req.body.images = images;
    req.body.publicImageIds = publicImagesId;
    req.body.createdBy = req.user._id
    const product = await create({
        model: productModel,
        data: req.body
    })

    if (product) {
        return res.status(201).json({ message: "Done", product })
    } else {

        for (const imageID of req.body.publicImageIds) {
            await cloudinary.uploader.destroy(imageID)

        }
        return res.status(400).json({ message: "Fail to create", })

    }


})


export const updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name, price, amount, discount, categoryId, subcategoryId, brandId } = req.body
    const product = await findById({
        model: productModel,
        filter: id
    })

    if (!product) {
        return next(new Error("In-valid product Id", { cause: 404 }))
    }

    if (name) {
        req.body.slug = slugify(name)
    }

    if (amount) {
        const calcStock = amount - product.soldCount
        calcStock >= 0 ? req.body.stock = calcStock : req.body.stock = 0;
    }

    if (price && discount) {
        req.body.finalPrice = price - (price * (discount / 100))
    } else if (price) {
        req.body.finalPrice = price - (price * (product.discount / 100))
    } else if (discount) {
        req.body.finalPrice = product.price - (product.price * (discount / 100))
    }

    if (categoryId && subcategoryId) {
        const category = await findOne({
            model: subCategoryModel,
            filter: { _id: subcategoryId, categoryId }
        })
        if (!category) {
            return next(new Error('In-valid category or subcategory IDs', { cause: 404 }))
        }

    }

    if (brandId) {
        const brand = await findOne({
            model: brandModel,
            filter: { _id: brandId }
        })
        if (!brand) {
            return next(new Error('In-valid brand ID', { cause: 404 }))
        }
    }


    if (req.files?.length) {
        const images = []
        const publicImagesId = []

        for (const file of req.files) {
            const { public_id, secure_url } = await cloudinary.uploader.upload(file.path, { folder: `EcommerceOnline/${name}` })
            images.push(secure_url)
            publicImagesId.push(public_id)
        }
        req.body.images = images;
        req.body.publicImageIds = publicImagesId;
    }
    req.body.updatedBy = req.user._id

    const updatedProduct = await findByIdAndUpdate({
        model: productModel,
        filter: { _id: product._id },
        data: req.body
    })

    if (updatedProduct) {
        if (req.files?.length) {
            for (const imageID of product.publicImageIds) {
                await cloudinary.uploader.destroy(imageID)
            }
        }

        return res.status(200).json({ message: "Done" })
    } else {
        if (req.body.publicImageIds) {
            for (const imageID of req.body.publicImageIds) {
                await cloudinary.uploader.destroy(imageID)
            }
        }
        return next(new Error("Fail to update", { cause: 400 }))
    }

})


export const productsList = asyncHandler(async (req, res, next) => {

    const { skip, limit } = paginate({ page: req.query.page, size: req.query.size })
    const products = await find({
        model: productModel,
        filter: {},
        skip,
        limit,
        populate: [
            {
                path: 'createdBy',
                select: 'userName image'
            },

            {
                path: 'updatedBy',
                select: 'userName image'
            },

            {
                path: 'subcategoryId',
                populate: {
                    path: 'categoryId'
                }
            },
            {
                path: "reviews"
            }
        ]
    })

    const productsList = []
    for (let i = 0; i < products.length; i++) {
        const convObj = products[i].toObject();
        let calcRating = 0;
        for (let j = 0; j < convObj.reviews.length; j++) {
            calcRating += convObj.reviews[j].rating;
        }
        convObj.avgRating = calcRating / convObj.reviews.length
        productsList.push(convObj)
    }


    return res.status(200).json({ message: "Done", productsList })
})


