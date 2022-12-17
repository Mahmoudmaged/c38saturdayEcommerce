import userModel from "../../../../DB/model/User.model.js";
import bcrypt from 'bcryptjs'
import { sendEmail } from "../../../services/email.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from '../../../services/handelError.js'
import { findOne, updateOne } from "../../../../DB/DBMethods.js";


export const signup = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;
    const user = await findOne({ model: userModel, filter: { email }, select: 'email' })

    if (user) {
        return next(new Error('Email exist', { cause: 409 }))
    } else {
        const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND))
        const newUser = new userModel({ userName, email, password: hash })


        const token = jwt.sign({ id: newUser._id }, process.env.emailToken,
            { expiresIn: '1h' })
        const rfToken = jwt.sign({ id: newUser._id }, process.env.emailToken)

        const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`
        const rfLink = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshEmail/${rfToken}`

        const message = `
        <a href='${link}'>ConfirmEmail</a>
        <br>
        <a href='${rfLink}'>Request new confirmation email</a>

        `
        const emailResult = await sendEmail(email, 'Confirm-Email', message)
        if (emailResult.accepted.length) {
            await newUser.save()
            return res.status(201).json({ message: "Done", userId: newUser._id })
        } else {
            return next(new Error('please provide real email', { cause: 400 }))
        }
    }
})


export const confirmEmail = asyncHandler(async (req, res, next) => {


    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.emailToken)
    if (!decoded?.id) {
        // res.status(400).send("in-valid Payload")
        return next(new Error('in-valid Payload', { cause: 400 }))

    } else {
        await updateOne({
            model: userModel,
            filter: { _id: decoded.id, confirmEmail: false },
            data: { confirmEmail: true }
        })
        return res.redirect(process.env.FEURL)
    }
})




export const login = asyncHandler(async (req, res, next) => {

    const { email, password } = req.body;

    const user = await findOne({ model: userModel, filter: { email } })
    if (!user) {
        return next(new Error("Email not exist", { cause: 404 }))
    } else {
        if (!user.confirmEmail) {
            return next(new Error("Confirm your email first", { cause: 400 }))
        } else {
            if (user.blocked) {
                return next(new Error("Blocked User", { cause: 400 }))
            } else {
                const compare = bcrypt.compareSync(password, user.password)
                if (!compare) {
                    return next(new Error("In-valid Password", { cause: 400 }))
                } else {
                    const token = jwt.sign({ id: user._id, isLoggedIn: true }, process.env.tokenSignature,
                        { expiresIn: 60 * 60 * 24 })
                    return res.status(200).json({ message: "Done", token })
                }
            }
        }
    }
})