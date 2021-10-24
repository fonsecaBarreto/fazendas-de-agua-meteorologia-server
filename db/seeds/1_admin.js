const { admins } = require('../test/initial_data')

exports.seed = async function(knex) {
  await knex('users').del()
  await knex('users').insert(admins);
};


