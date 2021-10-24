exports.seed = async function(knex) {
  await knex('measurements').del()
 
};




