const { hashSync } = require("bcrypt");
const { v4 } = require("uuid");

const createUser = (role, username, name) =>({
  id: v4(),
  password: hashSync("123456",12), 
  username,
  role,
  name
})

const admins = [ createUser(1, "admin", "Administrador Teste") ]
exports.seed = async function(knex) {
  await knex('users').del()
  await knex('users').insert(admins);
};


