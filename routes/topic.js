const express = require('express');
const router = express.Router();
const Topics = require('../models/mongo/topic.js');
const Users = require('../models/mongo/users.js');

/* GET topics listing. */
router.route('/')
  .get((req, res, next) => {
    (async() => {
      let topics = await Topics.getTopics(req.query);
      return {
        code: 0,
        topics: topics
      }
    })()
    .then(r => {
      res.json(r)
     })
     .catch(e => {
      next(e);
     })
  })
  .post((req, res, next) => {
    (async() => {
      let user = await Users.getUserById(req.body.id);
      let topics = await Topics.createANewTopic({
        creator: user,
        title: req.body.title,
        content: req.body.content,
      });
      return {
        code: 0,
        topics: topics,
      }
    })()
    .then(r => {
        res.json(r);
      })
      .catch(e => {
        next(e);
      })
  })

router.route('/:id/reply')
  .post((req, res, next) => {
    (async() => {
      let user = await Users.getUserById(req.body.userId);
      let topics = await Topics.replyATopic({
        creator: user,
        topicId: req.params.id,
        content: req.body.content,
      });
      return {
        code: 0,
        topics: topics,
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