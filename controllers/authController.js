const asynchandle = require("../errors/asynchandler");
const errorclass = require("../errors/errorclass");
const auth = require("../modals/auth");
const jwt = require('jsonwebtoken')


const jwttoken = (_id) => {
    return jwt.sign({ _id }, process.env.connect, {
        expiresIn:'3d'
    })
}

const duplicate = (res,status,user) => {
        const token = jwttoken(user._id);
 return   res.status(status).json({
        success:'success',
        token,
        user
})

}

exports.signup = asynchandle(async (req, res, next) => {
    const createNewUser = await auth.create(req.body)

    duplicate(res,201,createNewUser)
})


exports.login = asynchandle(async (req, res, next) => {
    const { password, email } = req.body
    
    if (!password || !email) {
        return next (new errorclass('please enter your email and password',400))
    }
    
    const finduser = await auth.findOne({ email }).select('+password')
    if (!finduser) {
        return next (new errorclass('no user with this email found',400))
    }
    if (!(await finduser.comperepassword(password, finduser.password))) { 
        return next (new errorclass('no user with this email found',400))
    }
    duplicate(res,201,finduser)
})

