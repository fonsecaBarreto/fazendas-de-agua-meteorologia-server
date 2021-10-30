const generateMultiplesMeasurementsByDay = require("../test/test_measurements")

exports.seed = async function(knex) {

     await knex('measurements').del()

     await generateMultiplesMeasurementsByDay(30 * 12 , async (measurements) =>{
          await knex('measurements').insert(measurements)
     } )
};




