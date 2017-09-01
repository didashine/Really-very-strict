const express = require('express');
const router = express.Router();
const Users = require('../models/mongo/users.js');

/**
 * get 获取用户列表
 * post 创建新用户
 */
router.route('/')
  .get((req, res, next) => {
    (async() => {
      let users = await Users.getUsers();
      console.log(users);
      return {
        code: 0,
        users: users
      };
    })()
      .then(r => {
        res.json(r); 
      })
      .catch(e => {
        next(e);
      })
   // res.send('trying to get users list');
  })
  .post((req, res, next) => {
    (async() => {
      let users = await Users.createANewUser({
        name: req.body.name,
        age: req.body.age,
        password: req.body.password,
        phone: req.body.phone
      });
      return {
        code: 0,
        users: users,
      }
    })()
    .then(r => {
        res.json(r);
      })
      .catch(e => {
        console.log(e);
        next(e);
      })
  })

/**
 * get获取指定用户
 * patch 更新该用户信息
 */
router.route('/:id').get((req, res, next) => {
    (async() => {
      let user = await Users.getUserById(req.params.id);
      return {
        code: 0,
        user: user,
      }
    })()
    .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  })
  .patch((req, res, next) => {
     (async() => {
        let user = await Users.updateUserById(req.params.id, {
            name: req.body.name,
            age: req.body.age
          });
        return {
          code: 0,
          user: user,
        }
      })()
      .then(r => {
          res.json(r);
        })
        .catch(e => {
          next(e);
        })
  })

module.exports = router;