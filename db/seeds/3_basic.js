const { users, addresses } = require('../test/initial_data')

exports.seed = async function(knex) {

  await knex('users').insert(users[0]);
  await knex('users_addresses').insert({user_id: users[0].id, address_id: addresses[0].id})
};



