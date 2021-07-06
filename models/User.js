const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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
        }else{
            next()
        }
        
    })
    
    userSchema.methods.comparePassword = function(plainPassword, ch){
        //plainPassword 1234567 일 때, db에 있는 암호화된 비밀번호 가 같은지 체크해야함
        //복호화가 불가해서 plain을 암호화한 후 db에 있는 것과 같는지 확인하는 것
        bcrypt.compare(plainPassword, this.password, function(err, isMatch){
            if(err) return cb(err);
                cb(null, isMatch)
        })
    }

    userSchema.methods.generateToken = function(cb){

        var user = this;
        //jsonwebtoken을 이용해서 token을 생성하기

        var token = jwt.sign(user._id.toHexString(), 'secretToken')
 
        user.token = token
        user.save(function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    }

})

const User = mongoose.model('User',userSchema)

module.exports = {User}