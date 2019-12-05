const { Router } = require('express');
const passport = require('passport');
const _ = require('lodash');
const { Types } = require('mongoose');
const Branch = require('../../models/v1/branch');
const Account = require('../../models/v1/account');
const router = Router();
/* eslint-disable no-underscore-dangle */
router.get(
  '/business/:id/:service',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { id, service } = req.params;
    Branch.find({
      business: Types.ObjectId(id),
      service,
    })
      .populate({ path: 'agents', model: 'accounts' })
      .exec((err, branches) => {
        if (err || !branches) {
          res.json({ message: 'No Entity found!' });
          return;
        }
        const sent = branches.map(_branch => ({
          ..._branch.toObject(),
          agents: _branch
            .toObject()
            .agents.reduce((all, ag) => ({ [ag.role]: ag }), {}),
        }));
        res.json(sent);
      });
  },
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { business } = req.user;
    const {
      address,
      agents, // array obj
      city,
      cities,
      name,
      returnable,
      weekdays,
      returnPolicy,
      service,
      shortName,
    } = req.body;
    let branch;
    switch (service) {
      case 'restaurant':
        branch = new Branch({
          name,
          city,
          cities,
          address,
          returnable,
          weekdays,
          returnPolicy,
          business: Types.ObjectId(business),
          service,
        });
        break;
      case 'airtime':
        branch = new Branch({
          name,
          cities,
          shortName,
          returnable,
          returnPolicy,
          business: Types.ObjectId(business),
          service,
        });
        break;
      default:
        branch = new Branch();
    }
    try {
      await branch.save();
    } catch (e) {
      res.json(500, { message: 'Unable to create branch at the moment' });
      return;
    }
    let agent;
    let agent2;
    let sos;
    let cs;
    agent = {
      firstName: agents.agent.name.split(' ').shift(),
      lastName: agents.agent.name.split(' ').pop(),
      name: agents.agent.name,
      phone: agents.agent.phone,
      email: agents.agent.email,
      role: 'agent',
      business,
    };
    agent = await new Account(agent);
    await agent.setPassword(agents.agent.password || '123456789');
    try {
      await agent.save();
    } catch (e) {
      res.json(500, { message: 'Unable to create branch at the moment' });
      return;
    }

    if (agents.agent2 && agents.agent2.email && agents.agent2.name) {
      agent2 = {
        firstName: agents.agent2.name.split(' ').shift(),
        lastName: agents.agent2.name.split(' ').pop(),
        name: agents.agent2.name,
        phone: agents.agent2.phone,
        email: agents.agent2.email,
        username: agents.agent2.email,
        role: 'agent2',
        business,
      };
      agent2 = await new Account(agent2);
      await agent2.setPassword(agents.agent2.password || '123456789');
      await agent2.save();
    }

    if (agents.sos && agents.sos.email && agents.sos.name) {
      sos = {
        firstName: agents.sos.name.split(' ').shift(),
        lastName: agents.sos.name.split(' ').pop(),
        name: agents.sos.name,
        phone: agents.sos.phone,
        email: agents.sos.email,
        username: agents.sos.email,
        role: 'sos',
        business,
      };
      sos = await new Account(sos);
      await sos.setPassword(agents.sos.password || '123456789');
      await sos.save();
    }

    if (agents.cs && agents.cs.name && agents.cs.email && agents.cs.name) {
      cs = {
        firstName: agents.cs.name.split(' ').shift(),
        lastName: agents.cs.name.split(' ').pop(),
        name: agents.cs.name,
        phone: agents.cs.phone,
        email: agents.cs.email,
        username: agents.cs.email,
        role: 'cs',
        business,
      };
      cs = await new Account(cs);
      await cs.setPassword(agents.cs.password || '123456789');
      await cs.save();
    }
    branch.agents = _.compact([
      agent._id,
      agent2 ? agent2._id : false,
      sos ? sos._id : false,
      cs ? cs._id : false,
    ]);
    await branch.save();
    Branch.populate(
      branch,
      { path: 'agents', model: 'accounts' },
      (err, _branch) => {
        res.json({
          ..._branch.toObject(),
          agents: _branch
            .toObject()
            .agents.reduce((all, ag) => ({ [ag.role]: ag }), {}),
        });
      },
    );
  },
);

module.exports = router;
