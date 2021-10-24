const { addresses, stations } = require('../test/initial_data')

exports.seed = async function(knex) {
  await knex('stations').del()
  await knex('addresses').del()

  await knex('addresses').insert(addresses);
  await knex('stations').insert(stations);
};


