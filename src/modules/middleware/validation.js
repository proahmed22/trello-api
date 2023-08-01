

 const validation = (JoiSchema)=>{

    return(req,res,next)=>{
        const validationResult = JoiSchema.validate({...req.body, ...req.params, ...req.query}, {abortEarly: false});
        if (validationResult.error) {
            return res.json({ message: "validation Error", validationErr: validationResult.error.details })
        }
        return next()
    }
}

export default validation