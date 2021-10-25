import CsvReader from '../CsvReader'
import fs from 'fs'
import path from 'path'

const MakeBuffer = () =>{
     const buffer = fs.readFileSync(path.resolve(__dirname,"test_measurement.csv"));
     const sut = new CsvReader({headers:["date", "hour", "temperature", "airHumidity", "windSpeed", "windDirection", "rainVolumne", "accRainVolume"]})
     return { buffer, sut }
}

describe("CsvReader", () =>{
     describe("read", () =>{
          test("should read a csv file", async () =>{
               const { buffer, sut } = MakeBuffer()
               const result = await sut.read(buffer);
               expect(result).toBeTruthy()
               expect(result).toEqual([
                   { date: "01/01/20", hour: "00:00:00", temperature: "32",  airHumidity: "1", windSpeed:"10",  windDirection:"NW", rainVolumne:"2", accRainVolume:"20"},
                   { date: "02/01/20", hour: "00:01:00", temperature: "33",  airHumidity: "2", windSpeed:"10",  windDirection:"N", rainVolumne:"2", accRainVolume:"22"},
                   { date: "03/01/20", hour: "00:02:00", temperature: "34",  airHumidity: "3", windSpeed:"10",  windDirection:"NW", rainVolumne:"2", accRainVolume:"24"},
                   { date: "04/01/20", hour: "00:03:00", temperature: "35",  airHumidity: "4", windSpeed:"12",  windDirection:"NW", rainVolumne:"2", accRainVolume:"26"},
                   { date: "05/01/20", hour: "00:04:00", temperature: "36",  airHumidity: "5", windSpeed:"10",  windDirection:"S", rainVolumne:"2", accRainVolume:"28"},
               ])
          })


     })
})



