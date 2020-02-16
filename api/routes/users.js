const express = require('express');
const router = express.Router();
const mangoose = require('mongoose');
const User = require('../models/user');
const JWT = require('jsonwebtoken');
const decode = require('jwt-decode');
const Hospital = require('../models/hospital')
// router.post('/authenicate', (req, res, next) => {
//     const userName = req.body.user;
//     const password = req.body.pass;
//     User.findOne(
//         {
//             emailId: userName,
//             password: password
//         }
//     )
//         .then(docs => {
//             console.log(docs);
//             console.log(docs.bloodGroup);
//               const token = JWT.sign(
//                 { bloodGroup:docs.bloodGroup,email:docs.emailId},
//                 "aman",
//                 { expiresIn: "31536000h" }
//               );
//             res.status(200).json(token);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

router.get('/:zipCode/:bloodGroup', (req, res, next) => {
    const zipCode = req.params.zipCode;
    const bloodGroup = req.params.bloodGroup;
    User.find(
        {
            zipCode: zipCode,
            bloodGroup: bloodGroup
        }
    )
        .exec()
        .then(docs => {
            res.status(200).json(docs);
            console.log(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:emailId', (req, res, next) => {
    const emailId = req.params.emailId;
    User.find(
        {
            emailId: emailId
        }
    )
        .exec()
        .then(docs => {
            res.status(200).json(docs);
            console.log(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.put('/:userName', (req, res, next) => {
    const emailId = req.params.userName;
    console.log("Put Email Id " + emailId);
    User.updateMany({ emailId: emailId }, {
        $set:
        {
            name: req.body.name,
            emailId: req.body.emailId,
            streetAddress: req.body.streetAddress,
            city: req.body.city,
            zipCode: req.body.zipCode,
            state: req.body.state,
            gender: req.body.gender,
            dateofBirth: req.body.dateofBirth,
            bloodGroup: req.body.bloodGroup,
            contactNumber: req.body.contactNumber,
        }
    }).exec()
        .then((result) => {
            console.log(result)
        }).catch((err) => {
            console.log(err);
        });
    res.status(201).json({
        message: 'Handling PUT requests to /Connections',
    });
});

router.patch('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.update({ _id: id }, { $set: { emailId: req.body.emailId } })
});

router.get('/',(req,res,next) => {
   res.render('signup1');
});
router.post('/check/:id',(req,res,next) =>{
var tok = decode(req.cookies.auth);
console.log(tok); 
    User.findOne({"_id":tok.id}).then((result) => {
        console.log(result);
        Hospital.findOne({"hospitalName":req.params.id},{"money":{$lt:result.wallet}}).then((result)=>{
            res.status(200).json({message:'success'});
        })
        res.status(200).json({message:'failure'});
    }).catch((err) => {
        console.log(err);
    });
});

// router.get('/1',(req,res,next) => {
//    res.render('login1');
// });
router.post('/', (req, res, next) => {

    console.log("Body From POST " + req.body.name);
    const user = new User({
        name: req.body.user,
        emailId: req.body.email,
        streetAddress: req.body.addr,
        city: req.body.city,
        zipCode: req.body.strCode,
        state: req.body.state,
        gender: req.body.gender,
        bloodGroup: req.body.bldgrp,
        contactNumber: req.body.contact,
        password: req.body.pass
    });
    user.save().then((result) => {

        console.log(result)
    }).catch((err) => {
        console.log(err);
    });
    res.render('login1');
    // res.status(201).json({
    //     message: 'Handling POST requests to /User',
    //     user: user
    // });
});

module.exports = router;