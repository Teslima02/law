const { Router } = require('express');
const Attendee = require('../../models/v1/attendee');
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get('/', (req, res) => {
  Attendee.find().exec((err, talks) => {
    if (err) {
      res.json(400, err);
      return;
    }
    res.json(talks);
  });
});

router.post('/', (req, res) => {
  const { firstName, lastName, email, address } = req.body;

  const newAttendee = new Attendee();
  newAttendee.firstName = firstName;
  newAttendee.lastName = lastName;
  newAttendee.email = email;
  newAttendee.address = address;
  newAttendee.save((err, data) => {
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
  const { firstName, lastName, email, address } = req.body;

  Attendee.findByIdAndUpdate(
    id,
    { firstName, lastName, email, address },
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
  Attendee.remove({ _id: { $in: id } }, err => {
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
