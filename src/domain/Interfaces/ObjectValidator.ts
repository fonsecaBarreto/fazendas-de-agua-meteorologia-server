
export namespace ObjectValidator{

    export interface Row {
        type: string,
        optional?: boolean,
        label?:string,
        missingMessage?:string,
        invalidMessage?:string
    }

    export type Schema= Record<string, Row>
    
    export interface ErrorsParams extends Record<string, string> {}
  
}

export interface ObjectValidator {
    validate(schema: ObjectValidator.Schema, params: Record<string, string>): Promise<ObjectValidator.ErrorsParams | null> ,
}




