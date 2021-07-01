const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength:50
    },
    email:{
        type:String,
        trim: true,
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type: String,
        maxlength:50
    },
    role:{
        type: Number,
        default:0
    },
    image: String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

//user.save가 일어나기 전에 뒤에 적재된 function실행하고
//마지막 next()메소드를 통하여 user.save파트가 실행이 된다.
userSchema.pre('save', function(next){
    //req.body를 가져온다고 보면 되지?
    var user = this;

    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        if(user.isModified('password')){
            //plan password = user.password
            //hash = 암호화된 비밀번호
            bcrypt.hash(user.password,salt, function(err, hash){
                if(err) return next(err)
                user.password=hash
                next()
            })
        }
        
    })
    

})

const User = mongoose.model('User',userSchema)

module.exports = {User}