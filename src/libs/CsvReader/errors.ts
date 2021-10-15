export class InvalidCsvFile extends Error {
     constructor(err: Error){
          super("Não é um arquivo .csv Valido.")
          this.stack = err.stack;
          Object.setPrototypeOf(this, InvalidCsvFile.prototype);
     }
}

/* export class InvalidCsvRow extends Error {
     constructor(n:number){
          super(`Coluna vazia encontrada na linha de numero ${n} `)
          Object.setPrototypeOf(this, InvalidCsvFile.prototype);
     }
}
 */