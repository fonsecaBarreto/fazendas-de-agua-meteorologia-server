
const fs = require("fs");
const { v4 } = require("uuid");
const  { stations } = require('../test/initial_data')

const CardialPointsList = [ "N", "E", "S" ,"W" ,"NE" ,"SE" ,"SW" ,"NW" ];

const createMeasurement = ( station_id, i ) =>{
     const initial_date = new Date()
     initial_date.setMinutes( initial_date.getMinutes() - i )
     
     return ({
          id: v4(), station_id, coordinates: JSON.stringify([123,123,123]),
          created_at: initial_date,
          temperature: Math.floor( Math.random() * ( 20 ) + 20),
          airHumidity:  Math.floor( Math.random() * 100 ),
          windSpeed:  Math.floor( Math.random() * 20 ) + 10,
          windDirection: CardialPointsList[Math.floor( Math.random() * CardialPointsList.length )] ,
          rainVolume:  Math.floor( Math.random() * 50 ),
          accRainVolume:  Math.floor( Math.random() * 50 ) + 30
     })
}
const generateMultiplesMeasurements = async (dias =1, cb) =>{
     const MINUTOS_DIA = 1440
     const station_id = stations[0].id

     await Promise.all( [...Array(dias)].map( async (dk, d)=> {     

          var measurements = []
          await [ ...Array(MINUTOS_DIA)].map((nk,n)=>{
               measurements.push( createMeasurement(station_id,  ( d * MINUTOS_DIA ) + n ) );
          })     

          await cb(measurements)

     }))

}




module.exports = generateMultiplesMeasurements

