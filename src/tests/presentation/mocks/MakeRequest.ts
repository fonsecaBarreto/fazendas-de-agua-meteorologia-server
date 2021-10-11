import { Request } from "../../../presentation/Protocols/Http"

export const MakeRequest = (req?: Partial<Request>):Request =>{
     return {
          params: {},
          query: {},
          headers: {},
          body:{},
          ...req
     }
}
