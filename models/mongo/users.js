const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bluebird = require('bluebird');
const crypto = require('crypto');
const SALT = require('../../cipher').PASSWORD_SALT;
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2);


const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number
  },
  password: String,
  phone: String,
})

UserSchema.index({
  name: 1
}, {
  unique: true
})
UserSchema.index({
  name: 1,
  age: 1
})

const DEFAULT_PROJECTION = {
  password: 0,
  __v: 0
}

const UserModel = mongoose.model('users', UserSchema);

async function createANewUser(params) {
  const users = new UserModel({
    name: params.name,
    age: params.age,
    phone: params.phone
  });
  users.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e => {
      console.log(e);
      throw Error('something go wrong in createANewUser password');
    })

  let creator = await users.save()
    .catch(e => {
      switch (e.code) {
        case 11000:
          throw Error('SomeOne has picked that name, choose an other!')
          break
        default:
          console.log(e);
          throw Error(`error creating user ${ JSON.stringify(params)}`)
          break
      }
    })
  return {
    id: creator._id,
    name: creator.name,
    age: creator.age
  }
}

async function getUsers(params = {
  page: 0,
  pageSize: 10
}) {
  let flow = UserModel.find({});
  flow.skip(params.page * params.pageSize);
  flow.limit(params.pageSize);
  flow.select(DEFAULT_PROJECTION);

  return await flow
    .catch(e => {
      console.log(e);
      throw new Error('error getting users from db')
    });
};

async function getUserById(userId) {
  let a = userId;
  return UserModel.findOne({
      _id: userId
    })
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e);
      throw new Error('error getting user By Id from db')
    });
};

async function updateUserById(userId, update) {
  const user = user.findOneAndUpdate({
      _id: userId,
      update,
      new: true
    })
    .catch(e => {
      console.log(e);
      throw new Error('error getting user By Id from db')
    });
};

async function login(params) {
  password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e => {
      next(e)
    })
  const user = await UserModel.findOne({
    phone: params.phone,
    password: password
  })
  if (!user) throw Error('user not find')
  return user
}

module.exports = {
  model: UserModel,
  createANewUser,
  getUsers,
  getUserById,
  login
};