export const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            return next(new Error(err))
        });
    };
};

export const globalErrorHandling = (err, req, res, next) => {
    {
        return res.json({
            errMessage: err.message,
            stack: err.stack,

        });
    }
}
