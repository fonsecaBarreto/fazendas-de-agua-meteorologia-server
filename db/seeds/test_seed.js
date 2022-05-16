const { admins, users, addresses, stations, measurements } = require('../test/initial.json')

exports.seed = async function(knex) {
  await knex('stations').del()
  await knex('addresses').del()
  await knex('users').del()
  await knex('users_addresses').del()
  await knex('measurements').del() 
  await knex('addresses').insert(addresses);
  await knex('stations').insert(stations);
  await knex('users').insert([...admins, ...users]);
  await knex('users_addresses').insert({user_id: users[0].id, address_id: addresses[0].id})
  await Promise.all(measurements.map( async dayMeasurements=>{
    await knex('measurements').insert(dayMeasurements)
  }))
};




