let USER_ID_INIT = 10000;
const users = [];
class Users {
  constructor(params) {
    if(!params.name || !params.age) throw new Error('age and name require when create')
    this.name = params.name;
    this.age = params.age;
    this._id = USER_ID_INIT++;
  }
};

async function createANewUser(params) {
  const user = new Users(params);
  users.push(user);
  return user;
};

async function getUsers(params) {
  return users;
};

async function getUserById(userId) {
  return users.find(u=>u._id === userId);
};

async function updateUserById(userId, update) {
  const user =  user.find(u=>u._id === userId);
  if(update.name) user.name = update.name;
  if(update.age) user.age = update.age;
};

module.exports = {
  model: Users,
  createANewUser,
  getUsers,
  getUserById
};