const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const {User} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://chomjung:kan0905!@boilerplate.otqgk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,useFindAndModify:false
}).then(()=>console.log("MongoDB Connected..."))
.catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World!')
})

//회원가입을 위한 register route
app.post('/register',(req, res) => {
  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)

  //mongoDB 메소드
  //위 req.body 정보들이 user에 저장이 된 거
  user.save((err, userInfo)=>{
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success:true
    })
  })
})

app.listen(port, () => 
  console.log(`Example app listening at http://localhost:${port}!`))