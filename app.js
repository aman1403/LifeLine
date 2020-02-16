const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer')
var session = require('express-session');
const app = express();
var flash = require('connect-flash');
const url = require("url");
const userRoutes = require('./api/routes/users');
const connectionRoutes = require('./api/routes/connections');
const hospitalRoutes = require('./api/routes/hospitals');
const emailRoutes = require('./api/routes/emails');
const appointmentRoutes = require('./api/routes/appointments');
const medicineRoutes = require('./api/routes/medicine');
const User = require('./api/models/user');
const Report= require('./api/models/report');
const path = require("path");
const JWT = require('jsonwebtoken');
var fs = require('fs');
var multer  =   require('multer');
const Hospital = require('./api/models/hospital');
// const https = require('https')
const request = require('request');
var decode = require('jwt-decode');
var cookieParser = require('cookie-parser')
const complaintEmail = require('./api/routes/complaintEmail'); 
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
});
var upload = multer({});

mongoose.connect(
    // 'mongodb://mayank:mayank@bscms-shard-00-00-m2sgv.mongodb.net:27017,bscms-shard-00-01-m2sgv.mongodb.net:27017,bscms-shard-00-02-m2sgv.mongodb.net:27017/test?ssl=true&replicaSet=BSCMS-shard-0&authSource=admin&retryWrites=true',
    "mongodb://localhost:27017/data",
    {
       useNewUrlParser: true
    }
).then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
   console.log(err);
    console.log("Connection failed!");
  });
// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//         expires: 600000
//     },
//   expires: 60000000
// }));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(flash());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
app.use('/users', userRoutes);
app.use('/connections', connectionRoutes);
app.use('/hospitals', hospitalRoutes);
app.use('/emails', emailRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/medicines', medicineRoutes);
// app.use((req, res, next) => {
//     const error = new Error('Not found');
//     error.status(404);
//     next(error);
// });
// app.use(function(req, res, next){
//   next();
// });

app.get('/1',(req,res,next)=>{
    console.log("Aman");
    res.render('login1');
});

app.get('/donation',(req,res,next)=>{
    res.render('donor',{data: []});
});


// app.get('/',(req,res,next)=>{
//     console.log("Amanjii");
//     res.render('index');
// });
app.post('/authenticate', (req, res, next) => {
    const userName = req.body.user;
    const password = req.body.pass;
    console.log(userName);
    console.log(password);
    User.find(
        {
            emailId: userName,
            password:password
        }
    )
        .then(docs => {
            console.log(docs[0]);
            console.log(docs[0].bloodGroup);
              const token = JWT.sign(
                { bloodGroup:docs[0].bloodGroup,name:docs[0].name,email:docs[0].emailId,id:docs[0]._id},
                "aman",
                { expiresIn: "31536000h" }
              );
              res.cookie('auth',token);
            res.render('first');
            // res.render('intro');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

app.post('/image', upload.single('image'), (req, res, next) => {
  // req.file is the `example` file or whatever you have on the `name` attribute: <input type="file" name="example" />
  // I believe it is a `Buffer` object.
  console.log(req.file);
  const encoded = req.file.buffer.toString('base64');
  console.log(encoded);
  request.post({
  headers: {'content-type' : 'application/json','x-api-key':'t6zLvTFMHj9bsoVRQS27m5KWpagXbu9V9Y3pIiGD'},
  url:     'https://rnbka6zd9j.execute-api.ap-southeast-1.amazonaws.com/default/getTextFromImage',
  json:    {Image:encoded},
  followAllRedirects: true,
}
, (error, res1, body) => {
  if (error) {
    console.error(error)
    return
  }
  console.log(`statusCode: ${res.statusCode}`)
  console.log(body);
  var arr = body.split('\n');
  console.log(arr);
  var arr1 = ['Haemoglobin','Packed Cell','LeucocyteCount','RBC Count','MCV','MCH','MCHC','Platelet Count','MPV','RDW'];
  var result = [];
  console.log(arr1);
  console.log(arr);
  for(var i =0;i<arr1.length;i++){
    var check=0;
    for(var j =0;j<arr.length;j++){
        if(arr1[i].toLowerCase()==arr[j].toLowerCase()){
            var index12=j+1;
            while(arr[index12]==''){
                index12++;
            }
            result.push(parseFloat(arr[index12]));
            check = 1;
            break;
        }
    }
    if (check==0){
      result.push('Novalue');
    }
  }
  var obj = new Report ({
    "Haemoglobin": result[0],
    "PackedCell": result[1],
    "LeucocyteCount": result[2],
    "RBCCount": result[3],
    "MCV": result[4],
    "MCH": result[5],
    "MCHC": result[6],
    "PlateletCount": result[7],
    "MPV":result[8],
    "RDW":result[9]
  });
  obj.save().then(result=>{
console.log(result);
  });
 res.render('home');
})
// Heamoglobin: String,
//   PackedCell: String,
//   LeucocyteCount: String,
//   RBCCount: String,
//   MCV: String,
//   MCH: String,
//   MCHC: String,
//   PlateletCount: String,
//   MPV: String,
//   RDW: String
//   // var post_data = {"Image":encoded};  
  // var post_options = {
  //     host: 'rnbka6zd9j.execute-api.ap-southeast-1.amazonaws.com',
  //     port: '80',
  //     path: '/default/getTextFromImage',
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //         'x-api-key': 't6zLvTFMHj9bsoVRQS27m5KWpagXbu9V9Y3pIiGD'
  //     }
  // };
  // var post_req = https.request(post_options, function(res) {
  //     res.setEncoding('utf8');
  //     res.on('data', function (chunk) {
  //         console.log('Response: ' + chunk);
  //     });
  // });

  // // post the data
  // post_req.write(post_data);
  // post_req.end();

});

app.post('/blood_email', (req, res, next) => {
  var tok = decode(req.cookies.auth);
  console.log("Bhaiya");
 console.log(tok);
  User.find({'bloodGroup':req.body.input}).then(result=>{
    req.userId = [];
    req.sender = tok.name;
    req.mobile = tok.contactNumber;
    console.log(result);
    for(var i = 0;i<result.length;i++){
        req.userId.push(result[i].emailId);
    }
});
return complaintEmail.complaintemail(req,res,next);
});


app.post('/med', (req, res, next) => {
  var tok = decode(req.cookies.auth);
  console.log("Bhaiya");
 console.log(tok);
  User.find({}).then(result=>{
    req.userId = [];
    req.sender = tok.name;
    req.mobile = tok.contactNumber;
    console.log(result);
    for(var i = 0;i<result.length;i++){
        req.userId.push(result[i].emailId);
    }
});
return complaintEmail.complaintemail(req,res,next);
});
app.get('/name', (req, res, next) => {
    const name = req.query.name;
    console.log(name);
    Hospital.find({hospitalName:name}).then(docs => {
        console.log("Amanjii111");
        console.log(docs);
            res.render('index3_icu',{data:docs[0]});
            // res.render('intro');
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});
// app.post('/image', (req, res, next) => {
//     console.log(req.file);
//      upload(req,res,function(err) {
//         if(err) {
//             return res.end("Error uploading file.");
//         }
//         res.end("File is uploaded");
//     });
// });
app.get('/icu',(req,res,next) =>{
  res.render('index2_icu');
  });

app.get('/index4',(req,res,next) =>{
res.render('index4_icu');
});
app.get('/getmor',(req,res,next) =>{
  res.render('index_morg');
  });
app.get('/first',(req,res,next) =>{
  res.render('first');
  });
  app.get('/logout',(req,res,next) =>{
    res.render('login1');
    });

app.get('/getblood',(req,res,next) =>{
res.render('index2_blood');
});
app.get('/medi',(req,res,next) =>{
  res.render('index2_medicine');
  });
app.get('/getwalet',(req,res,next) =>{
  var tok = decode(req.cookies.auth);
  User.findOne({'_id':tok.id}).then(result=>{
    console.log(result.wallet);
    res.render('wallet',{data:result.wallet});
  })
  });
app.get('/report',(req,res,next) =>{
res.render('suc');
});
app.get('/getperson',(req,res,next) =>{
  var tok = decode(req.cookies.auth);
  User.findOne({'_id':tok.id}).then(result=>{
    console.log(result);
    res.render('personal',{data:result});
  })
  });
  app.get('/getabout',(req,res,next) =>{
    res.render('about');
    });
  

module.exports = app; 