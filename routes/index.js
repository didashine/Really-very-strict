const express = require('express');
const router = express.Router();
const users = require('../models/mongo/users');
const jwt = require('jsonwebtoken');
const SECRET = require('../cipher').JWT_SECRET

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/login', (req, res, next) => {
  (async() => {
    if (!req.body.phone) throw Error('phone is necessary')
    if (!req.body.phone) throw Error('password is necessary')
    let params = {
      phone: req.body.phone,
      password: req.body.password
    }
    let user = await users.login(params)
    const token = jwt.sign({_id: user._id, iat: Date.now(), expire: Date.now()+20000}, SECRET)
    return {
      code: 0,
      user: user,
      token: token
    }
  })()
  .then(r => {
      res.json(r)
    })
    .catch(e => {
      next(e)
    })
})

module.exports = router;