import express from 'express'
import morgan from 'morgan'
import connectDB from '../../DB/connection.js'
import { globalError } from '../services/handelError.js'
import authRouter from './auth/auth.router.js'
import branRouter from './brand/brand.router.js'
import cartRouter from './cart/cart.router.js'
import categoryRouter from './category/category.router.js'
import couponRouter from './coupon/coupon.router.js'
import orderRouter from './order/order.router.js'
import productRouter from './product/product.router.js'
import reviewsRouter from './reviews/reviews.router.js'
import subcategoryRouter from './subcategory/subcategory.router.js'
import userRouter from './user/user.router.js'
import cors from 'cors'



export const appRouter = (app) => {
    //baseURL
    const baseUrl = process.env.BASEURL

    //convert Buffer Data
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    // cors
    app.use(cors({}))
    //setup morgan mode
    if (process.env.MOOD === 'DEV') {
        app.use(morgan('dev'))
    } else {
        app.use(morgan('common'))
    }

    //Setup API Routing 
    app.get("/", (req,res)=>{
        res.send("<h1> Home Page</h1>")
    })
    app.use(`${baseUrl}/auth`, authRouter)
    app.use(`${baseUrl}/user`, userRouter)
    app.use(`${baseUrl}/product`, productRouter)
    app.use(`${baseUrl}/subCategory`, subcategoryRouter)
    app.use(`${baseUrl}/category`, categoryRouter)
    app.use(`${baseUrl}/reviews`, reviewsRouter)
    app.use(`${baseUrl}/coupon`, couponRouter)
    app.use(`${baseUrl}/cart`, cartRouter)
    app.use(`${baseUrl}/order`, orderRouter)
    app.use(`${baseUrl}/brand`, branRouter)
    app.use('*', (req, res, next) => {
        return next(new Error("In-valid Routing Plz check url  or  method", { cause: 404 }))
    })

    //global handling Error
    app.use(globalError)

    //connect DB
    connectDB()
}