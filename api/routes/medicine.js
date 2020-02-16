const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Dispensary = require('../models/medicine')
const decode = require('jwt-decode');
const complaintEmail = require('./complaintEmail'); 
var GeoPoint = require('geopoint');
const User = require('../models/user');
// router.get('/zipCode', (req, res, next) => {
//     const hospitalZipCode = req.query.zip;
//     Hospital.find(
//         {
//             hospitalZipCode: hospitalZipCode,
//         }
//     )
//         .exec()
//         .then(docs => {
//             res.status(200).json(docs)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.get('/', (req, res, next) => {
//     const hospitalZipCode = req.query.zip;
//     Hospital.find(
//         {
//             hospitalZipCode: hospitalZipCode, 
//             icus: {$gt:0}
//         }
//     )
//         .exec()
//         .then(docs => {
//             res.status(200).json(docs)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.get('/filter/:zip/:id', (req, res, next) => {
//     const hospitalFilter = req.params.id;
//     Hospital.find(
//         {
//             hospitalZipCode: req.params.zip, 
//             icus: {$gt:0},
//             attr:{$elemMatch:{$eq:hospitalFilter}}
//         }
//     )
//         .exec()
//         .then(docs => {
//             res.status(200).json(docs)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });
router.post('/searchmedicine', (req, res, next) => {
    console.log("hospitalEmailId");
    var lat = req.body.lat;
    var lng = req.body.lng;
    var input = req.body.input;
    console.log(input);
    console.log(lat);
    console.log(lng);
    point1 = new GeoPoint(lat, lng); 
    console.log("AmanJIIII123");
    Dispensary.find(
        {medicines:{$elemMatch: {$eq:input}}}
    )
        .exec()
        .then(docs => {
            var doc = []
            var data = []
            var availibility = []
            var names= []
            var k = 0;
            console.log(docs);
            for (var i = docs.length - 1; i >= 0; i--) {
                point2 = new GeoPoint(docs[i].lat, docs[i].long);
                var distance = point1.distanceTo(point2, true);
                console.log(distance);
                if (distance < 10000) {doc.push(docs[i]);}
            }
            for (var i = doc.length - 1; i >= 0; i--) {
                var data1 = []  
                data1.push(doc[i].long);
                data1.push(doc[i].lat);
                data.push(data1);
                availibility.push(doc[i].icus);
                names.push(doc[i].hospitalName);
            }
            // console.log(data);
            User.find({}).then(result=>{
                req.userId = [];
                for(var i = 0;i<result.length;i++){
                    req.userId.push(result[i].emailId);
                }
            });
            if(data.length == 0){ console.log("Amanji");res.cookie('blood',input);res.status(200).json({data:data,availibility:availibility,names:names,input1:input});}           
            else{res.cookie('blood',input);res.status(200).json({data:data,availibility:availibility,names:names,input1:input})};
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

// router.post('/:token/:id', (req, res, next) => {
//    var tok = decode(req.session.token);
//     console.log(tok);
//     Hospital.findOne({"_id":req.params.id}).then(hospital =>{
//         hospital.icus = hospital.icus-1;
//     hospital.appointments.push(tok.id);
//     hospital.save().then(result=>{
//                 console.log("Added"+result);
//                 res.status(201).json({
//         message: 'Handling POST requests to /Appointments',
//     });
//             });
// });
// });


// router.get('/:hospitalEmailId/:hospitalZipCode', (req, res, next) => {
//     const hospitalEmailId = req.params.hospitalEmailId;
//     const hospitalZipCode = req.params.hospitalZipCode;
//     Hospital.find(
//         {
//             hospitalEmailId: hospitalEmailId,
//             hospitalZipCode : hospitalZipCode,
//         }
//     )
//         .exec()
//         .then(docs => {
//             res.status(200).json(docs)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.post('/authenicate', (req, res, next) => {
//     const hospitalName = req.body.hospitalEmailId;
//     const hospitalPassword = req.body.hospitalPassword;
//     console.log(hospitalName+" "+hospitalPassword);
//     Hospital.find(
//         {
//             hospitalEmailId: hospitalName,
//             hospitalPassword: hospitalPassword
//         }
//     )
//         .exec()
//         .then(docs => {
//             res.status(200).json(docs)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.put('/:emailId', (req, res, next) => {
//     const hospitalEmailId = req.params.emailId;
//     console.log("Put Email Id " + hospitalEmailId);
//     Hospital.update({ hospitalEmailId: hospitalEmailId }, {
//         $set:
//         {
//             hospitalName: req.body.hospitalName,
//             hospitalContactNumber: req.body.hospitalContactNumber
//         }
//     })  .exec()
//         .then(docs => {
//             res.status(200).json(docs)
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.patch('/:userId', (req, res, next) => {
//     const id = req.params.userId;
//     Hospital.update({ _id: id }, { $set: { hospitalEmailId: req.body.hospitalEmailId } })
// });

router.post('/', (req, res, next) => {

    console.log("Body From POST " + req.body.name);
    const hospital = new Dispensary({
        dispencaryName: req.body.dispencaryName,
        // hospitalRegistrationNumber: req.body.hospitalRegistrationNumber,
        // hospitalEmailId: req.body.hospitalEmailId,
        // hospitalStreetAddress: req.body.hospitalStreetAddress,
        // hospitalCity: req.body.hospitalCity,
        hospitalZipCode: req.body.hospitalZipCode,
        // hospitalState: req.body.hospitalState,
        // hospitalContactNumber: req.body.hospitalContactNumber,
        // hospitalPassword: req.body.hospitalPassword,
        // icus:req.body.icus,
        medicines:req.body.medicines,
        long:req.body.long,
        lat:req.body.lat
    });
    hospital.save().then((result) => {

        console.log(result)
    }).catch((err) => {
        console.log(err);
    });;
    res.status(201).json({
        message: 'Handling POST requests to /User',
        hospital: hospital
    });
});

module.exports = router;