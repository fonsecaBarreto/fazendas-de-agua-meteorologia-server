

const { v4 } = require("uuid");

const CardialPointsList = [ "N", "E", "S" ,"W" ,"NE" ,"SE" ,"SW" ,"NW" ];

const INITIAL_DATA =  new Date("2021-01-01");

const createMeasurement = ( station_id, date ) =>{
     return ({
          id: v4(), station_id, coordinates: JSON.stringify([123,123,123]),
          created_at: date.toISOString(),
          temperature: Math.floor( Math.random() * ( 40 ) + 10),
          airHumidity:  Math.floor( Math.random() * 100 ),
          windSpeed:  Math.floor( Math.random() * 20 ) + 10,
          windDirection: CardialPointsList[Math.floor( Math.random() * CardialPointsList.length )] ,
          rainVolume:  Math.floor( Math.random() * 50 ),
          accRainVolume:  Math.floor( Math.random() * 50 ) + 30
     })
}

const generateStationMeasurements = (station_id, dias =1) =>{

     var measurements = []
     const MINUTOS_DIA = 1440;
     var date = INITIAL_DATA;

     for(let m = 0 ; m < dias * MINUTOS_DIA ; m ++){
          var day = Math.floor(m / MINUTOS_DIA);
          date.setMinutes( date.getMinutes() + 1 ) 
          var med = createMeasurement(station_id, date );
          if(measurements[day]){
               measurements[day].push(med)
          }else{
               measurements[day] = [med]
          }
     }
     return measurements

}
module.exports = generateStationMeasurements
