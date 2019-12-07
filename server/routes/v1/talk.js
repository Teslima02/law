const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const mongoose = require('mongoose');
const Request = require('request');
const { v1 } = require('config');
const Account = require('../../models/v1/talk');
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get('/', (req, res) => {
  Account.find().exec((err, talks) => {
    if (err) {
      res.json(400, err);
      return;
    }
    res.json(talks);
  });
});

router.post('/', (req, res) => {
  const { title, content } = req.body;

  const newTalk = new Account();
  newTalk.title = title;
  newTalk.content = content;
  newTalk.save((err, data) => {
    if (err) {
      res.status(400).send('Unable to create talk');
    } else {
      res.status(200).json({
        success: true,
        message: 'Talk Created Successfully',
        data,
      });
    }
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  Account.findByIdAndUpdate(
    id,
    { title, content },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Unable to Update Talk',
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Talk Updated Successfully',
        data,
      });
    },
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  console.log(id, 'delete id')
  Account.remove({ _id: { $in: id } }, err => {
    if (err) {
      res.status(400).json({
        success: false,
        message: 'Unable to Delete Talk',
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: 'Talk Deleted Successfully',
    });
  });
});

module.exports = router;
