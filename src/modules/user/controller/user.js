import { userModel } from "../../../../database/models/user.model.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { taskModel } from "../../../../database/models/task.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { StatusCodes } from "http-status-codes";

// * 1 - signUp

const signUp = asyncHandler(
    async (req, res, next) => {
        const { userName, email, password, age, gender, phone } = req.body;

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return next(new Error("Email already exists"));
        }

        const hash = bcrypt.hashSync(password, +process.env.SALT_ROUND);

        await userModel.insertMany({ userName, email, password: hash, age, gender, phone });

        res.status(201).json({ message: "User created successfully" });
    }
)

// * 2 - Log in

const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
        const match = await bcrypt.compareSync(password, user.password);

        if (match) {
            await userModel.findByIdAndUpdate(user._id, { isOnline: true, isDeleted: false });

            let token = Jwt.sign({ id: user._id, name: user.userName, isOnline: true }, process.env.JWT_KEY, { expiresIn: "1h" });

            res.status(200).json({ message: "User logged in successfully", token });
        } else {
            return next(new Error("Password incorrect"));
        }
    } else {
        return next(new Error("User not found"));
    }
});


//*  3 - Change Password

const changePassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword, cPassword } = req.body;
    if (newPassword !== cPassword) {
        return next(new Error("Password doesn't match"));
    }
    const match = bcrypt.compareSync(oldPassword, req.user.password);
    if (!match) {
        return next(new Error("Old password miss matches your password"));
    }
    const hashPassword = bcrypt.hashSync(newPassword, process.env.SALT_ROUND);

    await userModel.findByIdAndUpdate(
        { _id: req.user.id },
        { password: hashPassword }
    );
    res.json({ message: "Password Changed Successfully" })
})

//* 4-update user

const updateProfile = asyncHandler(
    async (req, res) => {

        const { userName, age, phone } = req.body;
        const updateUser = await userModel.findOneAndUpdate(
            { _id: req.user.id },
            { userName, age, phone }
        );
        return res.json({ message: "user updated successfully!", updateUser });

        return next(new Error("you're not allowed to update, please try again to login again"));
    }

)


//* 5-delete user

const deleteUser = asyncHandler(async (req, res) => {
    const user = await userModel.deleteOne({ _id: req.user.id });

    return res.json({ message: "User Deleted Successfully", user });
})

//* 6-Soft delete user

const softDelete = asyncHandler(async (req, res) => {
    const { token } = req.headers;

    const decodedToken = Jwt.decode(token);

    if (!decodedToken) {
        return next(new Error("Invalid Token", { cause: StatusCodes.BAD_REQUEST }));
    }

    const checkUser = await userModel.findById(decodedToken.id);
    if (!checkUser) {
        return json({ message: "User Not Exists" });
    }

    if (checkUser.isOnline === "false") {
        return next(new Error("User must be logged in first"));
    }

    if (checkUser.isDeleted === "true") {
        return next(new Error("User Already soft deleted"));
    }

    await userModel.findByIdAndUpdate(
        { _id: decodedToken.id },
        { isDeleted: "true" }
    );
})

//* 7-logOut

const logOut = asyncHandler(async (req, res, next) => {

    if (req.user.isOnline === "false") {
        return next(new Error("User Already Logged Out"));

    }
    await userModel.findByIdAndUpdate(
        { _id: req.user.id },
        { isOnline: "false" }
    );
    return res.json({ message: "logOut Successfully" });

})

export {
    signUp,
    logIn,
    changePassword,
    updateProfile,
    deleteUser,
    softDelete,
    logOut,
};
