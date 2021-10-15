export namespace CsvReader {
     export type Config = {
          separator: string,
          quote: string,
          headers: string[]
     }

     export type Model = Record<string, string>
}

export interface CsvReader{
     read(file: Buffer ): Promise<any[]>
}