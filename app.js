const express=require("express");   
const app= express();
const cookieParser= require ('cookie-parser');
const path=require("path")
const db =require('./config/mongoose-connections.js')
const ownerRouter=require("./routes/ownerRouter");
const userRouter=require("./routes/userRouter");
const productRouter=require("./routes/productRouter");
const indexRouter=require('./routes/index');
const paymentRoute = require('./routes/paymentRoute');

const jwt =require("jsonwebtoken");
// const flash = require("connect-flash");
// const expressSession=require("express-session");

require("dotenv").config();


app.set("view engine","ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

app.use(cookieParser());
// app.use(
//     expressSession({
//         resave:false,
//         saveUninitialized:false,
//         secret:"xyzsss",
//     })
// );




// app.use(flash());
app.use(express.urlencoded({extended:true}));

app.use("/user",userRouter);
// product router
app.use("/product",productRouter);


app.use("/owner",ownerRouter);

app.use("/",indexRouter);



app.use('/payment',paymentRoute);





app.listen(3000);