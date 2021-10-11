import { ObjectValidator } from "../../../domain/Interfaces"


export const StationCreateSchema: ObjectValidator.Schema= {
     name: { "type": "string", "label": "Nome" },
     username: { "type": "string", "label": "Nome da estação" },
     password: { "type": "string", "label": "Senha de Acesso" },
     description: { "type": "string", "label": "Descrição" },
     longitude: { "type": "number", "label":"Longitude"},
     latitude: { "type": "number", "label":"Latitude"},
     altitude: { "type": "number", "label":"Altitude"},
     address_id: { type: "uuid", "label": "Endereço" },
}


