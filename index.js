const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {User} = require("./models/User");

const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());
//mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log("MongoDB Connected..."))
.catch(err => console.log(err))

//main화면에 띄우는 route
app.get('/', (req, res) => {
  res.send('Hello World! ')
})

//회원가입을 위한 register route
app.post('/register',(req, res) => {
  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)

  //mongoDB의 메소드
  //위 req.body 정보들이 user에 저장이 된 거
  user.save((err, userInfo)=>{
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.post('/login',(req, res)=>{

  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
  })
  //요청한 이메일이 데베에 존재한다면 비밀번호가 일치하는지 확인한다.
  user.comparePassword(req.body.password, (err, isMatch) =>{
    if(!isMatch) return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})

  })
  //비밀번호까지 일치한다면 토큰을 생성하기
  user.generateToken((err, user) => {
    if(err) return res.status(400).send(err);
    
    // token을 저장한다. 어디에? -> 쿠키, 로컬스토리지 등 여러곳에 저장 가능 
    //여기에선 쿠키에 저장한다
    res.cookie("x_auth", user.token)
    .status(200)
    .json({loginSuccess:true, userId: user._id})
  })

})

app.listen(port, () => 
  console.log(`Example app listening at http://localhost:${port}!`))