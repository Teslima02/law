const { Router } = require('express');
// const mongoose = require('mongoose');
const uuidv3 = require('uuid/v3');
const Channel = require('../../models/v1/channel');
const foreignAuth = require('../../helpers/v1/foreign_auth');
const router = Router();

router.post('/', foreignAuth, (req, res) => {
  const { domain, name, description } = req.body;
  Channel.findOne({ domain }, (err, channel) => {
    if (err) {
      res.json(500, { message: 'Server error, please try again!' });
      return;
    }
    if (channel) {
      res.json(409, { message: 'Channel already exists!' });
      return;
    }
    Channel.create({
      name,
      domain,
      description,
      secret: uuidv3(domain, uuidv3.URL),
    })
      .then(doc => res.json(201, { message: 'created successfully!', doc }))
      .catch(() =>
        res.json(500, {
          message: 'unable to create domain a  the moment, please try again!',
        }),
      );
  });
});

module.exports = router;
