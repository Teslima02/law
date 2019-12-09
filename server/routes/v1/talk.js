const { Router } = require('express');
const Talk = require('../../models/v1/talk');
const Attendee = require('../../models/v1/attendee');
const router = Router();

/* eslint-disable no-underscore-dangle */
router.get('/', (req, res) => {
  Talk.find().exec((err, talks) => {
    if (err) {
      res.json(400, err);
      return;
    }
    res.json(talks);
  });
});

router.post('/', (req, res) => {
  const { title, content } = req.body;

  const newTalk = new Talk();
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

  Talk.findByIdAndUpdate(id, { title, content }, { new: true }, (err, data) => {
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
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  Talk.remove({ _id: { $in: id } }, err => {
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

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Attendee.find().exec((err, attendees) => {
    Talk.findById(id)
      .populate('users')
      .exec((err1, talk) => {
        if (err1) {
          res.status(400).json({
            success: false,
            message: 'Unable to Fetch Talk',
          });
          return;
        }
        res.status(200).json({
          success: true,
          // message: 'Talk Deleted Successfully',
          talk,
          attendees,
        });
      });
  });
});

router.post('/add/attendee/:id', (req, res) => {
  const { id } = req.params;
  const { attendeeId } = req.body;

  Talk.findById(id).exec((err1, talk) => {
    // talk.users = attendeeId;
    talk.users.push(attendeeId);
    talk.save((err, data) => {
      if (err) {
        res.status(400).json({
          success: false,
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: 'Attendee Added To Talk Successfully',
        data,
      });
    });
  });
});

module.exports = router;
