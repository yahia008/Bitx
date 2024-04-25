const asynchandle = require("../errors/asynchandler");
const auth = require("../modals/auth");
const jwt = require('jsonwebtoken')


const jwttoken = (_id) => {
    return jwt.sign(_id, process.env.connect, {
        expiresIn:'3d'
    })
}

const duplicate = (res,status,user) => {
        const token = jwttoken(user._id);
    res.status(status).json({
        success:'success',
        token,
        user
})

}

exports.signup = asynchandle(async (req, res, next) => {
    const createNewUser = await auth.create(req.body)

    duplicate(res,201,createNewUser)
})