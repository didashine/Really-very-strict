const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new mongoose.Schema({
  creator: Schema.Types.ObjectId,
  content: String,
})

const TopicSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true
  },
  title: {
    type: String,
    require: true
  },
  content: {
    type: String
  },
  content: String,
  replyList: [ReplySchema],
})

const TopicModel = mongoose.model('topic', TopicSchema);

async function createANewTopic(params) {
  const topic = new TopicModel({
    creator: params.creator,
    title: params.title,
    content: params.content,
  });
  return await topic.save()
    .catch(e => {
      throw Error(`error creating topic ${ JSON.stringify(params) }`);
    })
};

async function getTopics(params = {
  page: 0,
  pageSize: 10
}) {
  let flow = TopicModel.find({})
  flow.skip(Number(params.page) * Number(params.pageSize))
  flow.limit(Number(params.pageSize))
  return await flow
    .catch(e => {
      console.log(e)
      throw new Error('error getting users from db')
    })
};

async function getTopicById(topicId) {
  return await TopicModel.findOne({
      _id: topicId
    })
    .catch(e => {
      console.log(e)
      throw new Error(`error getting user by id: ${topicId}`)
    })
};

async function updateTopicById(topicId, update) {
  return await TopicModel.findOneAndUpdate({
      _id: userId
    }, update, {
      new: true
    })
    .catch(e => {
      console.log(e)
      throw new Error(`error updating user by id: ${userId}`)
    })
};

async function replyATopic(params) {
  return await TopicModel.findOneAndUpdate({
      _id: params.topicId
    }, {
      $push: {
        replyList: {
          creator: params.creator,
          content: params.content
        }
      }
    }, {
      new: true
    })
    .catch(e => {
      console.log(e)
      throw new Error(`error replying topic ${JSON.stringify(params)}`)
    })
};
module.exports = {
  model: TopicModel,
  createANewTopic,
  getTopics,
  getTopicById,
  replyATopic,
};