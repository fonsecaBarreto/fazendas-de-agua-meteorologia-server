import CsvReader from '../../CsvReader'
import fs from 'fs'
import path from 'path'

const MakeBuffer = () =>{
     const buffer = fs.readFileSync(path.resolve(__dirname,"deniro.csv"));
     const brokenBuffer = fs.readFileSync(path.resolve(__dirname,"deniro-missing.csv"));
     return { buffer, brokenBuffer }
}

describe("CsvReader", () =>{
     describe("read", () =>{
          test("should read a csv file", async () =>{
               const { buffer } = MakeBuffer()
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

          test("should take the first line as header if no header were provided", async () =>{
               const { buffer } = MakeBuffer() 
               const sut = new CsvReader({})
               const result  = await sut.read(buffer);
               await expect(result).toBeTruthy()
          })

     })
})


