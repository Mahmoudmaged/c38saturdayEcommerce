import joi from 'joi'


export const signup = {
    body: joi.object().required().keys({
        userName: joi.string().pattern(new RegExp(/[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,20}$/)).min(2).max(20).required().messages({
            'any.required': 'Plz enter your username',
            'string.base': 'Only char is acceptable',
        }),

        email: joi.string().email().required()
        ,
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
        ,
        cPassword: joi.string().valid(joi.ref('password')).required()
    })
}



export const login = {
    body: joi.object().required().keys({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required()
    })
}

export const token = {
    params: joi.object().required().keys({
        token: joi.string().required(),
    })
}