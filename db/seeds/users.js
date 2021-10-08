const { hashSync } = require("bcrypt");
const { v4 } = require("uuid");

const createUser = () =>({
  id: v4(),
  name: "admin",
  username: "admin",
  password: hashSync("123456",12), 
  role: 1
})

exports.seed = async function(knex) {

  await knex('users').del()
  await knex('users').insert( [ createUser() ]);
   
};


