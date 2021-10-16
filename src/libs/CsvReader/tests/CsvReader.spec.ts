import CsvReader from '../CsvReader'
import fs from 'fs'

const MakeBuffer = () =>{
     const buffer = fs.readFileSync(__dirname+"/deniro.csv");
     const brokenBuffer = fs.readFileSync(__dirname+"/deniro-missing.csv");

     return { buffer, brokenBuffer }
}


describe("CsvReader", () =>{
     describe("read", () =>{
          test("should read a csv file", async () =>{
               const {  buffer } = MakeBuffer()
               const sut = new CsvReader({headers:["Ano", "Pontuação", "Titulo"]})
               const result = await sut.read(buffer);
               expect(result).toBeTruthy()
          })
          test("should read csv even if missing params", async () =>{
               const { brokenBuffer } = MakeBuffer()
               const sut = new CsvReader({headers:["Ano", "Pontuação", "Titulo"]})
               const result = await sut.read(brokenBuffer);
               await expect(result).toBeTruthy()
          })
          test("should read even if missing param", async () =>{
               const { buffer } = MakeBuffer() 
               const sut = new CsvReader({headers:["Ano", "Pontuação", "Titulo", 'Outro']})
               const result  = await sut.read(buffer);
               await expect(result).toBeTruthy()
          })

          test("should fill object even without header", async () =>{
               const { buffer } = MakeBuffer() 
               const sut = new CsvReader({})
               const result  = await sut.read(buffer);
               await expect(result).toBeTruthy()
          })

     })
})