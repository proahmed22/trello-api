import Joi from "joi";

export const signup = Joi.object({
    //body
    firstName: Joi.string().min(3).max(20),
    lastName: Joi.string().min(3).max(10),
    userName: Joi.string().alphanum().min(3).max(20).required(),
    email: Joi.string().email(
        { minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg', 'hambozo'] } }
    ).required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: Joi.string().valid(Joi.ref("password")).required(),
    //params

}).required();


export const login = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg'] } }).required(),
        password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),

    }).required()