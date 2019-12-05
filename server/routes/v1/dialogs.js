const { Router } = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const Dialog = require('../../models/v1/dialog');
const MenuItem = require('../../models/v1/menu_item');
const router = Router();

router.get(
  '/:businessId/:businessType',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { businessId, businessType } = req.params;
    Dialog.find(
      { business: mongoose.Types.ObjectId(businessId), businessType },
      (err, cities) => {
        if (err) {
          res.json(500, { message: 'server error!' });
          return;
        }
        res.json(cities);
      },
    );
  },
);

router.get(
  '/:channel/menu',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    MenuItem.find({ node: 'root' }, (err, items) => {
      if (err) {
        res.json(500, { message: 'server error' });
        return;
      }
      res.json(items);
    });
  },
);

module.exports = router;
