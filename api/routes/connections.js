const express = require('express');
const router = express.Router();
const mangoose = require('mongoose');
const Connection = require('../models/connection');

router.get('/:emailId', (req, res, next) => {
    const emailId = req.params.emailId;
    Connection.find({ $or: [{ senderUserEmailId : emailId }, { receiverUserEmailId : emailId }] })
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});


router.get('/:senderUserEmailId/:receiverUserEmailId', (req, res, next) => {
    const senderUserEmailId = req.params.senderUserEmailId;
    const receiverUserEmailId = req.params.receiverUserEmailId;
    Connection.find({ receiverUserEmailId : receiverUserEmailId, senderUserEmailId : senderUserEmailId })
        .exec()
        .then(docs => {
            res.status(200).json(docs)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {

    const connection = new Connection({

        senderUserEmailId : req.body.senderUserEmailId,
        senderUserName : req.body.senderUserName,
        senderUserBloodGroup : req.body.senderUserBloodGroup,
        receiverUserEmailId : req.body.receiverUserEmailId,
        receiverUserName : req.body.receiverUserName,
        receiverUserBloodGroup : req.body.receiverUserBloodGroup,
        status : req.body.status,
    });
    connection.save().then((result) => {

        console.log(result)
    }).catch((err) => {
        console.log(err);
    });;
    res.status(201).json({
        message: 'Handling POST requests to /Connections',
        connection: connection
    });
});


router.put('/:senderUserEmailId/:receiverUserEmailId', (req, res, next) => {
    const senderUserEmailId = req.params.senderUserEmailId;
    const receiverUserEmailId = req.params.receiverUserEmailId;
    console.log(req.body.status+" "+senderUserEmailId+" "+receiverUserEmailId);
    Connection.updateOne( { senderUserEmailId : senderUserEmailId , receiverUserEmailId: receiverUserEmailId }, { $set: 
        { 
            status : req.body.status,
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

router.patch('/:senderUserEmailId/:receiverUserEmailId', (req, res, next) => {
    const senderUserEmailId = req.params.senderUserEmailId;
    const receiverUserEmailId = req.params.receiverUserEmailId;
    Connection.updateOne( { senderUserEmailId : senderUserEmailId , receiverUserEmailId: receiverUserEmailId }, { $set: 
        { 
            status : req.body.status,
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

router.delete("/:senderUserEmailId/:receiverUserEmailId", (req, res, next) => {
    const senderUserEmailId = req.params.senderUserEmailId;
    const receiverUserEmailId = req.params.receiverUserEmailId;
    Connection.remove({ senderUserEmailId : senderUserEmailId , receiverUserEmailId: receiverUserEmailId })
      .exec()
      .then(result => {
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;