export class MeasurementNotFoundError extends Error {
     constructor(){
          super("Medição não encontrada!")
          Object.setPrototypeOf(this, MeasurementNotFoundError.prototype);
     }
}


export class MeasurementsDuplicatedError extends Error {
     constructor(){
          super("Já existe uma medição com mesma data para essa estação")
          Object.setPrototypeOf(this, MeasurementsDuplicatedError.prototype);
     }
}


export class InvalidWindDirectionError extends Error {
     constructor(cardialPoints: string[] =[]){
          super(`Direção do vento deve ser um valor entre ( ${cardialPoints.map((v,i)=>`${v} `)} )`)
          Object.setPrototypeOf(this, InvalidWindDirectionError.prototype);
     }
}