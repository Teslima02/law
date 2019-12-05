const { Router } = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
// const Branch = require('../../models/v1/branch');
const Product = require('../../models/v1/product');
const router = Router();
/* eslint-disable no-underscore-dangle */
router.get(
  '/restaurant/:branchId',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Product.find(
      {
        branch: mongoose.Types.ObjectId(req.params.branchId),
      },
      (err, products) => {
        if (err) {
          res.json([]);
          return;
        }
        res.json(products);
      },
    );
  },
);

router.put(
  '/restaurant/:branchId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { products } = req.body;
    // TODO: save products, create one's that have not ids and return products
    const nuProducts = [];
    const union = [];
    // Get new products
    while (products.length) {
      if (products[products.length - 1]._id) {
        break;
      }
      nuProducts.push({
        ...products.pop(),
        branch: mongoose.Types.ObjectId(req.params.branchId),
      });
    }

    if (nuProducts.length) {
      try {
        union.push(Product.insertMany(nuProducts, { new: true }));
      } catch (e) {
        res.json(500, e);
        return;
      }
    }
    try {
      products.flatMap(product =>
        Product.findOneAndUpdate(
          ({ _id: product._id }, product, { new: true }),
        ),
      );
      res.json(await Promise.all(products.concat(union.flat())));
    } catch (e) {
      res.json(500, e);
    }
  },
);

module.exports = router;
