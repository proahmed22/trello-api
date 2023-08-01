import Jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import { userModel } from './../../../database/models/user.model.js';



export const auth =async (req, res, next) => {
        const { token } = req.headers;
        if (!token) {
            return next(
                new Error("user token is required", { cause: StatusCodes.UNAUTHORIZED })
            );
        }

        const decodedToken = Jwt.verify(token, process.env.JWT_KEY);

        if (!decodedToken?.id) {
            return next(
                new Error("Invalid token payload", { cause: StatusCodes.BAD_REQUEST })
            );
        }

        const user = await userModel.findById(decodedToken.id);

        if (!user) {
            return next(
                new Error("Not registered account", { cause: StatusCodes.NOT_FOUND })
            );
        }


   

        req.user = user;

        return next();
    }




